import type { BehaviorSubject } from 'rxjs';

export type SpotlightContext = {
  isOpen: BehaviorSubject<boolean>;
  open: () => void;
  close: () => void;
  toggle: () => void;
};
