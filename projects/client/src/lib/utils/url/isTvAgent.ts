function isAndroidTv(userAgent: string): boolean {
  const agent = userAgent.toLowerCase();
  return agent.includes('android') &&
    (agent.includes('tv') || agent.includes('chromecast'));
}

export function isTvAgent(userAgent: string | Nil) {
  if (!userAgent) {
    return false;
  }

  return isAndroidTv(userAgent);
}
