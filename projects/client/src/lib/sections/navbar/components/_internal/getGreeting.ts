import * as m from '$lib/features/i18n/messages.ts';

export function getGreeting() {
  const today = new Date();
  const hour = today.getHours();

  if (hour >= 5 && hour < 12) {
    return m.text_good_morning();
  }

  if (hour >= 12 && hour < 17) {
    return m.text_good_afternoon();
  }

  if (hour >= 17 && hour < 21) {
    return m.text_good_evening();
  }

  return m.text_good_night();
}
