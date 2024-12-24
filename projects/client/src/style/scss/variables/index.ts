import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import * as exports from '$style/scss/variables/index.module.scss';

const variables = exports as unknown as {
  breakpointDesktop: `${string}px`;
  breakpointMobile: `${string}px`;
  breakpointTabletLgMax: `${string}px`;
  breakpointTabletLgMin: `${string}px`;
  breakpointTabletSmMax: `${string}px`;
  breakpointTabletSmMin: `${string}px`;
};

assertDefined(
  variables.breakpointMobile,
  '!! breakpointMobile not loaded from SCSS !!',
);
assertDefined(
  variables.breakpointTabletSmMin,
  '!! breakpointTabletSmMin not loaded from SCSS !!',
);
assertDefined(
  variables.breakpointTabletSmMax,
  '!! breakpointTabletSmMax not loaded from SCSS !!',
);
assertDefined(
  variables.breakpointTabletLgMin,
  '!! breakpointTabletLgMin not loaded from SCSS !!',
);
assertDefined(
  variables.breakpointTabletLgMax,
  '!! breakpointTabletLgMax not loaded from SCSS !!',
);
assertDefined(
  variables.breakpointDesktop,
  '!! breakpointDesktop not loaded from SCSS !!',
);

export const breakpointDesktop = variables.breakpointDesktop;
export const breakpointMobile = variables.breakpointMobile;
export const breakpointTabletLgMax = variables.breakpointTabletLgMax;
export const breakpointTabletLgMin = variables.breakpointTabletLgMin;
export const breakpointTabletSmMax = variables.breakpointTabletSmMax;
export const breakpointTabletSmMin = variables.breakpointTabletSmMin;
