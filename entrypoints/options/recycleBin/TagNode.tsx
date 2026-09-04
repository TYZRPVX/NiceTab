import { useState } from 'react';
import { Modal, Tooltip } from 'antd';
import { DeleteOutlined, ExportOutlined, TagOutlined } from '@ant-design/icons';
import { TagItem } from '~/entrypoints/types';
import { useIntlUtls } from '~/entrypoints/common/hooks/global';
import { recycleUtils } from '~/entrypoints/common/storage';
import { ENUM_COLORS } from '~/entrypoints/common/constants';
import ActionIconBtn from '~/entrypoints/common/components/ActionIconBtn';
import { StyledTagNode } from './index.styled';

export default function TagNode({
  tag,
  onRemove,
  onRecover,
}: {
  tag: TagItem;
  onRemove: () => void;
  onRecover: () => void;
}) {
  const { $fmt } = useIntlUtls();
  const [removeModalVisible, setRemoveModalVisible] = useState<boolean>(false);
  const [recoverModalVisible, setRecoverModalVisible] = useState<boolean>(false);

  // 删除分类
  const handleRemove = async () => {
    if (!tag?.tagId) return;
    await recycleUtils.removeTag(tag.tagId);
    onRemove?.();
  };
  // 还原分类
  const handleRecover = async () => {
    if (!tag?.tagId) return;
    await recycleUtils.recoverTag(tag);
    onRecover?.();
  };

  /* 删除弹窗、确认、取消 */
  // 删除弹窗
  const openConfirmModal = () => {
    setRemoveModalVisible(true);
  };

  // 确认删除
  const handleRemoveConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleRemove();
    setRemoveModalVisible(false);
  };
  // 取消删除
  const handleRemoveCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRemoveModalVisible(false);
  };

  /* 还原弹窗、确认、取消 */
  // 删除弹窗
  const openRecoverModal = () => {
    setRecoverModalVisible(true);
  };

  // 确认删除
  const handleRecoverConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleRecover?.();
    setRecoverModalVisible(false);
  };
  // 取消删除
  const handleRecoverCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecoverModalVisible(false);
  };

  return (
    <StyledTagNode>
      <TagOutlined style={{ fontSize: '16px' }} />
      <div className="tag-name">
        {tag.static ? $fmt('home.stagingArea') : tag.tagName}
      </div>
      <span className="count" style={{ color: ENUM_COLORS.volcano }}>
        {$fmt({
          id: 'home.tabGroup.count',
          values: { count: tag?.groupList?.length || 0 },
        })}
      </span>
      <div className="action-btns">
        <Tooltip
          title={$fmt('home.tag.remove')}
          placement="top"
          mouseEnterDelay={0.3}
          destroyTooltipOnHide
        >
          <ActionIconBtn
            className="action-btn"
            size={16}
            hoverColor={ENUM_COLORS.red}
            label={$fmt('home.tag.remove')}
            btnStyle="icon"
            onClick={openConfirmModal}
          >
            <DeleteOutlined />
          </ActionIconBtn>
        </Tooltip>
        <Tooltip
          title={$fmt('home.tag.recover')}
          placement="top"
          mouseEnterDelay={0.3}
          destroyTooltipOnHide
        >
          <ActionIconBtn
            className="action-btn"
            size={16}
            label={$fmt('home.tag.recover')}
            btnStyle="icon"
            onClick={openRecoverModal}
          >
            <ExportOutlined />
          </ActionIconBtn>
        </Tooltip>
      </div>

      {/* 删除提示 */}
      {removeModalVisible && (
        <Modal
          title={$fmt('home.removeTitle')}
          width={400}
          centered
          open={removeModalVisible}
          onOk={handleRemoveConfirm}
          onCancel={handleRemoveCancel}
        >
          <div>{$fmt({ id: 'home.removeDesc', values: { type: $fmt('home.tag') } })}</div>
        </Modal>
      )}
      {recoverModalVisible && (
        <Modal
          title={$fmt('home.recoverTitle')}
          width={400}
          centered
          open={recoverModalVisible}
          onOk={handleRecoverConfirm}
          onCancel={handleRecoverCancel}
        >
          <div>
            {$fmt({ id: 'home.recoverDesc', values: { type: $fmt('home.tag') } })}
          </div>
        </Modal>
      )}
    </StyledTagNode>
  );
}
