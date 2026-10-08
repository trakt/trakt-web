const GAME_FONT_URL =
  'https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@800;900&display=swap';

export function loadGameFont() {
  if (document.querySelector(`link[href="${GAME_FONT_URL}"]`)) {
    return;
  }

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = GAME_FONT_URL;
  link.addEventListener('error', () => link.remove());
  document.head.appendChild(link);
}
