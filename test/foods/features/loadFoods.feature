Feature: Load Available Foods
  As a food lover
  I want to load available foods
  So that I can choose what I should eat

  Background:

  Given <Food><Name><Weight>
    And <Food><Banana><1000>
    And <Food><Apple><200>
    And <Food><Steak><400>
    And <Food><Bacon><200>
    And <Food><Egg><100>

  Scenario: Inspect food [Food]
    Given the food app is started
    When I request all food
    Then I expect to see food "[Food]" on position [Position]

    Where:
      Food  | Position
      Banana| 0
      Apple | 1
      Steak | 2
      Bacon | 3
      Egg   | 4
