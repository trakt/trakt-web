import { toSvgCursor } from '../shared/toSvgCursor.ts';

type CompassReticleCursorParams = {
  sand: string;
  emerald: string;
  locked?: boolean;
};

const halves = {
  dune: 'M0 0 H19 L13 32 H0 Z',
  doom: 'M19 0 H32 V32 H13 Z',
};

export function compassReticleCursor({
  sand,
  emerald,
  locked = false,
}: CompassReticleCursorParams) {
  const ring = locked ? 9 : 11;
  const compass = `<g clip-path="url(#d)"><circle cx="16" cy="16" r="${ring}" fill="none" stroke="#120c06" stroke-width="4"/><circle cx="16" cy="16" r="${ring}" fill="rgba(30,18,8,.35)" stroke="${sand}" stroke-width="1.6"/><path d="M16 3.5 L18.6 16 L16 28.5 L13.4 16 Z" fill="#120c06" stroke="#120c06" stroke-width="2.4" stroke-linejoin="round"/><path d="M16 4.5 L18 16 H14 Z" fill="${sand}"/><path d="M16 27.5 L18 16 H14 Z" fill="${sand}" fill-opacity=".35"/><path d="M4 16 H7 M16 1 V3" stroke="${sand}" stroke-width="1.6" stroke-linecap="round"/></g>`;
  const reticle = `<g clip-path="url(#m)"><circle cx="16" cy="16" r="${ring}" fill="none" stroke="#04110b" stroke-width="4"/><circle cx="16" cy="16" r="${ring}" fill="none" stroke="${emerald}" stroke-width="1.6" stroke-dasharray="${locked ? '20 0' : '4 2.4'}"/><path d="M${16 + ring - 3} 16 H31 M16 ${16 + ring - 3} V31" stroke="#04110b" stroke-width="3.6" stroke-linecap="round"/><path d="M${16 + ring - 3} 16 H31 M16 ${16 + ring - 3} V31" stroke="${emerald}" stroke-width="1.6" stroke-linecap="round"/></g>`;
  const seam = `<path d="M19 1.5 L13 30.5" stroke="#fff6dc" stroke-width="1" stroke-opacity=".9"/><circle cx="16" cy="16" r="1.6" fill="#ffffff" stroke="#000" stroke-width=".6"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><defs><clipPath id="d"><path d="${halves.dune}"/></clipPath><clipPath id="m"><path d="${halves.doom}"/></clipPath></defs>${compass}${reticle}${seam}</svg>`;
  return toSvgCursor({ svg, hotspot: 16 });
}
