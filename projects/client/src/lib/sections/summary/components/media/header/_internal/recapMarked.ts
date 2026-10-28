import { createSafeMarked } from '$lib/utils/markdown/createSafeMarked.ts';

/*
  Recap text is markdown: bold names everywhere, `###` sections in the VIP
  breakdown. The drawer's own sections are h3, so the breakdown's headings
  sit one level below them.
*/
export const recapMarked = createSafeMarked({
  walkTokens: (token) => {
    if (token.type !== 'heading') return;
    token.depth = Math.min(token.depth + 1, 6);
  },
});
