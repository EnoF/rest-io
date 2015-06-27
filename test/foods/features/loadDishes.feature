Feature: Load Available Dishes
  As a food lover
  I want to load available dishes
  So that I can choose what I should eat

  Background:

  Given <Food><Name><Weight>
    And <Food><Banana><1000>
    And <Food><Bacon><200>
    And <Food><Egg><100>
    And <Dish><Name><Food>
    And <Dish><Salad><Banana>
    And <Dish><Breakfast><Egg>
    And <Dish><Diner><Bacon>

  Scenario: Search dish [Query] and populate [Populate]
    Given the food app is started
    When I query attr "[Attr]" with "[Query]" and populate "[Populate]" of "[Food]"
    Then I expect to see dishes "[Results]"
      And I expect the main ingredient [Populated] populated

    Where:
      | Attr | Query      | Populate        | Results     | Populated   | Food  |
      | name | Breakfast  | mainIngredient  | Breakfast   | to be       | Egg   |
      | name | Breakfast  |                 | Breakfast   | not to be   | Egg   |
