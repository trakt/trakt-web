Feature: Basic navigation

  Scenario: Public pages
    When I click on the "nav-bar-home-button" button
    Then I should see "Home" in the page title

    When I click on the "nav-bar-shows-button" button
    Then I should see "Shows" in the page title

    When I click on the "nav-bar-movies-button" button
    Then I should see "Movies" in the page title
