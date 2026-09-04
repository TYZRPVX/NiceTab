import {
  memo,
  useMemo,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Button, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {
  Virtuoso,
  VirtuosoHandle,
  type FlatIndexLocationWithAlign,
} from 'react-virtuoso';
import { useIntlUtls } from '~/entrypoints/common/hooks/global';
import type { GroupItem } from '~/entrypoints/types';
import type { TreeDataNodeTag, TreeDataNodeTabGroup, MoveToCallbackProps } from './types';
import { StyledGroupList } from './Home.styled';
import TabGroup from './TabGroup';
import { HomeContext } from './hooks/treeData';
import { getSelectedCounts } from './utils';

const ListItem = memo(
  ({ tabGroup, group }: { tabGroup: TreeDataNodeTabGroup; group: GroupItem }) => {
    const { treeDataHook } = useContext(HomeContext);
    const {
      // selectedTagKey,
      selectedTabGroupKey,
      handleSelect,
      refreshTreeData,
      handleTabGroupRemove,
      handleTabGroupCreate,
      handleTabGroupChange,
      handleTabGroupStarredChange,
      handleTabGroupDedup,
      handleTabGroupCopy,
      handleTabGroupRestore,
    } = treeDataHook;

    // const settings = settingsUtils.settings || {};

    // 移动单个标签组
    const handleTabGroupMoveTo = async ({
      moveData,
      targetData,
      selected,
    }: MoveToCallbackProps) => {
      refreshTreeData(treeData => {
        if (selected) {
          const { groupId, tabs } = moveData || {};
          const { targetTagId, targetGroupId } = targetData || {};
          if (!groupId) return;
          // 如果是移动标签页的话，则不需要重新选择标签组
          if (tabs && tabs?.length > 0) return;
          if (!targetTagId) return;

          let group = null;
          for (let tag of treeData) {
            if (!!targetTagId && tag.key !== targetTagId) continue;
            if (!targetGroupId) {
              handleSelect(treeData, [targetTagId], { node: tag as TreeDataNodeTag });
              break;
            }
            for (let g of tag.children || []) {
              if (g.key === targetGroupId) {
                group = g;
                break;
              }
            }
          }
          group &&
            handleSelect(treeData, [groupId], { node: group as TreeDataNodeTabGroup });
        }
      });
    };

    return (
      <TabGroup
        key={tabGroup.key}
        tagId={tabGroup.parentKey}
        tagLocked={tabGroup.parentData?.isLocked}
        selected={tabGroup.key === selectedTabGroupKey}
        // refreshKey={
        //   !virtual && tabGroup.key === selectedTabGroupKey ? refreshKey : undefined
        // }
        {...group}
        // actionBtnStyle={settings.groupActionBtnStyle || 'icon'}
        actionBtnStyle="icon"
        onChange={data => handleTabGroupChange(tabGroup, data)}
        onRemove={() => handleTabGroupRemove(tabGroup)}
        onCreate={handleTabGroupCreate}
        onRestore={() => handleTabGroupRestore(tabGroup)}
        onStarredChange={isStarred => handleTabGroupStarredChange(tabGroup, isStarred)}
        onDedup={() => handleTabGroupDedup(tabGroup)}
        onCopy={handleTabGroupCopy}
        onMoveTo={handleTabGroupMoveTo}
      ></TabGroup>
    );
  },
);

export default function TabGroupList({ virtual }: { virtual?: boolean }) {
  const { $fmt } = useIntlUtls();
  const { treeDataHook } = useContext(HomeContext);
  const {
    loading,
    selectedTagKey,
    selectedTabGroupKey,
    selectedTag,
    selectedTagData,
    handleTabGroupCreate,
  } = treeDataHook;
  const selectedTabGroupRef = useRef<HTMLDivElement>(null);
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  const counts = useMemo(() => {
    return getSelectedCounts(selectedTagData);
  }, [selectedTagData]);

  const groups = selectedTagData?.groupList || [];
  const canCreateGroup = !!selectedTagKey && !selectedTagData?.isLocked;
  const handleCreateGroup = useCallback(() => {
    if (canCreateGroup) handleTabGroupCreate(selectedTagKey!);
  }, [canCreateGroup, handleTabGroupCreate, selectedTagKey]);
  const getTreeGroup = useCallback(
    (groupId: React.Key) =>
      selectedTag?.children?.find(group => group.key === groupId) as
        TreeDataNodeTabGroup | undefined,
    [selectedTag],
  );

  const initialConfig = useMemo(() => {
    const index =
      selectedTag?.children?.findIndex(group => group.key === selectedTabGroupKey) || 0;
    return {
      index: index > -1 ? index : 0,
      align: 'start',
      behavior: 'auto',
      offset: -180,
    } as FlatIndexLocationWithAlign;
  }, [selectedTag, selectedTabGroupKey]);
  const [prevSelectedTagKey, setPrevSelectedTagKey] = useState(selectedTagKey);
  const scrollHandler = useCallback(() => {
    if (virtual && virtuosoRef.current) {
      const index =
        selectedTag?.children?.findIndex(group => group.key === selectedTabGroupKey) || 0;
      virtuosoRef.current?.scrollToIndex({
        index: index > -1 ? index : 0,
        align: 'start',
        behavior: 'auto',
        offset: -180,
      });
    } else if (!virtual && selectedTabGroupRef.current) {
      // const offsetTop = selectedTabGroupRef.current?.offsetTop || 0;
      // window.scrollTo({ top: offsetTop - 100, behavior: 'instant' });

      const pagePaddingTop = 100;
      const body = document.documentElement || document.body;
      const scrollTop = body.scrollTop;
      const groupTop = selectedTabGroupRef.current?.offsetTop || 0;
      if (groupTop < scrollTop + pagePaddingTop) {
        body.scrollTo(0, groupTop - pagePaddingTop - 60);
      } else if (groupTop + pagePaddingTop + 240 > window.innerHeight + scrollTop) {
        body.scrollTo(0, groupTop + pagePaddingTop - window.innerHeight + 400);
      }
    }
  }, [virtual, selectedTag, selectedTabGroupKey]);

  useEffect(() => {
    if (selectedTagKey === prevSelectedTagKey) {
      scrollHandler();
    } else {
      setTimeout(() => {
        setPrevSelectedTagKey(selectedTagKey);
        scrollHandler();
      }, 100);
    }
  }, [selectedTagKey, selectedTabGroupKey]);

  return (
    <StyledGroupList className="main-content-wrapper">
      {/* {virtual && (
        <div className="tip">
          <Typography.Text type="warning">{$fmt('home.tip.tooManyTabs')}</Typography.Text>
        </div>
      )} */}
      <div className="count-info">
        <span className="count-item">{$fmt('home.tag.countInfo')}：</span>
        <span className="count-item">
          {$fmt('home.tabGroup')} ({counts?.groupCount})
        </span>
        <span className="count-item">
          {$fmt('home.tab')} ({counts?.tabCount})
        </span>
      </div>

      {!loading && groups.length === 0 ? (
        <div className="no-data">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={$fmt('home.emptyTip')}>
            {canCreateGroup && (
              <Button
                type="primary"
                size="small"
                icon={<PlusOutlined />}
                onClick={handleCreateGroup}
              >
                {$fmt('home.createTabGroup')}
              </Button>
            )}
          </Empty>
        </div>
      ) : virtual ? (
        <Virtuoso
          ref={virtuosoRef}
          useWindowScroll
          initialTopMostItemIndex={initialConfig}
          overscan={4}
          increaseViewportBy={{ top: 320, bottom: 320 }}
          data={groups}
          itemContent={(_index, group) => {
            const tabGroup = getTreeGroup(group.groupId);
            return tabGroup ? <ListItem tabGroup={tabGroup} group={group} /> : null;
          }}
        />
      ) : (
        groups.map(group => {
          const tabGroup = getTreeGroup(group.groupId);
          return (
            tabGroup && (
              <div
                ref={tabGroup.key === selectedTabGroupKey ? selectedTabGroupRef : null}
                key={tabGroup.key}
              >
                <ListItem tabGroup={tabGroup} group={group} />
              </div>
            )
          );
        })
      )}
    </StyledGroupList>
  );
}
