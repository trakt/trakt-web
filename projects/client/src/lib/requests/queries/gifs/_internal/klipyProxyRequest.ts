import type { z } from 'zod';

type KlipyProxyRequestParams<TSchema extends z.ZodType> = {
  path: string;
  params: URLSearchParams;
  schema: TSchema;
  fetch?: typeof fetch;
};

/**
 * A read through our own `/api/klipy` proxy. Klipy is best effort for the
 * picker, so an upstream failure and a payload we cannot read both answer with
 * an empty body rather than an error.
 */
export async function klipyProxyRequest<TSchema extends z.ZodType>({
  path,
  params,
  schema,
  fetch = globalThis.fetch,
}: KlipyProxyRequestParams<TSchema>): Promise<
  { status: 200; body: z.infer<TSchema> | undefined }
> {
  const response = await fetch(`/api/klipy/${path}?${params}`);

  if (!response.ok) {
    return { status: 200, body: undefined };
  }

  const parsed = schema.safeParse(await response.json());

  return { status: 200, body: parsed.success ? parsed.data : undefined };
}
