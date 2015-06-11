Feature: Customize Resource
  As a customizer
  I want to customize a resource
  So that I can add resource specific operations

  Scenario: Get all boomerangs
    Given the custom resource app is started
    When I get all boomerangs with query "?name=banana"
    Then I recieve the message "banana"

  Scenario: Get a boomerang
    Given the custom resource app is started
    When I get a boomerang
    Then I recieve the message "hello boomerang"

  Scenario: Post a boomerang
    Given the custom resource app is started
    When I post a new boomerang with "hello"
    Then I recieve the message "hello"
