import {
  type YirPersonaId,
  YirPersonaIdSchema,
} from '$lib/requests/models/YirPersonaId.ts';

type PersonaPreview = {
  persona: YirPersonaId;
  runnerUp?: YirPersonaId | null;
};

export function parsePersonaPreview(
  params: URLSearchParams,
): PersonaPreview | undefined {
  const persona = YirPersonaIdSchema.safeParse(params.get('persona'));
  if (!persona.success) return undefined;

  const runner = params.get('runner');
  if (runner === null) return { persona: persona.data };
  if (runner === 'none') return { persona: persona.data, runnerUp: null };

  const runnerUp = YirPersonaIdSchema.safeParse(runner);

  return {
    persona: persona.data,
    runnerUp: runnerUp.success ? runnerUp.data : undefined,
  };
}
