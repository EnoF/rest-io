Feature: Populate Sub
  As a sub resource
  I want to control population
  So that I can decide what to populate

  Background:

  Given <Parent><Name>
    And <Parent><ParentA>
    And <Parent><ParentB>
    And <Ref><Name>
    And <Ref><RefA>
    And <Ref><RefB>
    And <Sub><Parent><Name><Ref><Name>
    And <Sub><ParentA><SubA><Ref><RefA>
    And <Sub><ParentA><SubB><Ref><RefB>

  Scenario: Populate sub [Sub] of [Parent]
    When I request sub resource "[SubResource]" of "[Parent]"
    Then I expect to see sub resource "[SubResource]"
      And I expect to see ref "[Ref]" populated

    Where:
      | Parent  | SubResource | Ref   |
      | ParentA | SubA        | RefA  |
      | ParentA | SubB        | RefB  |
