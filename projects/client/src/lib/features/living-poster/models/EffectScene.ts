export type EffectScene = {
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
  unit: number;
  seconds: number;
  tilt: { x: number; y: number };
  setPlaneFilter: (filter: string) => void;
};
