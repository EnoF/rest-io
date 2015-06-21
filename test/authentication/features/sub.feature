Feature: Authorized Sub
  As an Sub
  I want to have authorized access
  So that I can be protected from unauthorized access

  Background:

  Given <Role><Name>
    And <Role><ADMIN>
    And <Role><MODERATOR>
    And <Role><SUPER_USER>
    And <User><UserName><Password><Role>
    And <User><EnoF><secret><ADMIN>
    And <User><Banana><superSecret><MODERATOR>
    And <User><Foo><bar123><SUPER_USER>
    And <User><Bar><foo!@#><>
    And I am logged in as "EnoF"
    And <Parent><Name>
    And <Parent><ParentA>
    And <Parent><ParentB>
    And <Sub><Parent><Name>
    And <Sub><ParentA><SubA>
    And <Sub><ParentA><SubB>
    And <Sub><ParentB><SubC>
    And <Sub><ParentB><SubD>
    And <Sub><ParentB><SubE>

  Scenario: View all subs as [UserName]
    Given I am logged in as "[UserName]"
    When I view all subs of "[Parent]"
    Then I expect to [See] sub resources "[SubSources]"

    Where:
      | Parent  | SubSources      | UserName | See      |
      | ParentA | SubA,SubB       | EnoF     | see      |
      | ParentB | SubC,SubD,SubE  | EnoF     | see      |
      | ParentA | SubA,SubB       | Bar      | not see  |

  Scenario: View sub by id as [UserName]
    Given I am logged in as "[UserName]"
    When I view sub "[Sub]" of "[Parent]"
    Then I expect to [See] sub resource "[Sub]"

    Where:
      | Parent  | Sub   | UserName  | See       |
      | ParentA | SubA  | EnoF      | see       |
      | ParentA | SubA  | Bar       | not see   |
