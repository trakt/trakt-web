import { DRAWER_VIEW_PARAM } from '$lib/components/drawer/constants/index.ts';
import { LOCAL_PARAMS } from '$lib/features/parameters/localParams.ts';
import { WHITE_LISTED_PARAMS } from '$lib/features/parameters/whiteListedParams.ts';
import {
  EPISODE_PARAM,
  SEASON_PARAM,
} from '$lib/sections/summary/constants.ts';

const CREDIT_POSITION_PARAMS: readonly string[] = [
  'movies',
  'shows',
  'episodes',
];

const CACHE_BUST_PARAM = '_cb';

export const CRAWL_BLOCKED_PARAMS: readonly string[] = [
  ...WHITE_LISTED_PARAMS,
  ...LOCAL_PARAMS,
  DRAWER_VIEW_PARAM,
  SEASON_PARAM,
  EPISODE_PARAM,
  ...CREDIT_POSITION_PARAMS,
  CACHE_BUST_PARAM,
];
