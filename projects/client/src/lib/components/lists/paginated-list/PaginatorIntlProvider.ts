import * as m from '$lib/features/i18n/messages';

import type { PaginatorIntl } from './PaginatorIntl';

export const PaginatorIntlProvider: PaginatorIntl = {
  goToPageLabel: (page: number) => m.go_to_page_number({ number: page }),
};
