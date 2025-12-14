import { BehaviorSubject } from 'rxjs';
import type { Promotion } from './models/Promotion.ts';

const promotion = new BehaviorSubject<Promotion | null>(null);

export function usePromotion() {
  return {
    set: (value: Promotion | null) => promotion.next(value),
    promotion: promotion.asObservable(),
  };
}
