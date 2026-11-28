import { escapeHtml } from '$lib/utils/string/escapeHtml.ts';

const hash = (text: string) =>
  [...text].reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) >>> 0, 7);

export function lockupMarkup(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const last = words.at(-1) ?? '';

  if (/\d/.test(text)) {
    return `<span class="dd-lockup-word" data-world="dune">${escapeHtml(words.join(' '))}</span>`;
  }

  if (words.length < 2) {
    const world = hash(last) % 2 === 0 ? 'dune' : 'doom';
    return `<span class="dd-lockup-word" data-world="${world}">${escapeHtml(last)}</span>`;
  }

  const lead = words.slice(0, -1).join(' ');
  return `<span class="dd-lockup-word" data-world="dune">${escapeHtml(lead)}</span><i class="dd-lockup-gem"></i><span class="dd-lockup-word" data-world="doom">${escapeHtml(last)}</span>`;
}
