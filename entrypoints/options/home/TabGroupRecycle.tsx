import { useEffect, useRef, useState, useMemo, memo } from 'react';
import { theme, Skeleton, Modal, Tooltip } from 'antd';
import {
  LockOutlined,
  StarOutlined,
  CloseOutlined,
  RollbackOutlined,
} from '@ant-design/icons';
import { GroupItem } from '~/entrypoints/types';
import ActionIconBtn from '~/entrypoints/common/components/ActionIconBtn';
import { ENUM_COLORS, UNNAMED_GROUP } from '~/entrypoints/common/constants';
import { useIntlUtls } from '~/entrypoints/common/hooks/global';
import { getDisplayGroupName } from '~/entrypoints/common/utils';

import TabListItem from './TabListItem';
import {
  StyledGroupWrapper,
  StyledGroupStickyHeader,
  StyledGroupHeaderRecycle,
  StyledTabListWrapper,
} from './TabGroup.styled';

type TabGroupProps = GroupItem & {
  canDrag?: boolean;
  canDrop?: boolean;
  allowGroupActions?: string[];
  selected?: boolean;
  onRemove?: () => void;
  onRecover?: () => void;
};

const defaultGroupActions = ['remove', 'recover'];

function TabGroup({
  groupId,
  groupName,
  createTime,
  tabList,
  isLocked,
  isStarred,
  selected,
  allowGroupActions = defaultGroupActions,
  onRemove,
  onRecover,
}: TabGroupProps) {
  const { token } = theme.useToken();
  const { $fmt } = useIntlUtls();
  const groupRef = useRef<HTMLDivElement>(null);
  const [rendering, setRendering] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [recoverModalVisible, setRecoverModalVisible] = useState(false);

  const group = useMemo(
    () => ({ groupId, groupName, createTime, isLocked, isStarred, selected }),
    [groupId, groupName, createTime, isLocked, isStarred, selected],
  );

  const tabListHeight = useMemo(() => {
    return tabList.length * 36 || 24;
  }, [tabList]);

  const groupDisplayName = useMemo(
    () => getDisplayGroupName({ groupName, tabList }),
    [groupName, tabList],
  );

  const removeDesc = useMemo(() => {
    const typeName = $fmt(`home.tabGroup`);
    return $fmt({
      id: 'home.removeDesc',
      values: {
        type: `${typeName}${` <strong>[${groupDisplayName}]</strong>`}`,
      },
    });
  }, [$fmt, groupDisplayName]);

  const handleTabGroupRemove = () => {
    setModalVisible(false);
    onRemove?.();
  };

  const handleTabGroupRecover = () => {
    setRecoverModalVisible(false);
    onRecover?.();
  };

  useEffect(() => {
    let timer = null;
    if (selected || tabList.length < 120) {
      setRendering(false);
      return;
    }

    timer = setTimeout(() => {
      setRendering(false);
    }, 10);
    return () => clearTimeout(timer);
  }, [selected, tabList.length]);
  // useEffect(() => {
  //   setRendering(false);
  // }, []);

  if (rendering) return <Skeleton />;

  return (
    <>
      <StyledGroupWrapper
        className="tab-group-wrapper"
        data-gid={groupId}
        $active={selected}
        ref={groupRef}
      >
        {/* 标签组 header 展示、操作区域 */}
        <StyledGroupStickyHeader $active={selected}>
          <StyledGroupHeaderRecycle className="group-header select-none">
            <div className="group-header-top">
              {(isLocked || isStarred) && (
                <div className="group-status-wrapper">
                  {isLocked && (
                    <LockOutlined
                      style={{ fontSize: '18px', color: token.colorPrimaryHover }}
                    />
                  )}
                  {isStarred && (
                    <StarOutlined
                      style={{ fontSize: '18px', color: token.colorPrimaryHover }}
                    />
                  )}
                </div>
              )}
              <div className="group-name-wrapper">
                <span className="text-readonly">{groupDisplayName || UNNAMED_GROUP}</span>
              </div>
              <div className="group-info">
                <span className="tab-count" style={{ color: ENUM_COLORS.volcano }}>
                  {$fmt({
                    id: 'home.tab.count',
                    values: { count: tabList?.length || 0 },
                  })}
                </span>
              </div>
            </div>
            <div className="group-action-btns">
              {allowGroupActions.includes('remove') && !isLocked && (
                <Tooltip
                  title={$fmt('home.tabGroup.remove')}
                  placement="top"
                  mouseEnterDelay={0.3}
                  destroyTooltipOnHide
                >
                  <ActionIconBtn
                    className="action-btn"
                    size={16}
                    hoverColor={ENUM_COLORS.red}
                    label={$fmt('home.tabGroup.remove')}
                    btnStyle="icon"
                    onClick={() => setModalVisible(true)}
                  >
                    <CloseOutlined />
                  </ActionIconBtn>
                </Tooltip>
              )}
              {allowGroupActions.includes('recover') && (
                <Tooltip
                  title={$fmt('home.tabGroup.recover')}
                  placement="top"
                  mouseEnterDelay={0.3}
                  destroyTooltipOnHide
                >
                  <ActionIconBtn
                    className="action-btn"
                    size={16}
                    label={$fmt('home.tabGroup.recover')}
                    btnStyle="icon"
                    onClick={() => setRecoverModalVisible(true)}
                  >
                    <RollbackOutlined />
                  </ActionIconBtn>
                </Tooltip>
              )}
            </div>
          </StyledGroupHeaderRecycle>
        </StyledGroupStickyHeader>

        {/* tab 列表 */}
        <StyledTabListWrapper
          className="tab-list-wrapper"
          style={{ minHeight: `${tabListHeight}px` }}
        >
          {tabList.map((tab, index) => (
            <TabListItem
              key={tab.tabId || index}
              tag={{ isLocked: false }}
              group={group}
              {...tab}
              selectable={false}
              showItemActions={false}
            />
          ))}
        </StyledTabListWrapper>
      </StyledGroupWrapper>

      {/* 标签组删除确认弹窗 */}
      {modalVisible && (
        <Modal
          title={$fmt('home.removeTitle')}
          width={400}
          centered
          open={modalVisible}
          onOk={handleTabGroupRemove}
          onCancel={() => setModalVisible(false)}
        >
          <div dangerouslySetInnerHTML={{ __html: removeDesc }}>
            {/* {$fmt({ id: 'home.removeDesc', values: { type: $fmt(`home.tabGroup`) } })} */}
          </div>
        </Modal>
      )}
      {/* 还原确认弹窗 */}
      {recoverModalVisible && (
        <Modal
          title={$fmt('home.recoverTitle')}
          width={400}
          centered
          open={recoverModalVisible}
          onOk={handleTabGroupRecover}
          onCancel={() => setRecoverModalVisible(false)}
        >
          <div>
            {$fmt({ id: 'home.recoverDesc', values: { type: $fmt('home.tabGroup') } })}
          </div>
        </Modal>
      )}
    </>
  );
}

export default memo(TabGroup);
