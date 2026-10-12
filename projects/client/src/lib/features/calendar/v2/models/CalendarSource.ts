import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import type { Observable } from 'rxjs';
import type { DiscoverMode } from '../../../filters/models/DiscoverMode.ts';
import type { Calendar } from '../../models/Calendar.ts';
import type { EpisodeTypeFilter } from '../../models/EpisodeTypeFilter.ts';

export type CalendarSourceParams = {
  start: Date;
  days: number;
  type: DiscoverMode;
  episodeType: Observable<EpisodeTypeFilter>;
} & FilterParams;

export type CalendarSource<T> = (params: CalendarSourceParams) => {
  isLoading: Observable<boolean>;
  calendar: Observable<Calendar<T>>;
  hasUpstreamItems: Observable<boolean>;
};
