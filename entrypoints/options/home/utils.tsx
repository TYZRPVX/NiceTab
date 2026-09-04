import type { TreeProps } from 'antd';
import dayjs from 'dayjs';
import {
  PushpinOutlined,
  TagOutlined,
  ProductOutlined,
  LockOutlined,
  StarOutlined,
} from '@ant-design/icons';
import {
  getDisplayGroupName,
  getDisplayTagName,
  getLocaleMessages,
  newCreateTime,
} from '~/entrypoints/common/utils';
import type { GroupItem, TagItem } from '~/entrypoints/types';
import type { TreeDataNodeUnion, MoveDataProps, CascaderOption } from './types';

export type ListEntry =
  | {
      type: 'day';
      key: string;
      dayKey: string | null;
    }
  | {
      type: 'starred';
      key: 'starred';
    }
  | {
      type: 'tag';
      key: string;
      tagId: string;
    }
  | {
      type: 'group';
      key: string;
      groupId: string;
      tagId?: string;
    };

export type RecycleGroupSource = {
  tagId: string;
  groupId: string;
  createTime?: string;
};

const getCreateTimestamp = (createTime?: string) => {
  if (!createTime?.trim()) return null;

  const value = dayjs(createTime);
  const timestamp = value.valueOf();
  return value.isValid() && Number.isFinite(timestamp) ? timestamp : null;
};

export const getDayKey = (createTime?: string) => {
  if (getCreateTimestamp(createTime) === null) return null;
  return dayjs(createTime).format('YYYY-MM-DD');
};

// Sort date buckets while keeping the source order within each day.
const sortByDayDesc = <T extends { createTime?: string }>(items: T[]) => {
  return items
    .map((item, index) => ({
      item,
      index,
      dayKey: getDayKey(item.createTime),
    }))
    .sort((a, b) => {
      if (a.dayKey === null && b.dayKey === null) return a.index - b.index;
      if (a.dayKey === null) return 1;
      if (b.dayKey === null) return -1;
      return b.dayKey.localeCompare(a.dayKey) || a.index - b.index;
    })
    .map(({ item }) => item);
};

const sortByCreateTimeDesc = <T extends { createTime?: string }>(items: T[]) => {
  return items
    .map((item, index) => ({
      item,
      index,
      timestamp: getCreateTimestamp(item.createTime),
    }))
    .sort((a, b) => {
      if (a.timestamp === null && b.timestamp === null) return a.index - b.index;
      if (a.timestamp === null) return 1;
      if (b.timestamp === null) return -1;
      return b.timestamp - a.timestamp || a.index - b.index;
    })
    .map(({ item }) => item);
};

const appendDateGroupedEntries = (
  entries: ListEntry[],
  groups: Array<{ groupId: string; createTime?: string; tagId?: string }>,
) => {
  let currentDayToken: string | undefined;

  groups.forEach(group => {
    const dayKey = getDayKey(group.createTime);
    const dayToken = dayKey || '__unknown__';

    if (dayToken !== currentDayToken) {
      entries.push({
        type: 'day',
        key: `day:${dayToken}`,
        dayKey,
      });
      currentDayToken = dayToken;
    }

    entries.push({
      type: 'group',
      key: group.tagId
        ? `group:${group.tagId}:${group.groupId}`
        : `group:${group.groupId}`,
      groupId: group.groupId,
      tagId: group.tagId,
    });
  });
};

export const getHomeListEntries = (
  groups: Array<Pick<GroupItem, 'groupId' | 'createTime' | 'isStarred'>>,
): ListEntry[] => {
  const entries: ListEntry[] = [];
  const starredGroups = groups.filter(group => group.isStarred);

  if (starredGroups.length > 0) {
    entries.push({ type: 'starred', key: 'starred' });
    starredGroups.forEach(group => {
      entries.push({
        type: 'group',
        key: `group:${group.groupId}`,
        groupId: group.groupId,
      });
    });
  }

  appendDateGroupedEntries(
    entries,
    sortByDayDesc(groups.filter(group => !group.isStarred)),
  );

  return entries;
};

export const getRecycleListEntries = (groups: RecycleGroupSource[]): ListEntry[] => {
  const entries: ListEntry[] = [];
  const sortedGroups = sortByCreateTimeDesc(groups);
  let currentDayToken: string | undefined;
  let previousTagId: string | undefined;
  let tagBlockIndex = 0;

  sortedGroups.forEach(group => {
    const dayKey = getDayKey(group.createTime);
    const dayToken = dayKey || '__unknown__';

    if (dayToken !== currentDayToken) {
      entries.push({
        type: 'day',
        key: `day:${dayToken}`,
        dayKey,
      });
      currentDayToken = dayToken;
      previousTagId = undefined;
    }

    if (group.tagId !== previousTagId) {
      entries.push({
        type: 'tag',
        key: `tag:${dayToken}:${group.tagId}:${tagBlockIndex}`,
        tagId: group.tagId,
      });
      previousTagId = group.tagId;
      tagBlockIndex += 1;
    }

    entries.push({
      type: 'group',
      key: `group:${group.tagId}:${group.groupId}`,
      groupId: group.groupId,
      tagId: group.tagId,
    });
  });

  return entries;
};

// 生成treeData
export const getTreeData = (tagList: TagItem[]): TreeDataNodeUnion[] => {
  return tagList.map(tag => {
    const { groupList, ...tagMeta } = tag;
    const tabCount = groupList.reduce((count, group) => count + group.tabList.length, 0);

    return {
      type: 'tag',
      key: tag.tagId,
      title: getDisplayTagName(tag),
      isLeaf: false,
      icon: tag.static ? (
        <PushpinOutlined />
      ) : tag.isLocked ? (
        <LockOutlined />
      ) : (
        <TagOutlined />
      ),
      originData: {
        ...tagMeta,
        createTime: newCreateTime(tag.createTime),
        groupCount: groupList.length,
        tabCount,
      },
      children: groupList.map(group => {
        const { tabList, ...groupMeta } = group;
        const previewTitle = tabList.find(item => item.title?.trim())?.title?.trim();
        return {
        type: 'tabGroup',
        parentKey: tag.tagId,
        parentData: { isLocked: tag.isLocked, isStarred: tag.isStarred },
        key: group.groupId,
        title: getDisplayGroupName(group),
        isLeaf: true,
        icon: group.isLocked ? (
          <LockOutlined />
        ) : group.isStarred ? (
          <StarOutlined />
        ) : (
          <ProductOutlined />
        ),
          originData: {
            ...groupMeta,
            createTime: newCreateTime(group.createTime),
            tabCount: tabList.length,
            previewTitle,
          },
        };
      }),
    };
  });
};

// 获取当前分类下的标签组和标签组页数量
export const getSelectedCounts = (tag?: Pick<TagItem, 'groupList'>) => {
  const groupCount = tag?.groupList?.length || 0;
  let tabCount = 0;
  tag?.groupList?.forEach(group => {
    tabCount += group.tabList?.length || 0;
  });
  return { groupCount, tabCount };
};

// 判断能否拖拽到节点上
export const checkAllowDrop: TreeProps<TreeDataNodeUnion>['allowDrop'] = ({
  dragNode,
  dropNode,
  dropPosition,
}) => {
  // console.log('checkAllowDrop--dragNode', dragNode)
  // console.log('checkAllowDrop--dropNode', dropNode)
  // console.log('checkAllowDrop--dropPosition', dropPosition)

  // dropPosition = 0 时表示，拖放到目标 node 的子集
  // dropPosition = 1 时表示，拖放到目标 node 的同级之后
  // dropPosition = -1 时表示，拖放到目标 node 的同级之前
  if (
    (dragNode.type === 'tag' && dragNode?.originData?.static) ||
    (dropNode.type === 'tag' && dropNode?.originData?.static && dropPosition == -1)
  ) {
    // 中转站永远置顶，不允许其他分类排到它前面
    return false;
  }

  return (
    (dragNode.type === 'tabGroup' && dropNode.type === 'tabGroup') ||
    (dragNode.type === 'tag' && dropNode.type === 'tag' && dropPosition !== 0) ||
    (dragNode.type === 'tabGroup' && dropNode.type === 'tag' && dropPosition >= 0)
  );
};

// 生成Cascader级联数据
export const getCascaderData = async (
  tagList: TagItem[],
  moveData?: MoveDataProps,
): Promise<CascaderOption[]> => {
  const localeMessage = await getLocaleMessages();
  const { tagId, groupId, tabs } = moveData || {};
  const moveType = tagId ? 'tag' : tabs && tabs?.length > 0 ? 'tab' : 'tabGroup';
  const tagDisabled = (tag: TagItem) => {
    if (moveType === 'tag') {
      return tag.tagId === tagId;
    } else if (moveType === 'tabGroup') {
      return tag?.groupList.some(g => g.groupId === groupId);
    } else {
      return tag?.groupList?.length === 0;
    }
  };

  return tagList.map(tag => ({
    type: 'tag',
    value: tag.tagId,
    label: (
      <div className="cascader-label-custom cascader-label-tag">
        <TagOutlined />
        <span className="label-name">
          {tag.static ? localeMessage?.['home.stagingArea'] : getDisplayTagName(tag)}
        </span>
      </div>
    ),
    disabled: tagDisabled(tag),
    // isLeaf: false,
    originData: { ...tag },
    children: tag?.groupList?.map(group => {
      return {
        type: 'tabGroup',
        value: group.groupId,
        label: (
          <div className="cascader-label-custom cascader-label-group">
            <ProductOutlined />
            <span className="label-name">{getDisplayGroupName(group)}</span>
          </div>
        ),
        disabled: moveType !== 'tab' || group.groupId === groupId,
        parentKey: tag.tagId,
        isLeaf: true,
        originData: { ...group },
      };
    }),
  }));
};

// 生成全量的Cascader级联数据，发送标签页时选择指定分类或者标签组
export const getTotalCascaderData = async (
  tagList: TagItem[],
): Promise<CascaderOption[]> => {
  const localeMessage = await getLocaleMessages();

  return tagList.map(tag => ({
    type: 'tag',
    value: tag.tagId,
    label: (
      <div className="cascader-label-custom cascader-label-tag">
        <TagOutlined />
        <span className="label-name">
          {tag.static ? localeMessage?.['home.stagingArea'] : getDisplayTagName(tag)}
        </span>
      </div>
    ),
    // isLeaf: false,
    originData: { ...tag },
    children: tag?.groupList?.map(group => {
      return {
        type: 'tabGroup',
        value: group.groupId,
        label: (
          <div className="cascader-label-custom cascader-label-group">
            <ProductOutlined />
            <span className="label-name">{getDisplayGroupName(group)}</span>
          </div>
        ),
        parentKey: tag.tagId,
        isLeaf: true,
        originData: { ...group },
      };
    }),
  }));
};

export default {
  getTreeData,
  getCascaderData,
};
