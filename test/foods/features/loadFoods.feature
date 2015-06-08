Feature: Load Available Foods
  As a food lover
  I want to load available foods
  So that I can choose what I should eat

  Background:

  Given <Food><Name>
    And <Food><Banana>
    And <Food><Apple>
    And <Food><Steak>
    And <Food><Bacon>
    And <Food><Egg>

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
