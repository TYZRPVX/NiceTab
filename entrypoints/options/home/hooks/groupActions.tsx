import { useMemo, useCallback, useContext } from 'react';
import {
  CloseOutlined,
  LockOutlined,
  UnlockOutlined,
  StarOutlined,
  ExportOutlined,
  SendOutlined,
  CopyOutlined,
  BlockOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  RetweetOutlined,
} from '@ant-design/icons';
import copyToClipboard from 'copy-to-clipboard';
import { ENUM_SETTINGS_PROPS, ENUM_COLORS } from '~/entrypoints/common/constants';
import { GlobalContext, useIntlUtls } from '~/entrypoints/common/hooks/global';
import { settingsUtils, tabListUtils } from '~/entrypoints/common/storage';
import { type ActionOptionItem } from '~/entrypoints/common/components/ActionBtnList';
import type { TabItem, IntlForamtMessageParams } from '~/entrypoints/types';
import type { LocaleKeys } from '~/entrypoints/common/locale';
import type { GroupActionName } from '../types';
import { defaultGroupActions, groupActionOptions, type ActionOption } from '../constants';

const { GROUP_ACTION_BTNS_COMMONLY_USED } = ENUM_SETTINGS_PROPS;
const MAX_VISIBLE_GROUP_ACTIONS = 3;
const DEFAULT_VISIBLE_GROUP_ACTIONS: GroupActionName[] = ['restore', 'lock', 'star'];

export function copyLinksToClipboard(
  tabList: TabItem[],
  $message: { success: (msg: string) => void; error: (msg: string) => void },
  $fmt: (
    idOrFormatMsg: LocaleKeys | IntlForamtMessageParams,
    options?: Record<string, any>,
  ) => string,
) {
  const tabLinks = tabListUtils.copyLinks(tabList);
  const result = copyToClipboard(tabLinks);
  if (result) {
    $message.success($fmt('common.CopySuccess'));
  } else {
    $message.error($fmt('common.CopyFailed'));
  }
}

interface UseGroupActionsProps {
  groupId: string;
  tagId?: string;
  tagLocked?: boolean;
  isLocked?: boolean;
  isStarred?: boolean;
  tabList?: TabItem[];
  tabCount?: number;
  getTabList?: () => TabItem[];
  allowGroupActions?: GroupActionName[];
  onAction: (actionName: GroupActionName, groupId: string) => void;
}

interface UseGroupActionsReturn {
  getGroupActionOptions: () => ActionOptionItem[];
  groupActions: {
    outerList: ActionOptionItem[];
    innerList: ActionOptionItem[];
  };
}

export default function useGroupActions({
  groupId,
  tagId,
  tagLocked,
  isLocked,
  isStarred,
  tabList = [],
  tabCount = tabList.length,
  getTabList,
  allowGroupActions = defaultGroupActions,
  onAction,
}: UseGroupActionsProps): UseGroupActionsReturn {
  const { $fmt } = useIntlUtls();
  const { $message } = useContext(GlobalContext);

  const handleCopyLinks = useCallback(() => {
    copyLinksToClipboard(getTabList?.() || tabList, $message, $fmt);
  }, [getTabList, tabList, $message, $fmt]);

  const getGroupActionOptions = useCallback(() => {
    const actionMap = groupActionOptions.reduce(
      (result, option) => {
        result[option.actionName] = option;
        return result;
      },
      {} as Record<GroupActionName, ActionOption>,
    );

    const btns: ActionOptionItem[] = [
      {
        key: 'remove',
        label: $fmt(actionMap['remove'].labelKey),
        icon: <CloseOutlined />,
        disabled: tagLocked || isLocked,
        hoverColor: ENUM_COLORS.red,
        danger: true,
        onClick: () => onAction('remove', groupId),
      },
      {
        key: 'restore',
        label: $fmt(actionMap['restore'].labelKey),
        icon: <ExportOutlined />,
        disabled: !tabCount,
        onClick: () => onAction('restore', groupId),
      },
      {
        key: 'addGroupBefore',
        label: $fmt(actionMap['addGroupBefore'].labelKey),
        icon: <ArrowUpOutlined />,
        onClick: () => onAction('addGroupBefore', groupId),
      },
      {
        key: 'addGroupAfter',
        label: $fmt(actionMap['addGroupAfter'].labelKey),
        icon: <ArrowDownOutlined />,
        onClick: () => onAction('addGroupAfter', groupId),
      },
      {
        key: 'lock',
        label: $fmt(isLocked ? 'home.tabGroup.unlock' : 'home.tabGroup.lock'),
        disabled: tagLocked,
        icon: isLocked ? <UnlockOutlined /> : <LockOutlined />,
        onClick: () => onAction('lock', groupId),
      },
      {
        key: 'star',
        label: $fmt(isStarred ? 'home.tabGroup.unstar' : 'home.tabGroup.star'),
        disabled: tagLocked,
        icon: <StarOutlined />,
        onClick: () => onAction('star', groupId),
      },
      {
        key: 'moveTo',
        label: $fmt(actionMap['moveTo'].labelKey),
        disabled: tagLocked,
        icon: <SendOutlined />,
        onClick: () => onAction('moveTo', groupId),
      },
      {
        key: 'copyLinks',
        label: $fmt(actionMap['copyLinks'].labelKey),
        icon: <CopyOutlined />,
        onClick: handleCopyLinks,
      },
      {
        key: 'clone',
        label: $fmt(actionMap['clone'].labelKey),
        disabled: tagLocked,
        icon: <RetweetOutlined />,
        onClick: () => onAction('clone', groupId),
      },
      {
        key: 'dedup',
        label: $fmt(actionMap['dedup'].labelKey),
        icon: <BlockOutlined />,
        disabled: tagLocked || isLocked,
        onClick: () => onAction('dedup', groupId),
      },
      {
        key: 'tabsSortAsc',
        label: $fmt(actionMap['tabsSortAsc'].labelKey),
        icon: <SortAscendingOutlined />,
        disabled: tagLocked || isLocked,
        onClick: () => onAction('tabsSortAsc', groupId),
      },
      {
        key: 'tabsSortDesc',
        label: $fmt(actionMap['tabsSortDesc'].labelKey),
        icon: <SortDescendingOutlined />,
        disabled: tagLocked || isLocked,
        onClick: () => onAction('tabsSortDesc', groupId),
      },
    ];

    return btns.filter(item => {
      const isAllowed = allowGroupActions.includes(item.key as GroupActionName);
      return isAllowed;
    });
  }, [
    $fmt,
    allowGroupActions,
    tagLocked,
    groupId,
    isLocked,
    isStarred,
    onAction,
    handleCopyLinks,
  ]);

  const groupActions = useMemo(() => {
    const settings = settingsUtils.settings;
    const outerList: ActionOptionItem[] = [],
      innerList: ActionOptionItem[] = [];

    const groupActionBtnOptions = getGroupActionOptions();
    const configuredCommonActions = settings[GROUP_ACTION_BTNS_COMMONLY_USED];
    const commonActionKeys = Array.isArray(configuredCommonActions)
      ? configuredCommonActions
      : DEFAULT_VISIBLE_GROUP_ACTIONS;
    const commonActionKeySet = new Set(commonActionKeys);
    const visibleActions = groupActionBtnOptions
      .filter(item => commonActionKeySet.has(item.key))
      .sort((a, b) => {
        const aIndex = DEFAULT_VISIBLE_GROUP_ACTIONS.indexOf(a.key as GroupActionName);
        const bIndex = DEFAULT_VISIBLE_GROUP_ACTIONS.indexOf(b.key as GroupActionName);
        if (aIndex === -1 && bIndex === -1) return 0;
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      })
      .slice(0, MAX_VISIBLE_GROUP_ACTIONS);
    const visibleActionKeys = new Set(visibleActions.map(item => item.key));

    groupActionBtnOptions.forEach(item => {
      if (visibleActionKeys.has(item.key)) {
        outerList.push(item);
      } else {
        innerList.push(item);
      }
    });

    return { outerList, innerList };
  }, [getGroupActionOptions]);

  return {
    getGroupActionOptions,
    groupActions,
  };
}
