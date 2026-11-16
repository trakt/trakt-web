type ToPointerTiltParams = {
  pointer: { clientX: number; clientY: number };
  rect: Pick<DOMRect, 'left' | 'top' | 'width' | 'height'>;
};

const clamp = (value: number) => Math.min(1, Math.max(-1, value));

export function toPointerTilt({ pointer, rect }: ToPointerTiltParams) {
  if (rect.width === 0 || rect.height === 0) return { x: 0, y: 0 };

  return {
    x: clamp(((pointer.clientX - rect.left) / rect.width) * 2 - 1),
    y: clamp(((pointer.clientY - rect.top) / rect.height) * 2 - 1),
  };
}
