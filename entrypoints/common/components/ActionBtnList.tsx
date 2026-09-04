import type { GetProp, MenuProps } from 'antd';
import { theme, Space, Divider, Dropdown, Popconfirm, Tooltip } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import type { ReactNode } from 'react';
import { ActionBtnStyle } from '~/entrypoints/types';
import { useIntlUtls } from '~/entrypoints/common/hooks/global';
import ActionIconBtn from '~/entrypoints/common/components/ActionIconBtn.tsx';

type menuItem = GetProp<MenuProps, 'items'>[number];
export type ActionConfirmation = {
  title: ReactNode;
  description?: ReactNode;
  okText?: string;
  cancelText?: string;
  okButtonProps?: { danger?: boolean };
};

export type ActionOptionItem = menuItem & {
  key: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  hoverColor?: string;
  validator?: () => boolean;
  onClick?: () => void;
  confirm?: ActionConfirmation;
};

const actionGroupMap: Record<string, string> = {
  lock: 'mark',
  star: 'mark',
  moveTo: 'sync',
  copyLinks: 'sync',
  dedup: 'refine',
  tabsSortAsc: 'refine',
  tabsSortDesc: 'refine',
};

function getActionGroup(key: string) {
  return actionGroupMap[key] || 'structure';
}

export default function ActionBtnList({
  actionBtnStyle = 'text',
  outerList = [],
  innerList = [],
  iconSize = 16,
  gap = 20,
}: {
  actionBtnStyle?: ActionBtnStyle;
  outerList: ActionOptionItem[];
  innerList?: ActionOptionItem[];
  iconSize?: number;
  gap?: number;
}) {
  const { token } = theme.useToken();
  const { $fmt } = useIntlUtls();

  const actionButtons = outerList.flatMap((item, index) => {
    const previousItem = outerList[index - 1];
    const showGroupDivider =
      actionBtnStyle === 'icon' &&
      !!previousItem &&
      getActionGroup(previousItem.key) !== getActionGroup(item.key);

    const actionButtonContent = (
      <ActionIconBtn
        className="action-btn"
        label={item.label}
        btnStyle={actionBtnStyle}
        hoverColor={item.hoverColor}
        size={iconSize}
        disabled={item.disabled}
        onClick={item.confirm ? undefined : item.onClick}
      >
        {actionBtnStyle === 'icon' ? item.icon : item.label}
      </ActionIconBtn>
    );
    const actionButton =
      actionBtnStyle === 'icon' ? (
        <Tooltip
          key={item.key}
          title={item.label}
          placement="top"
          mouseEnterDelay={0.3}
          destroyTooltipOnHide
        >
          {actionButtonContent}
        </Tooltip>
      ) : (
        <span key={item.key}>{actionButtonContent}</span>
      );

    const renderedAction =
      item.confirm && !item.disabled ? (
        <Popconfirm
          key={item.key}
          title={item.confirm.title}
          description={item.confirm.description}
          okText={item.confirm.okText}
          cancelText={item.confirm.cancelText}
          okButtonProps={item.confirm.okButtonProps}
          onConfirm={item.onClick}
        >
          <span className="action-btn-confirm-target">{actionButton}</span>
        </Popconfirm>
      ) : (
        actionButton
      );

    if (!showGroupDivider) return [renderedAction];

    return [
      <Divider
        type="vertical"
        key={`divider-${item.key}`}
        style={{ height: 16, margin: 0, background: token.colorBorder }}
      />,
      renderedAction,
    ];
  });

  return (
    <Space
      className="group-action-btns"
      size={actionBtnStyle === 'text' ? 0 : gap}
      split={
        actionBtnStyle === 'text' ? (
          <Divider type="vertical" style={{ background: token.colorBorder }} />
        ) : null
      }
    >
      {actionButtons}
      {innerList.length > 0 && (
        <Dropdown menu={{ items: innerList }} destroyPopupOnHide>
          <span className="action-btn">
            {actionBtnStyle === 'icon' ? (
              <Tooltip
                title={$fmt('common.more')}
                placement="top"
                mouseEnterDelay={0.3}
                destroyTooltipOnHide
              >
                <ActionIconBtn
                  label={$fmt('common.more')}
                  btnStyle={actionBtnStyle}
                  size={iconSize}
                >
                  <MoreOutlined />
                </ActionIconBtn>
              </Tooltip>
            ) : (
              <ActionIconBtn
                label={$fmt('common.more')}
                btnStyle={actionBtnStyle}
                size={iconSize}
              >
                {$fmt('common.more')}
              </ActionIconBtn>
            )}
          </span>
        </Dropdown>
      )}
    </Space>
  );
}
