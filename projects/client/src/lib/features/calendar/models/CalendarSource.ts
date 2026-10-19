import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import type { Observable } from 'rxjs';
import type { DiscoverMode } from '$lib/features/filters/models/DiscoverMode.ts';
import type { CalendarChunkResult } from './CalendarChunkResult.ts';
import type { EpisodeTypeFilter } from './EpisodeTypeFilter.ts';

export type CalendarSourceParams = {
  start: Date;
  days: number;
  type: DiscoverMode;
  episodeType: Observable<EpisodeTypeFilter>;
} & FilterParams;

export type CalendarSource<T> = (
  params: CalendarSourceParams,
) => CalendarChunkResult<T>;
