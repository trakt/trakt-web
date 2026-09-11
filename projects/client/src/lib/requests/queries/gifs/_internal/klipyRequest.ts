import type { z } from 'zod';
import { klipyUrl } from './klipyUrl.ts';

type KlipyRequestParams<TSchema extends z.ZodType> = {
  path: string;
  params: URLSearchParams;
  schema: TSchema;
  fetch?: typeof fetch;
};

export async function klipyRequest<TSchema extends z.ZodType>({
  path,
  params,
  schema,
  fetch = globalThis.fetch,
}: KlipyRequestParams<TSchema>): Promise<
  { status: 200; body: z.infer<TSchema> | undefined }
> {
  const response = await fetch(klipyUrl(path, params));

  if (!response.ok) {
    throw new Error(`Klipy request failed: ${path} (${response.status})`);
  }

  const parsed = schema.safeParse(await response.json());

  return { status: 200, body: parsed.success ? parsed.data : undefined };
}
