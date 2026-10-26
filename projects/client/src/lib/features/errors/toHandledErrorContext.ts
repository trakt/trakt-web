import { describeValue } from './_internal/describeValue.ts';

type HandledErrorInput = {
  error: unknown;
  status: number;
  message: string;
  event: { route: { id: string | null } };
};

type HandledErrorContext = ReturnType<typeof describeValue> & {
  route: string | null;
  status: number;
  message: string;
};

export function toHandledErrorContext({
  error,
  status,
  message,
  event,
}: HandledErrorInput): HandledErrorContext {
  return {
    route: event.route.id,
    status,
    message,
    ...describeValue(error),
  };
}
