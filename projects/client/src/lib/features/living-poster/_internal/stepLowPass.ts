type StepLowPassParams = {
  value: number;
  target: number;
  seconds: number;
  timeConstant: number;
};

export function stepLowPass({
  value,
  target,
  seconds,
  timeConstant,
}: StepLowPassParams) {
  return value + (target - value) * (1 - Math.exp(-seconds / timeConstant));
}
