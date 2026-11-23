import { isEqual } from 'lodash-es';
// import { storage } from 'wxt/storage';
import type { ThemeProps } from '~/entrypoints/types';
import { PRIMARY_COLOR, THEME_COLORS } from '../constants';

export default class ThemeUtils {
  storageKey: `local:${string}` = 'local:theme';
  defaultTheme = {
    colorPrimary: PRIMARY_COLOR,
  };
  themeData = this.defaultTheme;
  normalizeTheme(theme: Partial<ThemeProps> = {}) {
    const isCurrentColor = THEME_COLORS.some(
      item => item.color.toLowerCase() === theme.colorPrimary?.toLowerCase(),
    );
    return {
      ...this.defaultTheme,
      ...theme,
      colorPrimary: isCurrentColor ? theme.colorPrimary! : PRIMARY_COLOR,
    };
  }
  async getThemeData() {
    const theme = await storage.getItem<ThemeProps>(this.storageKey);
    return this.normalizeTheme(theme || {});
  }
  async setThemeData(theme: Partial<ThemeProps>) {
    const themeData = await this.getThemeData();
    const nextTheme = this.normalizeTheme({ ...themeData, ...theme });
    const saved = await storage.getItem<ThemeProps>(this.storageKey);
    if (!isEqual(saved, nextTheme)) {
      await storage.setItem(this.storageKey, nextTheme);
    }
    this.themeData = nextTheme;
    return this.themeData;
  }
}
