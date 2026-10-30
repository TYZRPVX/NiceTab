import { useMemo } from 'react';
import {
  XIcon,
  PlusIcon,
  ExternalLinkIcon,
  FolderInputIcon,
  LockIcon,
  LockOpenIcon,
  ArrowDownAZIcon,
  ArrowUpZAIcon,
} from '~/entrypoints/common/components/icon/Icons';
import { useIntlUtls } from '~/entrypoints/common/hooks/global';
import { type ActionOptionItem } from '~/entrypoints/common/components/ActionBtnList';
import type { TagActionName } from '../types';
import { tagActionOptions, type ActionOption } from '../constants';

interface UseTagActionsProps {
  tagId: string;
  isStatic?: boolean;
  isLocked?: boolean;
  groupCount?: number;
  allowTagActions?: TagActionName[];
  onAction: (actionName: TagActionName, tagId: string) => void;
}

interface UseTagActionsReturn {
  tagMenuItems: ActionOptionItem[];
}

export default function useTagActions({
  tagId,
  isStatic = false,
  isLocked = false,
  groupCount = 0,
  allowTagActions = [],
  onAction,
}: UseTagActionsProps): UseTagActionsReturn {
  const { $fmt } = useIntlUtls();

  const tagMenuItems = useMemo(() => {
    const actionMap = tagActionOptions.reduce(
      (result, option) => {
        result[option.actionName as TagActionName] = option;
        return result;
      },
      {} as Record<TagActionName, ActionOption<'tag'>>,
    );

    const btns: ActionOptionItem[] = [
      {
        key: 'remove',
        label: $fmt(actionMap['remove'].labelKey),
        icon: <XIcon />,
        disabled: isLocked,
        danger: true,
        onClick: () => onAction('remove', tagId),
      },
      {
        key: 'create',
        label: $fmt(actionMap['create'].labelKey),
        icon: <PlusIcon />,
        disabled: isLocked,
        onClick: () => onAction('create', tagId),
      },
      {
        key: 'lock',
        label: $fmt(isLocked ? 'home.tag.unlock' : 'home.tag.lock'),
        icon: isLocked ? <LockOpenIcon /> : <LockIcon />,
        disabled: isStatic,
        onClick: () => onAction('lock', tagId),
      },
      {
        key: 'restore',
        label: $fmt('home.tag.open'),
        icon: <ExternalLinkIcon />,
        disabled: !groupCount,
        onClick: () => onAction('restore', tagId),
      },
      {
        key: 'moveTo',
        label: $fmt(actionMap['moveTo'].labelKey),
        icon: <FolderInputIcon />,
        disabled: isLocked,
        onClick: () => onAction('moveTo', tagId),
      },
      {
        key: 'sortByNameAsc',
        label: $fmt({
          id: 'common.ascending',
          values: { sortBy: $fmt('home.tabGroup.name') },
        }),
        icon: <ArrowDownAZIcon />,
        disabled: isLocked,
        onClick: () => onAction('sortByNameAsc', tagId),
      },
      {
        key: 'sortByNameDesc',
        label: $fmt({
          id: 'common.descending',
          values: { sortBy: $fmt('home.tabGroup.name') },
        }),
        icon: <ArrowUpZAIcon />,
        disabled: isLocked,
        onClick: () => onAction('sortByNameDesc', tagId),
      },
      {
        key: 'sortByCreateTimeAsc',
        label: $fmt({
          id: 'common.ascending',
          values: { sortBy: $fmt('home.tabGroup.createTime') },
        }),
        icon: <ArrowDownAZIcon />,
        disabled: isLocked,
        onClick: () => onAction('sortByCreateTimeAsc', tagId),
      },
      {
        key: 'sortByCreateTimeDesc',
        label: $fmt({
          id: 'common.descending',
          values: { sortBy: $fmt('home.tabGroup.createTime') },
        }),
        icon: <ArrowUpZAIcon />,
        disabled: isLocked,
        onClick: () => onAction('sortByCreateTimeDesc', tagId),
      },
    ];

    return btns.filter(item => {
      return allowTagActions.includes(item.key as TagActionName);
    });
  }, [$fmt, allowTagActions, isLocked, tagId, onAction]);

  return { tagMenuItems };
}
