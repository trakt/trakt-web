import { ReportableType } from './ReportableType.ts';

type ReportParamsMap = {
  [ReportableType.Comment]: {
    type: ReportableType.Comment;
    id: number;
  };
  [ReportableType.Movie]: {
    type: ReportableType.Movie;
    id: number;
    title: string;
  };
  [ReportableType.Show]: {
    type: ReportableType.Show;
    id: number;
    title: string;
  };
  [ReportableType.Season]: {
    type: ReportableType.Season;
    id: number;
    title: string;
  };
  [ReportableType.Episode]: {
    type: ReportableType.Episode;
    id: number;
    title: string;
  };
  [ReportableType.List]: {
    type: ReportableType.List;
    id: number;
    title: string;
  };
  [ReportableType.User]: {
    type: ReportableType.User;
    id: string;
  };
};

export type ReportParams = ReportParamsMap[ReportableType];
