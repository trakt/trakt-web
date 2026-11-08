type ToRasterDimensionsParams = {
  width: number;
  height: number;
  size: number;
};

export function toRasterDimensions({
  width,
  height,
  size,
}: ToRasterDimensionsParams) {
  if (width <= 0 || height <= 0) return { width: size, height: size };

  const scale = size / Math.max(width, height);

  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}
