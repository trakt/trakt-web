import { ReportableType } from './ReportableType.ts';

type ReportParamsMap = {
  [ReportableType.Comment]: {
    type: ReportableType.Comment;
    id: number;
  };
  [ReportableType.User]: {
    type: ReportableType.User;
    id: string;
  };
};

export type ReportParams = ReportParamsMap[ReportableType];
