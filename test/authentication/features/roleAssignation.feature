Feature: Role Assignation
  As a Admin
  I want to be assigning user roles
  So that new users with new roles can be added

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

  Scenario: Update user with new role
    Given I am logged in as "[User]"
    When I am updating user "[Subject]" with "[Role]"
    Then user "[Subject]" should have "[ExpectedRole]" role

    Where:
      | User    | Subject   | Role        | ExpectedRole  |
      | EnoF    | Banana    | SUPER_USER  | SUPER_USER    |
      | EnoF    | Bar       | ADMIN       | ADMIN         |
      | Banana  | EnoF      | SUPER_USER  | ADMIN         |
      | Banana  | Banana    | ADMIN       | MODERATOR     |
      | Bar     | Bar       | ADMIN       |               |
