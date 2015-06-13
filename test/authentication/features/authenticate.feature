Feature: Authenticate
  As a User
  I want to authenticate
  So that I can access secured resources

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

  Scenario: Login with [UserName]:[Password]
    Given I provide [UserName] and [Password]
    When I login with the provided credentials
    Then I expect to be [LoggedIn]

    Where:
      | UserName  | Password    | LoggedIn      |
      | EnoF      | secret      | logged in     |
      | enof      | secret      | logged in     |
      | EnoF      | secrett     | unauthorized  |
      | Banana    | superSecret | logged in     |
      | Banana    | supersecret | unauthorized  |
      | Foo       | bar123      | logged in     |
      | Bar       | foo!@#      | logged in     |
