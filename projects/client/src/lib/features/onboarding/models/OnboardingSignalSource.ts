import type { Observable } from 'rxjs';

export type OnboardingSignalSource = () => Observable<number>;
