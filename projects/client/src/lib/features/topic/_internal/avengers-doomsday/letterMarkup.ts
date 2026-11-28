import { escapeHtml } from '$lib/utils/string/escapeHtml.ts';
import { LETTER_STAGGER } from './LETTER_STAGGER.ts';

export function letterMarkup(text: string) {
  const words = text.split(/(\s+)/);
  const state = { index: 0 };
  return words
    .map((word) => {
      if (/^\s+$/.test(word)) return ' ';
      const letters = [...word]
        .map((letter) => {
          const delay = state.index * LETTER_STAGGER;
          state.index += 1;
          return `<span class="doom-slam-letter" style="animation-delay:${delay}ms">${escapeHtml(letter)}</span>`;
        })
        .join('');
      return `<span class="doom-slam-word">${letters}</span>`;
    })
    .join('');
}
