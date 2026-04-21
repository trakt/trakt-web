import { ReportableType } from '../models/ReportableType.ts';
import { ReportReason } from '../models/ReportReason.ts';

const COMMENT_REASONS: ReadonlyArray<ReportReason> = [
  ReportReason.Spoilers,
  ReportReason.Abusive,
  ReportReason.Spam,
  ReportReason.Bigotry,
  ReportReason.Political,
  ReportReason.OffTopic,
  ReportReason.Duplicate,
  ReportReason.Other,
];

const MEDIA_REASONS: ReadonlyArray<ReportReason> = [
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

const LIST_REASONS: ReadonlyArray<ReportReason> = [
  ReportReason.Duplicate,
  ReportReason.Remove,
  ReportReason.Metadata,
  ReportReason.Adult,
  ReportReason.Language,
  ReportReason.Spam,
  ReportReason.Other,
];

const USER_REASONS: ReadonlyArray<ReportReason> = [
  ReportReason.Spam,
  ReportReason.Adult,
  ReportReason.Language,
  ReportReason.Other,
];

const REASONS_FOR: Record<ReportableType, ReadonlyArray<ReportReason>> = {
  [ReportableType.Comment]: COMMENT_REASONS,
  [ReportableType.Movie]: MEDIA_REASONS,
  [ReportableType.Show]: MEDIA_REASONS,
  [ReportableType.Season]: MEDIA_REASONS,
  [ReportableType.Episode]: MEDIA_REASONS,
  [ReportableType.List]: LIST_REASONS,
  [ReportableType.User]: USER_REASONS,
};

export function reasonsFor(type: ReportableType): ReadonlyArray<ReportReason> {
  return REASONS_FOR[type];
}
