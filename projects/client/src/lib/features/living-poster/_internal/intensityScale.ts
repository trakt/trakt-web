export function intensityScale(intensity: number) {
  return 0.5 + Math.min(1, Math.max(0, intensity));
}
