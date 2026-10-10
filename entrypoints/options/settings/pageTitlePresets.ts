import type { PageTitleConfigItem, SettingsProps } from '~/entrypoints/types';

// Loaded with settings UI only: 22 fixed rules, no cache or history access.
const sites: readonly (readonly [string, string])[] = [
  ['zhihu.com', '知乎'],
  ['youtube.com', 'YouTube'],
  ['youtu.be', 'YouTube'],
  ['taobao.com', '淘宝'],
  ['tmall.com', '天猫'],
  ['x.com', 'X'],
  ['twitter.com', 'X'],
  ['bilibili.com', '哔哩哔哩'],
  ['b23.tv', '哔哩哔哩'],
  ['reddit.com', 'Reddit'],
  ['xiaohongshu.com', '小红书'],
  ['xhslink.com', '小红书'],
  ['spotify.com', 'Spotify'],
  ['v2ex.com', 'V2EX'],
  ['weibo.com', '微博'],
  ['weibo.cn', '微博'],
  ['douyin.com', '抖音'],
  ['douban.com', '豆瓣'],
  ['instagram.com', 'Instagram'],
  ['tiktok.com', 'TikTok'],
  ['netflix.com', 'Netflix'],
  ['twitch.tv', 'Twitch'],
];

export const leisurePageTitlePresets: readonly PageTitleConfigItem[] = sites.map(
  ([domain, title]) => ({
    mode: 'regex',
    url: `^https?://(?:[^/?#:@]+\\.)*${domain.replace(/\./g, '\\.')}(?::\\d+)?(?:[/?#]|$)`,
    title,
  }),
);

export function mergeLeisurePageTitlePresets(
  existing: readonly PageTitleConfigItem[] = [],
): { rules: PageTitleConfigItem[]; addedCount: number } {
  const keys = new Set(
    existing.map(rule => JSON.stringify([rule.mode || 'equal', rule.url])),
  );
  const additions = leisurePageTitlePresets.filter(
    rule => !keys.has(JSON.stringify([rule.mode || 'equal', rule.url])),
  );
  return {
    rules: [
      ...existing.map(rule => ({ ...rule })),
      ...additions.map(rule => ({ ...rule })),
    ],
    addedCount: additions.length,
  };
}

/** Save only title rules against the latest persisted settings, never other form drafts. */
export async function saveLeisurePageTitlePresets(
  existing: readonly PageTitleConfigItem[],
  getSettings: () => Promise<SettingsProps>,
  saveSettings: (settings: SettingsProps) => Promise<void>,
) {
  const result = mergeLeisurePageTitlePresets(existing);
  const settings = await getSettings();
  await saveSettings({ ...settings, pageTitleConfig: result.rules });
  return result;
}
