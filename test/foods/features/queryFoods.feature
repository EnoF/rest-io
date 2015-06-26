Feature: Query Available Foods
  As a food lover
  I want to search for specific available foods
  So that I can choose what I should eat

  Background:

  Given <Food><Name>
    And <Food><Banana>
    And <Food><Banana Soup>
    And <Food><Apple>
    And <Food><Steak>
    And <Food><Bacon>
    And <Food><Egg>

  Scenario: Query foods by attribute [Attr] [Query]
    Given the food app is started
    When I query for "[Attr]" with "[Query]"
    Then I expect the results to be "[Results]"

    Where:
      | Attr      | Query         | Results             |
      | name      | /banana/i     | Banana,Banana Soup  |
      | name      | banana        |                     |
      | name      | Banana        | Banana,Banana Soup  |
      | name      | /^Banana$/    | Banana              |
      | name      | /soup/i       | Banana Soup         |
