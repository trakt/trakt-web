Feature: Basic navigation

  Scenario: Public static pages
    When I click on the "consent-button" button
    Then I should see "Home" in the page title

    When I open the shows section
    Then I should see "Shows" in the page title

    When I open the movies section
    Then I should see "Movies" in the page title

  @live-data
  Scenario: Public live-data pages
    When I click on the "consent-button" button
    And I view the show summary of "silo"
    Then I should see the "summary-media-title" element on the page

    When I view the movie summary of "heretic-2024"
    Then I should see the "summary-media-title" element on the page
    And I should not see the "feature-flag-tool-button" element on the page
