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

const userReasons: ReadonlyArray<ReportReason> = [
  ReportReason.Spam,
  ReportReason.Adult,
  ReportReason.Language,
  ReportReason.Other,
];

const reasonsMap: Record<ReportableType, ReadonlyArray<ReportReason>> = {
  [ReportableType.Comment]: commentReasons,
  [ReportableType.User]: userReasons,
};

export function reasonsFor(type: ReportableType): ReadonlyArray<ReportReason> {
  return reasonsMap[type];
}
