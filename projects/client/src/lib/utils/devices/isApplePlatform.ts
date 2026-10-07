export function isApplePlatform(platform: string | Nil): boolean {
  if (!platform) return false;

  return /Mac|iPhone|iPad|iPod/.test(platform);
}
