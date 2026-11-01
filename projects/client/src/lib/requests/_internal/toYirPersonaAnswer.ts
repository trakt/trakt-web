import { z } from 'zod';
import type { YirPersonaAnswer } from '../models/YirPersonaAnswer.ts';
import { mapToYirPersonaResult } from './mapToYirPersonaResult.ts';

const YEAR_NOT_OPEN = 'year_not_open';

const ErrorBodySchema = z.object({ error: z.string() });

async function isYearNotOpen(response: Response) {
  if (response.status !== 403) return false;

  const body = ErrorBodySchema.safeParse(
    await response.json().catch(() => null),
  );

  return body.success && body.data.error === YEAR_NOT_OPEN;
}

export async function toYirPersonaAnswer(
  response: Response,
): Promise<YirPersonaAnswer> {
  if (response.ok) {
    return {
      isYearOpen: true,
      result: mapToYirPersonaResult(await response.json()),
    };
  }

  return { isYearOpen: !(await isYearNotOpen(response)), result: null };
}
