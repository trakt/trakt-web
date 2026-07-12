@seo
Feature: SEO meta tags

  Scenario: Home page has complete SEO meta tags
    Then the page should meet core SEO requirements
    And the page should not be blocked from indexing
    And the og:type should be "website"
    And the page title should be "Trakt Web: Home"
    And the og:title should be "Trakt Web: Track Your Shows & Movies"
    And the description should be "Track your shows and movies with Trakt Web — discover what's trending, get personalized recommendations, and never miss what's next."
    And the canonical path should be "/"
    And the JSON-LD should be of type "WebSite"
    And the JSON-LD should include a search action

  Scenario: Shows section page has complete SEO meta tags
    When I open the shows section
    Then the page should meet core SEO requirements
    And the page should not be blocked from indexing
    And the og:type should be "website"
    And the page title should be "Trakt Web: Shows"
    And the og:title should be "Trakt Web: Shows"
    And the description should be "Discover trending, popular, and highly anticipated TV shows on Trakt Web. Find your next binge-worthy series and track every episode."
    And the canonical path should be "/discover"

  Scenario: Movies section page has complete SEO meta tags
    When I open the movies section
    Then the page should meet core SEO requirements
    And the page should not be blocked from indexing
    And the og:type should be "website"
    And the page title should be "Trakt Web: Movies"
    And the og:title should be "Trakt Web: Movies"
    And the description should be "Browse trending, popular, and highly anticipated movies on Trakt Web. Find your next watch and keep track of everything you've seen."
    And the canonical path should be "/discover"

  @live-data
  Scenario: Show summary page has complete SEO meta tags
    When I view the show summary of "silo"
    Then the page should meet core SEO requirements
    And the page should not be blocked from indexing
    And the og:type should be "video.tv_show"
    And the og:image should be an absolute URL
    And the og:image dimensions should be 1200 by 630
    And the og:title should match the visible media title
    And the page title should contain the og:title
    And the canonical path should be "/shows/silo"
    And the JSON-LD should be of type "TVSeries"
    And the JSON-LD name should match the og:title
    And the JSON-LD should include genre and year

  @live-data
  Scenario: Movie summary page has complete SEO meta tags
    When I view the movie summary of "heretic-2024"
    Then the page should meet core SEO requirements
    And the page should not be blocked from indexing
    And the og:type should be "video.movie"
    And the og:image should be an absolute URL
    And the og:image dimensions should be 1200 by 630
    And the og:title should match the visible media title
    And the page title should contain the og:title
    And the canonical path should be "/movies/heretic-2024"
    And the JSON-LD should be of type "Movie"
    And the JSON-LD name should match the og:title
    And the JSON-LD should include genre and year

  # FIXME: Investigate why build + googlebot agent string detects duplicate tags 
  # Scenario: Meta tags settle to a single instance after navigation
  #   When I view the show summary of "silo"
  #   Then each meta tag should have exactly one instance
  #   When I view the movie summary of "heretic-2024"
  #   Then each meta tag should have exactly one instance
