// Fork PRs can't read the Trakt API secrets, so scenarios that need live
// summary data are skipped there (E2E_SKIP_LIVE_DATA=true). Static scenarios
// still run and give external contributors real signal.
const skipLiveData = process.env.E2E_SKIP_LIVE_DATA === 'true';

export default {
  parallel: 1,
  forceExit: true,
  ...(skipLiveData ? { tags: 'not @live-data' } : {}),
  format: [
    ['html', 'test-results/e2e/cucumber-report.html'],
    ['junit', 'test-results/e2e/cucumber-report.xml'],
  ],
  paths: [
    './e2e/features/*.feature',
  ],
  import: [
    './e2e/world.ts',
    './e2e/support/*.ts',
  ],
};
