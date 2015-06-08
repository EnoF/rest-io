Feature: Load Available lists
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
    And <List><Name><Fruits>
    And <List><Fruits><Apple,Banana>
    And <List><Breakfast><Bacon,Egg>

  Scenario: Inspect list [List]
    Given the food app is started
    When I request all lists
    Then I expect to see list "[List]" with "[Foods]"

    Where:
      List      | Foods
      Fruits    | Apple,Banana
      Breakfast | Bacon,Egg
