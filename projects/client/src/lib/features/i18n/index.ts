import * as m from '$lib/paraglide/messages.js';
import * as runtime from '$lib/paraglide/runtime.js';
import { createI18n } from '@inlang/paraglide-sveltekit';

export const i18n = createI18n(
  runtime,
  {
    exclude: [/^\/api\//],
  },
);

export {
  type AvailableLanguageTag,
  availableLanguageTags,
  isAvailableLanguageTag,
  languageTag,
  onSetLanguageTag,
  setLanguageTag,
} from '$lib/paraglide/runtime.js';

export { m, runtime };
