export function mediaCardWidthResolver(
  type: 'landscape' | 'portrait',
) {
  switch (type) {
    case 'landscape':
      return 'var(--width-landscape-card)';
    case 'portrait':
      return 'var(--width-portrait-card)';
  }
}
