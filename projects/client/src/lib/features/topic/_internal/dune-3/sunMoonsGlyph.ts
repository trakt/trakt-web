export function sunMoonsGlyph() {
  return [
    '<svg viewBox="0 0 32 32" fill="none" stroke-linecap="round">',
    '<path d="M3 21.5h26" stroke="currentColor" stroke-width="1" opacity=".55"/>',
    '<path d="M8.5 21.5a7.5 7.5 0 0 1 15 0" stroke="currentColor" stroke-width="1.4"/>',
    '<g stroke="currentColor" stroke-width="1" opacity=".7">',
    '<path d="M16 9.2v2.2M9.6 12.1l1.5 1.5M22.4 12.1l-1.5 1.5M5.6 17.4l2 .6M26.4 17.4l-2 .6"/>',
    '</g>',
    '<circle cx="24.6" cy="6.6" r="2.4" fill="var(--dn3-spice)" stroke="none"/>',
    '<circle cx="28.6" cy="11.2" r="1.15" fill="var(--dn3-spice)" stroke="none" opacity=".8"/>',
    '<path d="M11 25.5h10M13.5 28.5h5" stroke="currentColor" stroke-width="1" opacity=".4"/>',
    '</svg>',
  ].join('');
}
