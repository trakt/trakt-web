type IdleTiltParams = {
  milliseconds: number;
  phase: number;
};

export function idleTilt({ milliseconds, phase }: IdleTiltParams) {
  return {
    x: Math.sin(milliseconds / 2300 + phase) * 0.45,
    y: Math.sin(milliseconds / 3100 + phase * 1.7) * 0.3,
  };
}
