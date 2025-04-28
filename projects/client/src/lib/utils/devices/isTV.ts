import { extractOS } from './extractOS.ts';

function isAndroidTV(userAgent: string): boolean {
  const agent = userAgent.toLowerCase();

  const isAndroid = extractOS(userAgent) === 'android';

  const isGoogleTV = agent.includes('tv');
  const isChromecast = agent.includes('chromecast');

  const isGoogleTVLike = isGoogleTV || isChromecast;

  return isAndroid &&
    isGoogleTVLike;
}

export function isTV(userAgent: string | Nil) {
  if (!userAgent) {
    return false;
  }

  return isAndroidTV(userAgent);
}
