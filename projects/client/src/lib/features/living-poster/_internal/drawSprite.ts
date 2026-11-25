type DrawSpriteParams = {
  context: CanvasRenderingContext2D;
  sprite: HTMLCanvasElement;
  x: number;
  y: number;
  width: number;
  height?: number;
  alpha: number;
};

export function drawSprite({
  context,
  sprite,
  x,
  y,
  width,
  height = width,
  alpha,
}: DrawSpriteParams) {
  context.globalAlpha = Math.min(1, Math.max(0, alpha));
  context.drawImage(sprite, x - width / 2, y - height / 2, width, height);
}
