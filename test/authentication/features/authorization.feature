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

  Scenario: Create User
    Given I provide King and secret
    When I create a new user with the provided credentials
    Then the new user is created

  Scenario: Update User [Subject] as [UserName]
    Given I am logged in as "[UserName]"
    When I update the username of "[Subject]" to "[NewName]"
    Then the new user name is "[NewName]"
      And the password is still "[Password]"

    Where:
      | UserName  | Subject   | NewName   | Password    |
      | EnoF      | EnoF      | Andor     | secret      |
      | EnoF      | Banana    | BanHammer | superSecret |
      | Banana    | Banana    | King      | superSecret |
      | Foo       | Foo       | Baz       | bar123      |
      | Bar       | Bar       | Dude      | foo!@#      |

  Scenario: Prevent User [UserName] to update [Subject]
    Given I am logged in as "[UserName]"
    When I update the username of "[Subject]" to "test"
    Then the update is prevented

    Where:
      | UserName  | Subject   |
      | Foo       | EnoF      |
      | Bar       | Foo       |

  Scenario: Delete User [Subject] as [UserName]
    Given I am logged in as "[UserName]"
    When I delete a user "[Subject]"
    Then the user is [Deleted]

    Where:
      | UserName  | Subject   | Deleted     |
      | EnoF      | Banana    | deleted     |
      | EnoF      | EnoF      | deleted     |
      | Banana    | Banana    | deleted     |
      | Banana    | Foo       | not deleted |
