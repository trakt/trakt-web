import { ReportableType } from '../models/ReportableType.ts';
import { ReportReason } from '../models/ReportReason.ts';

const commentReasons: ReadonlyArray<ReportReason> = [
  ReportReason.Spoilers,
  ReportReason.Abusive,
  ReportReason.Spam,
  ReportReason.Bigotry,
  ReportReason.Political,
  ReportReason.OffTopic,
  ReportReason.Duplicate,
  ReportReason.Other,
];

const mediaReasons: ReadonlyArray<ReportReason> = [
  ReportReason.Duplicate,
  ReportReason.Remove,
  ReportReason.DataRefresh,
  ReportReason.Metadata,
  ReportReason.Adult,
  ReportReason.Runtime,
  ReportReason.Language,
  ReportReason.Spam,
  ReportReason.Tmdb,
  ReportReason.Other,
];

const listReasons: ReadonlyArray<ReportReason> = [
  ReportReason.Duplicate,
  ReportReason.Remove,
  ReportReason.Metadata,
  ReportReason.Adult,
  ReportReason.Language,
  ReportReason.Spam,
  ReportReason.Other,
];

const userReasons: ReadonlyArray<ReportReason> = [
  ReportReason.Spam,
  ReportReason.Adult,
  ReportReason.Language,
  ReportReason.Other,
];

const reasonsMap: Record<ReportableType, ReadonlyArray<ReportReason>> = {
  [ReportableType.Comment]: commentReasons,
  [ReportableType.Movie]: mediaReasons,
  [ReportableType.Show]: mediaReasons,
  [ReportableType.Season]: mediaReasons,
  [ReportableType.Episode]: mediaReasons,
  [ReportableType.List]: listReasons,
  [ReportableType.User]: userReasons,
};

export function reasonsFor(type: ReportableType): ReadonlyArray<ReportReason> {
  return reasonsMap[type];
}
