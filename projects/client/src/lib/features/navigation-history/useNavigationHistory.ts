import { goto } from '$app/navigation';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import { map } from 'rxjs';
import { getNavigationHistoryContext } from './_internal/getNavigationHistoryContext.ts';

export function useNavigationHistory() {
  const { internalNavigations } = getNavigationHistoryContext();

  const canGoBack = internalNavigations.pipe(map((count) => count > 0));

  const goBack = () => {
    if (internalNavigations.value > 0) {
      globalThis.window.history.back();
      return;
    }

    goto(UrlBuilder.home());
  };

  return {
    canGoBack,
    goBack,
  };
}
