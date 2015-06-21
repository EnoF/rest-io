Feature: Delete Sub
  As a sub resource
  I want to remove myself from a collection
  So that the parent has no record of me anymore

  Background:

    Given <Parent><Name>
      And <Parent><ParentA>
      And <Sub><Parent><Name>
      And <Sub><ParentA><SubA>
      And <Sub><ParentA><SubB>

  Scenario: Remove Sub [Sub] of [Parent]
    When removing sub "[Sub]" of [Parent]
    Then I expect the sub to be removed

    Where:
      | Parent  | Sub   |
      | ParentA | SubA  |
      | ParentA | SubB  |
