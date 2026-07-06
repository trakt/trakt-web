import { BehaviorSubject } from 'rxjs';
import { TvTimeReportError } from './models/TvTimeReportError.ts';

const ENDPOINT = '/api/tv-time-report';

const SIZE_REASONS = new Set([
  'too-many-files',
  'file-too-large',
  'total-too-large',
]);

type SubmitProps = {
  message: string;
  files: ReadonlyArray<File>;
  userId: string;
  username: string;
  source: string;
  sourceName: string;
};

const mapReason = (reason: unknown): TvTimeReportError =>
  typeof reason === 'string' && SIZE_REASONS.has(reason)
    ? TvTimeReportError.TooLarge
    : TvTimeReportError.Unknown;

export function useTvTimeReport() {
  const isSubmitting = new BehaviorSubject(false);
  const error = new BehaviorSubject<TvTimeReportError | null>(null);

  const submit = async (
    { message, files, userId, username, source, sourceName }: SubmitProps,
  ): Promise<boolean> => {
    isSubmitting.next(true);
    error.next(null);

    try {
      const body = new FormData();
      body.set('message', message);
      body.set('userId', userId);
      body.set('username', username);
      body.set('source', source);
      body.set('sourceName', sourceName);
      files.forEach((file) => body.append('files', file));

      const response = await fetch(ENDPOINT, { method: 'POST', body });

      if (response.ok) {
        return true;
      }

      const reason = await response.json()
        .then((payload: { reason?: string } | null) => payload?.reason)
        .catch(() => null);
      error.next(mapReason(reason));
      return false;
    } catch {
      error.next(TvTimeReportError.Unknown);
      return false;
    } finally {
      isSubmitting.next(false);
    }
  };

  return {
    submit,
    isSubmitting: isSubmitting.asObservable(),
    error: error.asObservable(),
    dismissError: () => error.next(null),
  };
}
