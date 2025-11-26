import { initializeEvents } from '../events/initializeEvents.ts';
import { PROMOTIONS } from './constants/index.ts';
import { usePromotion } from './usePromotion.ts';
import { utcToLocalDate } from './utils/utcToLocalDate.ts';

export function initializePromotions() {
  const { set } = usePromotion();

  initializeEvents({
    events: PROMOTIONS,
    dateFn: utcToLocalDate,
    setEvent: (id: string | null) => {
      if (!id || !PROMOTIONS[id]) {
        set(null);
        return;
      }

      const config = PROMOTIONS[id];
      set({
        id: config.id,
        end: utcToLocalDate(config.end),
        audience: config.audience,
      });
    },
  });
}
