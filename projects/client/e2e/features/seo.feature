Feature: SEO meta tags

  Background:
    When I click on the "consent-button" button

  Scenario: Home page has complete SEO meta tags
    Then the page should meet core SEO requirements
    And the page should not be blocked from indexing
    And the og:type should be "website"
    And the page title should be "Trakt Web: Home"
    And the og:title should be "Trakt Web: Track Your Shows & Movies"
    And the description should be "Trakt Web: A new, lightweight way to track your favorite movies and TV shows."
    And the canonical path should be "/"
    And the JSON-LD should be of type "WebSite"

  Scenario: Shows section page has complete SEO meta tags
    When I open the shows section
    Then the page should meet core SEO requirements
    And the page should not be blocked from indexing
    And the og:type should be "website"
    And the page title should be "Trakt Web: Shows"
    And the og:title should be "Trakt Web: Shows"
    And the description should be "Trakt Web: A new, lightweight way to track your favorite movies and TV shows."
    And the canonical path should be "/shows"

  Scenario: Movies section page has complete SEO meta tags
    When I open the movies section
    Then the page should meet core SEO requirements
    And the page should not be blocked from indexing
    And the og:type should be "website"
    And the page title should be "Trakt Web: Movies"
    And the og:title should be "Trakt Web: Movies"
    And the description should be "Trakt Web: A new, lightweight way to track your favorite movies and TV shows."
    And the canonical path should be "/movies"

  Scenario: Show summary page has complete SEO meta tags
    When I view the show summary of "silo"
    Then the page should meet core SEO requirements
    And the page should not be blocked from indexing
    And the og:type should be "video.tv_show"
    And the og:image should be an absolute URL
    And the og:title should match the visible media title
    And the page title should contain the og:title
    And the canonical path should be "/shows/silo"
    And the JSON-LD should be of type "TVSeries"
    And the JSON-LD name should match the og:title

  Scenario: Movie summary page has complete SEO meta tags
    When I view the movie summary of "heretic-2024"
    Then the page should meet core SEO requirements
    And the page should not be blocked from indexing
    And the og:type should be "video.movie"
    And the og:image should be an absolute URL
    And the og:title should match the visible media title
    And the page title should contain the og:title
    And the canonical path should be "/movies/heretic-2024"
    And the JSON-LD should be of type "Movie"
    And the JSON-LD name should match the og:title
