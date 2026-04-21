import { BehaviorSubject } from 'rxjs';
import type { ReportParams } from '../models/ReportParams.ts';

function createReportDialogStore() {
  const subject = new BehaviorSubject<ReportParams | null>(null);

  return {
    subscribe: subject.subscribe.bind(subject),
    open: (params: ReportParams) => subject.next(params),
    close: () => subject.next(null),
  };
}

export const reportDialogStore = createReportDialogStore();
