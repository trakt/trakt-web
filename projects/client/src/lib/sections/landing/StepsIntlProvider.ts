import * as m from '$lib/features/i18n/messages.ts';
import { LandingStepType, type StepsIntl } from './StepsIntl.ts';

export const StepsIntlProvider: StepsIntl = {
  label: (step) => {
    switch (step) {
      case LandingStepType.Track:
        return m.landing_track_label();
      case LandingStepType.Discover:
        return m.landing_discover_label();
      case LandingStepType.Share:
        return m.landing_share_label();
    }
  },
  description: (step) => {
    switch (step) {
      case LandingStepType.Track:
        return m.landing_track_description();
      case LandingStepType.Discover:
        return m.landing_discover_description();
      case LandingStepType.Share:
        return m.landing_share_description();
    }
  },
};
