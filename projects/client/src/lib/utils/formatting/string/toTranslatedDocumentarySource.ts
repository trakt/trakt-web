import * as m from '$lib/features/i18n/messages.ts';
import type { DocumentaryDispute } from '$lib/requests/models/DocumentaryCheck.ts';

const SOURCE_MAP: Record<DocumentaryDispute['type'], () => string> = {
  expert: m.text_documentary_source_expert,
  press: m.text_documentary_source_press,
  interested: m.text_documentary_source_interested,
  filmmaker: m.text_documentary_source_filmmaker,
};

export function toTranslatedDocumentarySource(
  type: DocumentaryDispute['type'],
): string {
  return SOURCE_MAP[type]();
}
