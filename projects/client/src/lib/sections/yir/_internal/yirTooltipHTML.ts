import { escapeHtml } from '$lib/utils/string/escapeHtml.ts';
// Imported for the CSS side effect — YirTooltip's :global styles are reused
// here when rendering the tooltip via Carbon's customHTML callback.
import './YirTooltip.svelte';

export type YirTooltipContent = {
  main: string;
  sub?: string;
  extra?: string;
};

const line = (className: string, text: string | undefined): string =>
  text ? `<div class="${className}">${escapeHtml(text)}</div>` : '';

export const yirTooltipHTML = (
  { main, sub, extra }: YirTooltipContent,
): string => `
  <div class="trakt-yir-tooltip">
    ${line('yir-tooltip-main', main)}
    ${line('yir-tooltip-sub', sub)}
    ${line('yir-tooltip-extra', extra)}
  </div>
`;
