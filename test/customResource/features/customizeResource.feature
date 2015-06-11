Feature: Customize Resource
  As a customizer
  I want to customize a resource
  So that I can add resource specific operations

  Scenario: Post a boomerang
    Given the custom resource app is started
    When I post a new boomerang with "hello"
    Then I recieve the message "hello"
