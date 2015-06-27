Feature: Load Available lists
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
