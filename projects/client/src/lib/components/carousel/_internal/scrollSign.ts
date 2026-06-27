// Physical scrollBy() sign for a logical scroll target. In LTR the inline end
// is the positive direction and the start negative; RTL mirrors both, so the
// sign is the product of the target and the direction factor.
export function scrollSign(
  { target, isRtl }: { target: 'start' | 'end'; isRtl: boolean },
): 1 | -1 {
  const towardEnd = target === 'end' ? 1 : -1;
  const directionFactor = isRtl ? -1 : 1;
  return (towardEnd * directionFactor) as 1 | -1;
}
