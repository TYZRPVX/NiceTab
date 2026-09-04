import { handleUrlWidthParams, getOrigin } from './url';

const faviconCache = new Map<string, { expiresAt: number; url: string }>();
const FAVICON_CACHE_LIMIT = 256;
const FAVICON_CACHE_TTL = 5 * 60 * 1000;

function pruneFaviconCache(now: number) {
  for (const [key, value] of faviconCache) {
    if (value.expiresAt <= now) faviconCache.delete(key);
  }
  while (faviconCache.size >= FAVICON_CACHE_LIMIT) {
    const oldestKey = faviconCache.keys().next().value;
    if (!oldestKey) break;
    faviconCache.delete(oldestKey);
  }
}

// Chromium caches this extension endpoint. Keep only a small, short-lived URL cache here.
export function getFaviconByExtApi(pageUrl: string, size: number = 32) {
  const apiUrl = browser.runtime.getURL('/_favicon/');
  return handleUrlWidthParams(apiUrl, { pageUrl, size });
}

export function getFaviconUrl(pageUrl: string, size: number = 32) {
  const now = Date.now();
  const cacheKey = `${getOrigin(pageUrl)}:${size}`;
  const cached = faviconCache.get(cacheKey);
  if (cached && cached.expiresAt > now) return cached.url;

  pruneFaviconCache(now);
  const url = getFaviconByExtApi(pageUrl, size);
  faviconCache.set(cacheKey, { url, expiresAt: now + FAVICON_CACHE_TTL });
  return url;
}

export function clearFaviconCache() {
  faviconCache.clear();
}

export default {
  getFaviconUrl,
  clearFaviconCache,
};
