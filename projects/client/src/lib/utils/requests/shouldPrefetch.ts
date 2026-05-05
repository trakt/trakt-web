type ShouldPrefetchParams = {
  isBot: boolean;
  url: URL;
};

export const PREFETCH_SHARE_PARAM = 'share';

export function shouldPrefetch({ isBot, url }: ShouldPrefetchParams): boolean {
  return isBot || url.searchParams.has(PREFETCH_SHARE_PARAM);
}
