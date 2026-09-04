import React, { useMemo, useRef, useCallback, memo, useContext } from 'react';
import { theme, Dropdown, Tooltip } from 'antd';
import { CloseOutlined, MenuOutlined, MoreOutlined } from '@ant-design/icons';
import { eventEmitter, useIntlUtls } from '~/entrypoints/common/hooks/global';
import { ENUM_COLORS, UNNAMED_TAG, UNNAMED_GROUP } from '~/entrypoints/common/constants';
import { getDisplayGroupName, getDisplayTagName } from '~/entrypoints/common/utils';
import { StyledActionIconBtn } from '~/entrypoints/common/style/Common.styled';
import EditInput from '~/entrypoints/options/components/EditInput';
import DropComponent from '~/entrypoints/common/components/DropComponent';
import { dndKeys, defaultGroupActions, defaultTagActions } from '../constants';
import type { RenderTreeNodeProps, TagActionName, GroupActionName } from '../types';
import useGroupActions from '../hooks/groupActions';
import useTagActions from '../hooks/tagActions';
import { StyledTreeNodeItem } from '../Home.styled';
import { HomeContext, type TreeDataHookProps } from '../hooks/treeData';
import { eventEmitter as homeEventEmitter } from '../hooks/homeCustomEvent';

// 渲染 treeNode 节点
function RenderTreeNode({ node, onAction }: RenderTreeNodeProps) {
  const { token } = theme.useToken();
  const { $fmt } = useIntlUtls();
  const nodeRef = useRef<HTMLDivElement>(null);
  const { treeDataHook } = useContext(HomeContext);
  const { tagList } = treeDataHook;
  const unnamedNodeName = node.type === 'tag' ? UNNAMED_TAG : UNNAMED_GROUP;

  const treeNodeDisplayName = useMemo(() => {
    if (node.type !== 'tabGroup') {
      return getDisplayTagName({ tagName: node.title || unnamedNodeName });
    }

    return getDisplayGroupName({
      groupName: node.originData?.groupName || node.title,
      previewTitle: node.originData?.previewTitle,
    });
  }, [node, unnamedNodeName]);

  // 是否锁定
  const isLocked = useMemo(() => {
    if (node.type === 'tag') {
      return node.originData?.isLocked;
    }

    return node?.originData?.isLocked || node?.parentData?.isLocked;
  }, [node]);

  // 是否是中转站
  const isStaticTag = useMemo(() => {
    return node.type === 'tag' && !!node?.originData?.static;
  }, [node]);

  const tagId = useMemo(
    () => (node.type === 'tabGroup' ? (node.parentKey as string) : (node.key as string)),
    [node],
  );
  // 标签组操作相关
  const groupId = useMemo(
    () => (node.type === 'tabGroup' ? (node.key as string) : ''),
    [node],
  );

  const onGroupAction = useCallback(
    (actionName: GroupActionName, groupId: string) => {
      onAction?.({ actionType: 'tabGroup', node, actionName, data: { groupId } });
    },
    [node, onAction],
  );

  const getTabList = useCallback(() => {
    if (node.type !== 'tabGroup') return [];
    return (
      tagList
        .find(tag => tag.tagId === node.parentKey)
        ?.groupList.find(group => group.groupId === node.key)?.tabList || []
    );
  }, [node, tagList]);

  const { groupActions } = useGroupActions({
    groupId,
    tagId,
    tagLocked: node.type === 'tabGroup' && !!node.parentData?.isLocked,
    isLocked: node.type === 'tabGroup' && !!node.originData?.isLocked,
    isStarred: node.type === 'tabGroup' && !!node.originData?.isStarred,
    tabCount: node.type === 'tabGroup' ? node.originData?.tabCount : 0,
    getTabList,
    allowGroupActions: defaultGroupActions,
    onAction: onGroupAction,
  });

  const groupMenuItems = useMemo(() => {
    const items = [...groupActions.outerList];
    if (groupActions.innerList.length > 0) {
      items.push({
        key: 'more',
        label: $fmt('common.more'),
        icon: <MoreOutlined />,
        children: groupActions.innerList,
      });
    }
    return items;
  }, [groupActions]);

  // 分类操作相关
  const onTagAction = useCallback(
    (actionName: TagActionName, tagId: string) => {
      if (actionName === 'create') {
        onAction?.({ actionType: 'tabGroup', node, actionName, data: { tagId } });
      } else {
        onAction?.({ actionType: 'tag', node, actionName, data: { tagId } });
      }
    },
    [node, onAction],
  );

  const { tagMenuItems } = useTagActions({
    tagId: tagId as string,
    isStatic: node.type === 'tag' && !!node.originData?.static,
    isLocked: node.type === 'tag' && !!node.originData?.isLocked,
    groupCount: node.type === 'tag' ? node.originData?.groupCount : 0,
    allowTagActions: defaultTagActions,
    onAction: onTagAction,
  });

  const onRemoveClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onAction?.({ actionType: node.type, node, actionName: 'remove' });
    },
    [onAction],
  );

  const handleRenameChange = useCallback(
    (value?: string) => {
      const fieldKey = node.type === 'tag' ? 'tagName' : 'groupName';
      onAction?.({
        actionType: node.type,
        node,
        actionName: 'rename',
        data: { [fieldKey]: value || unnamedNodeName },
      });
    },
    [onAction],
  );

  // 这个 onTabItemDrop 只是为了方便右侧面板的标签页拖拽到左侧树的标签组，左侧树中的 分类和标签组的拖拽由 antd 的 Tree 组件自带实现
  const onTabItemDrop: TreeDataHookProps['handleTabItemDrop'] = useCallback(
    params => {
      const from = params?.sourceData?.from || 'tab-list';
      const _params = { ...params };

      if (from === 'tab-list') {
        _params.actionType = 'tab2group';
      }
      // 从已打开的浏览器标签页拖拽到树节点
      else if (from === 'opened-tabs') {
        _params.actionType = 'opened2group';
      }
      // 从已打开的浏览器标签组拖拽到树节点
      else if (from === 'opened-tab-group') {
        _params.actionType = 'opened2tag';
      }

      homeEventEmitter.emit('home:treeDataHook', {
        action: 'handleTabItemDrop',
        params: [_params],
      });
    },
    [node],
  );

  // 编辑状态禁止node节点拖拽
  const handleEditingStatusChange = useCallback((status: boolean) => {
    // console.log('handleEditingStatusChange', status);
    const draggableTreeNode = nodeRef.current?.closest(
      '.nicetab-tree-treenode-draggable',
    );
    draggableTreeNode?.setAttribute('draggable', status ? 'false' : 'true');
    eventEmitter.emit('home:set-editing-status', status);
  }, []);

  const handleInputClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const dragData = useMemo(() => {
    const tagId = (node.type === 'tag' ? node.key : node.parentKey) as string;
    const groupId = (node.type === 'tag' ? '' : node.key) as string;
    return {
      index: 0,
      tagId,
      groupId,
      nodeType: node.type,
      nodeName:
        node.type === 'tag' ? node.originData?.tagName : node.originData?.groupName,
      nodeData: node.originData,
      allowKeys:
        node.type === 'tag'
          ? [dndKeys.tabGroupItem]
          : [dndKeys.tabItem, dndKeys.tabGroupItem],
    };
  }, [node]);

  return (
    // 这个 DropComponent 只是为了方便右侧面板的标签页拖拽到左侧树的标签组，左侧树中的 分类和标签组的拖拽由 antd 的 Tree 组件自带实现
    <DropComponent
      data={dragData}
      // canDrop={node.type === 'tabGroup'}
      onDrop={onTabItemDrop}
    >
      <>
        <StyledTreeNodeItem ref={nodeRef} className="tree-node-item">
          <span style={{ marginRight: '4px' }}>{node.icon}</span>
          {isStaticTag ? (
            <span className="tree-node-title static">
              {$fmt('home.stagingArea') || node.title}
            </span>
          ) : (
            <span className="tree-node-title">
              <EditInput
                value={node.title || unnamedNodeName}
                displayValue={treeNodeDisplayName}
                disabled={isLocked}
                visible={!isLocked}
                fontSize={14}
                iconSize={14}
                onValueChange={handleRenameChange}
                onEditingStatusChange={handleEditingStatusChange}
                onClick={handleInputClick}
              ></EditInput>
            </span>
          )}

          <span className="tree-node-icon-group">
            {node.type === 'tag' && (
              <Dropdown
                menu={{ items: tagMenuItems }}
                arrow
                trigger={['click']}
                destroyPopupOnHide
              >
                <Tooltip
                  title={$fmt('common.more')}
                  placement="top"
                  mouseEnterDelay={0.3}
                  destroyTooltipOnHide
                >
                  <StyledActionIconBtn
                    className="btn-more"
                    $size="14"
                    aria-label={$fmt('common.more')}
                    onClick={e => e.stopPropagation()}
                  >
                    <MenuOutlined />
                  </StyledActionIconBtn>
                </Tooltip>
              </Dropdown>
            )}

            {node.type === 'tabGroup' && (
              <Dropdown
                menu={{ items: groupMenuItems }}
                arrow
                trigger={['click']}
                destroyPopupOnHide
              >
                <Tooltip
                  title={$fmt('common.more')}
                  placement="top"
                  mouseEnterDelay={0.3}
                  destroyTooltipOnHide
                >
                  <StyledActionIconBtn
                    className="btn-more"
                    $size="14"
                    aria-label={$fmt('common.more')}
                    onClick={e => e.stopPropagation()}
                  >
                    <MenuOutlined />
                  </StyledActionIconBtn>
                </Tooltip>
              </Dropdown>
            )}

            {!isLocked && !isStaticTag && (
              <Tooltip
                title={$fmt('common.remove')}
                placement="top"
                mouseEnterDelay={0.3}
                destroyTooltipOnHide
              >
                <StyledActionIconBtn
                  className="btn-remove"
                  $size="14"
                  aria-label={$fmt('common.remove')}
                  $hoverColor={ENUM_COLORS.red}
                  onClick={onRemoveClick}
                >
                  <CloseOutlined />
                </StyledActionIconBtn>
              </Tooltip>
            )}
          </span>
        </StyledTreeNodeItem>
      </>
    </DropComponent>
  );
}

export default memo(RenderTreeNode);
