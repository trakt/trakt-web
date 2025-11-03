/*
  Testing by test id is the most resilient way to test components.
  We can test by role in the cases we explicitly want to test accessibility.

  https://playwright.dev/docs/locators#locate-by-test-id
*/
export enum TestId {
  NavBarHomeButton = 'nav-bar-home-button',
  NavBarShowsButton = 'nav-bar-shows-button',
  NavBarMoviesButton = 'nav-bar-movies-button',
  SummaryMediaTitle = 'summary-media-title',
  ConsentButton = 'consent-button',
  FeatureFlagToolButton = 'feature-flag-tool-button',
}
