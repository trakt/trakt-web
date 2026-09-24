import { SHARE_TYPE_DIMENSIONS, type ShareType } from '../models/ShareType.ts';

type Box = {
  left: number;
  top: number;
  width: number;
  height: number;
};

const LOGO_VIEW_BOX: Box = { left: -40, top: -185, width: 672, height: 710 };

type Placement = Box;

const PLACEMENTS: Record<ShareType, Placement> = {
  'open-graph': { left: 0.3, top: -0.5, width: 1, height: 2 },
  'feed': { left: -0.25, top: 0, width: 1, height: 1 },
  'story': { left: -0.55, top: 0.05, width: 2, height: 1 },
};

function fitLogo(box: Box): Box {
  const scale = Math.min(
    box.width / LOGO_VIEW_BOX.width,
    box.height / LOGO_VIEW_BOX.height,
  );
  const width = LOGO_VIEW_BOX.width * scale;
  const height = LOGO_VIEW_BOX.height * scale;

  return {
    left: box.left + (box.width - width) / 2,
    top: box.top + (box.height - height) / 2,
    width,
    height,
  };
}

function round(value: number): number {
  return Math.round(value * 1000) / 1000;
}

export function getWatermarkPlacement(variant: ShareType) {
  const { width, height } = SHARE_TYPE_DIMENSIONS[variant];
  const placement = PLACEMENTS[variant];

  const box = fitLogo({
    left: placement.left * width,
    top: placement.top * height,
    width: placement.width * width,
    height: placement.height * height,
  });

  const left = Math.round(Math.max(box.left, 0));
  const top = Math.round(Math.max(box.top, 0));

  const visible: Box = {
    left,
    top,
    width: Math.round(Math.min(box.left + box.width, width)) - left,
    height: Math.round(Math.min(box.top + box.height, height)) - top,
  };

  const viewBox = [
    LOGO_VIEW_BOX.left +
    ((visible.left - box.left) / box.width) * LOGO_VIEW_BOX.width,
    LOGO_VIEW_BOX.top +
    ((visible.top - box.top) / box.height) * LOGO_VIEW_BOX.height,
    (visible.width / box.width) * LOGO_VIEW_BOX.width,
    (visible.height / box.height) * LOGO_VIEW_BOX.height,
  ].map(round);

  return {
    style:
      `top: ${visible.top}px; left: ${visible.left}px; width: ${visible.width}px; height: ${visible.height}px;`,
    viewBox: viewBox.join(' '),
  };
}
