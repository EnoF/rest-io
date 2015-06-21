Feature: Load Sub
  As sub resource
  I want to be addressed induvidually
  So that my parent resource doesn't has to be bothered on all my actions

  Background:

    Given <Parent><Name>
      And <Parent><ParentA>
      And <Parent><ParentB>
      And <Sub><Parent><Name>
      And <Sub><ParentA><SubA>
      And <Sub><ParentA><SubB>
      And <Sub><ParentB><SubC>
      And <Sub><ParentB><SubD>
      And <Sub><ParentB><SubE>

  Scenario: Load Sub Resources of [Parent]
    When I request all sub resources of "[Parent]"
    Then I expect to see sub resources "[SubSources]"

    Where:
      | Parent  | SubSources      |
      | ParentA | SubA,SubB       |
      | ParentB | SubC,SubD,SubE  |

  Scenario: Load Sub Resource [SubResource] of [Parent]
    When I request sub resource "[SubResource]" of "[Parent]"
    Then I expect to see sub resource "[SubResource]"

    Where:
      | Parent  | SubResource |
      | ParentA | SubA        |
      | ParentA | SubB        |
      | ParentB | SubC        |
      | ParentB | SubD        |
      | ParentB | SubE        |
