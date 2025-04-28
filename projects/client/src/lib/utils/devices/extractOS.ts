export function extractOS(agent: string): 'android' | 'ios' | 'unknown' {
  if (/Android/i.test(agent)) {
    return 'android';
  }

  if (/iPad|iPhone|iPod/.test(agent)) {
    return 'ios';
  }

  return 'unknown';
}
