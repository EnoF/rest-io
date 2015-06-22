Feature: Update Sub
  As a sub resource
  I want to update myself
  So that I can change my own name

  Background:

    Given <Parent><Name>
      And <Parent><ParentA>
      And <Sub><Parent><Name>
      And <Sub><ParentA><SubA>
      And <Sub><ParentA><SubB>

  Scenario: Update Sub [Sub] of [Parent]
    When I update sub "[Sub]" of [Parent] with name "[Name]"
      And I request sub resource "[Sub]" of "[Parent]"
    Then I expect to see sub resource "[Name]"

    Where:
      | Parent  | Sub   | Name  |
      | ParentA | SubA  | SubX  |
      | ParentA | SubB  | SubY  |
