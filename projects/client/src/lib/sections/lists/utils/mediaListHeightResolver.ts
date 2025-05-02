export function mediaListHeightResolver(
  type: 'landscape' | 'portrait',
) {
  switch (type) {
    case 'landscape':
      return 'var(--height-landscape-list)';
    case 'portrait':
      return 'var(--height-poster-list)';
  }
}
