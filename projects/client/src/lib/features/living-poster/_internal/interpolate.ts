type Keyframe = readonly [at: number, value: number];

export function interpolate(
  progress: number,
  keyframes: ReadonlyArray<Keyframe>,
) {
  const next = keyframes.findIndex(([at]) => at >= progress);
  if (next <= 0) return keyframes.at(0)?.[1] ?? 0;

  const [fromAt, fromValue] = keyframes[next - 1] ?? keyframes[0] ?? [0, 0];
  const [toAt, toValue] = keyframes[next] ?? [1, 0];
  const span = toAt - fromAt;
  if (span === 0) return toValue;

  return fromValue + (toValue - fromValue) * ((progress - fromAt) / span);
}
