// Import the functions you need from the SDKs you need
import { browser } from '$app/environment';
import { error, warn } from '$lib/utils/console/print.ts';
import { NOOP_FN } from '$lib/utils/constants.ts';
import { getAnalytics, logEvent, setUserId } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import type { AnalyticsEngine } from './AnalyticsEngine.ts';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = (() => {
  const projectId = FIREBASE_PROJECT_ID;

  return {
    apiKey: FIREBASE_API_KEY,
    authDomain: `${projectId}.firebaseapp.com`,
    databaseURL: `https://${projectId}.firebaseio.com`,
    projectId,
    storageBucket: `${projectId}.firebasestorage.app`,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    appId: FIREBASE_APP_ID,
    measurementId: FIREBASE_MEASUREMENT_ID,
  };
})();

const NOOP_ENGINE: AnalyticsEngine = {
  record: NOOP_FN,
  setUserId: NOOP_FN,
};

// Initialize Firebase
function firebaseDriver() {
  if (!browser) {
    warn(
      'Firebase Analytics is only available in the browser... Skipping...',
    );
    return null;
  }

  try {
    const app = initializeApp(firebaseConfig);
    return getAnalytics(app);
  } catch (_) {
    error('Failed to initialize Firebase Analytics');
    return null;
  }
}

// Initialize Analytics
export const initialize = (): AnalyticsEngine => {
  const driver = firebaseDriver();

  if (!driver) {
    return NOOP_ENGINE;
  }

  return {
    // TODO: better even type definitions
    record: (key: string, data: Record<string, string | number | Date>) => {
      logEvent(driver, key, data);
    },
    setUserId: (userId: string | Nil) => setUserId(driver, userId ?? null),
  };
};
