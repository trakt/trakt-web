import { toSvgCursor } from '../shared/toSvgCursor.ts';

type OrnithopterCursorParams = {
  hull: string;
  wing: string;
  eye: string;
};

export function ornithopterCursor({
  hull,
  wing,
  eye,
}: OrnithopterCursorParams) {
  const craft = [
    `<g transform="rotate(-45 16 16)">`,
    `<g fill="none" stroke="#0b0705" stroke-opacity=".7" stroke-width="2.6" stroke-linejoin="round">`,
    `<path d="M16 3l2.1 6v12.5L16 27l-2.1-5.5V9z"/>`,
    `<path d="M13.9 10.8L3.2 9.2l.6 2.6 10.1 1.4zM18.1 10.8l10.7-1.6-.6 2.6-10.1 1.4zM13.9 16.2l-8.6.6.6 2 8 -.7zM18.1 16.2l8.6.6-.6 2-8-.7z"/>`,
    `</g>`,
    `<path d="M13.9 10.8L3.2 9.2l.6 2.6 10.1 1.4zM18.1 10.8l10.7-1.6-.6 2.6-10.1 1.4zM13.9 16.2l-8.6.6.6 2 8 -.7zM18.1 16.2l8.6.6-.6 2-8-.7z" fill="${wing}"/>`,
    `<path d="M16 3l2.1 6v12.5L16 27l-2.1-5.5V9z" fill="${hull}"/>`,
    `<path d="M16 27v3" stroke="${hull}" stroke-width="1.2"/>`,
    `<ellipse cx="16" cy="8.4" rx="1.1" ry="2" fill="${eye}"/>`,
    `</g>`,
  ].join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">${craft}</svg>`;
  return toSvgCursor({ svg, hotspot: 7 });
}
