import z from 'zod';

const ErrorBodySchema = z.object({ error: z.string() });

export async function readMediaSyncError(response: Response): Promise<string> {
  const parsed = ErrorBodySchema.safeParse(
    await response.json().catch(() => null),
  );
  return parsed.success ? parsed.data.error : `http_${response.status}`;
}
