import * as m from '$lib/features/i18n/messages.ts';
import { LandingStepType, type StepsIntl } from './StepsIntl.ts';

export const StepsIntlProvider: StepsIntl = {
  label: (step) => {
    switch (step) {
      case LandingStepType.Track:
        return m.header_landing_track();
      case LandingStepType.Discover:
        return m.header_landing_discover();
      case LandingStepType.Share:
        return m.header_landing_share();
    }
  },
  description: (step) => {
    switch (step) {
      case LandingStepType.Track:
        return m.text_landing_track();
      case LandingStepType.Discover:
        return m.text_landing_discover();
      case LandingStepType.Share:
        return m.text_landing_share();
    }
  },
};
