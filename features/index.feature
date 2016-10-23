Feature: Index Page

  As a human
  I want to see more information
  So I can learn more about site author

  @watch
  Scenario: Navigate to home page and expand "More about me" section
    Given I have visited the site index
    When I click on `[href="#more_about_me"]`
    Then I see `#more_about_me` is visible
