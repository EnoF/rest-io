Feature: Authorize
  As a User
  I want to make sure my details are regulated with authorization
  So that not everyone can view or edit my details

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

  Scenario: View User Details [UserName] looking for [Subject]
    Given I am logged in as "[UserName]"
    When I view user details of "[Subject]"
    Then I can [See] the user details

    Where:
      | UserName  | Subject | See     |
      | EnoF      | EnoF    | see     |
      | Bar       | EnoF    | not see |
      | EnoF      | Bar     | see     |
