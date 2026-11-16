import type { SpringState } from '../models/SpringState.ts';

type StepSpringParams = {
  state: SpringState;
  target: number;
  seconds: number;
  stiffness: number;
  damping: number;
};

const MAX_SUBSTEP_SECONDS = 1 / 120;

export function stepSpring({
  state,
  target,
  seconds,
  stiffness,
  damping,
}: StepSpringParams): SpringState {
  const steps = Math.max(1, Math.ceil(seconds / MAX_SUBSTEP_SECONDS));
  const delta = seconds / steps;

  return Array.from({ length: steps }).reduce<SpringState>(
    ({ value, velocity }) => {
      const acceleration = stiffness * (target - value) - damping * velocity;
      const nextVelocity = velocity + acceleration * delta;

      return { value: value + nextVelocity * delta, velocity: nextVelocity };
    },
    state,
  );
}
