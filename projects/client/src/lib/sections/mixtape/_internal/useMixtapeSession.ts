import type { MediaInputDefault } from '$lib/models/MediaInput.ts';
import { BehaviorSubject, Subject } from 'rxjs';

/*
  The picker's controls live in the navbar (search, deck, Mix it) while the
  grid lives in the page. Picks themselves stay in the URL; this session only
  carries what the navbar cannot derive from it: the picked media the page has
  already resolved, the fit count for tracking, the search text the deck owns,
  and the mixing hold. A pick also launches a flight from its poster to its
  slot, which the deck lands.
*/

export type MixtapeFlight = {
  id: number;
  src: string;
  from: DOMRect | null;
};

export type MixtapeSession = {
  picked: ReadonlyArray<MediaInputDefault>;
  fitCount: number;
  isMixing: boolean;
  search: string;
};

const INITIAL_SESSION: MixtapeSession = {
  picked: [],
  fitCount: 0,
  isMixing: false,
  search: '',
};

const session = new BehaviorSubject<MixtapeSession>(INITIAL_SESSION);
const flights = new Subject<MixtapeFlight>();

export function useMixtapeSession() {
  return {
    session: session.asObservable(),
    flights: flights.asObservable(),
    update: (patch: Partial<MixtapeSession>) =>
      session.next({ ...session.value, ...patch }),
    reset: () => session.next(INITIAL_SESSION),
    launch: (flight: MixtapeFlight) => flights.next(flight),
  };
}
