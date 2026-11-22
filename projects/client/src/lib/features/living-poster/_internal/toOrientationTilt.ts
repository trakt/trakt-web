import type { OrientationAngles } from '../models/OrientationAngles.ts';

type ToOrientationTiltParams = {
  orientation: OrientationAngles;
  baseline: OrientationAngles;
  screenAngle: number;
};

const FULL_TILT_DEGREES = 20;

const clamp = (value: number) => Math.min(1, Math.max(-1, value));

const wrapDegrees = (degrees: number) =>
  ((((degrees + 180) % 360) + 360) % 360) - 180;

function toScreenAxes({
  beta,
  gamma,
  screenAngle,
}: OrientationAngles & { screenAngle: number }) {
  const quarterTurns = ((Math.round(screenAngle / 90) % 4) + 4) % 4;

  switch (quarterTurns) {
    case 1:
      return { rightEdgeAway: -beta, topEdgeAway: gamma };
    case 2:
      return { rightEdgeAway: -gamma, topEdgeAway: -beta };
    case 3:
      return { rightEdgeAway: beta, topEdgeAway: -gamma };
    default:
      return { rightEdgeAway: gamma, topEdgeAway: beta };
  }
}

export function toOrientationTilt({
  orientation,
  baseline,
  screenAngle,
}: ToOrientationTiltParams) {
  const { rightEdgeAway, topEdgeAway } = toScreenAxes({
    beta: wrapDegrees(orientation.beta - baseline.beta),
    gamma: wrapDegrees(orientation.gamma - baseline.gamma),
    screenAngle,
  });

  return {
    x: clamp(-rightEdgeAway / FULL_TILT_DEGREES),
    y: clamp(topEdgeAway / FULL_TILT_DEGREES),
  };
}
