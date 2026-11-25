export type LivingPosterPainter = (frame: {
  seconds: number;
  tilt: { x: number; y: number };
}) => void;
