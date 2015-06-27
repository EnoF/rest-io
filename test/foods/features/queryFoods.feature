Feature: Query Available Foods
  As a food lover
  I want to search for specific available foods
  So that I can choose what I should eat

  Background:

  Given <Food><Name><Weight>
    And <Food><Banana><1000>
    And <Food><Banana Soup><500>
    And <Food><Apple><200>
    And <Food><Steak><400>
    And <Food><Bacon><200>
    And <Food><Egg><100>

  Scenario: Query foods by attribute [Attr] [Query]
    Given the food app is started
    When I query for "[Attr]" with "[Query]"
    Then I expect the results to be "[Results]"

    Where:
      | Attr      | Query           | Results                 |
      | name      | /banana/i       | Banana,Banana Soup      |
      | name      | banana          |                         |
      | name      | Banana          | Banana,Banana Soup      |
      | name      | /^Banana$/      | Banana                  |
      | name      | /soup/i         | Banana Soup             |
      | weight    | { "$gt": 400 }  | Banana,Banana Soup      |
      | weight    | { "$lt": 500 }  | Apple,Bacon,Steak,Egg   |
