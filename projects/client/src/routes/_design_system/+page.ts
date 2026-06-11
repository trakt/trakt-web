import { redirect } from '@sveltejs/kit';
import { DESIGN_SYSTEM_PAGES } from './_internal/designSystemPages.ts';

export const load = () => {
  const firstPage = DESIGN_SYSTEM_PAGES.at(0);

  if (!firstPage) {
    return redirect(307, '/');
  }

  return redirect(307, firstPage.href);
};
