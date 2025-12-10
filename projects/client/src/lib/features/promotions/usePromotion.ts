import { BehaviorSubject } from 'rxjs';
import type { Promotion } from './models/Promotion.ts';

const promotion = new BehaviorSubject<Promotion | null>(null);

export function usePromotion() {
  return {
    set: (p: Promotion | null) => promotion.next(p),
    promotion: promotion.asObservable(),
  };
}
