@parallelTest
Feature: Test bs-sdk

    Feature to reproduce parallelsPerPlatform issue with bs-sdk

    Scenario Outline: Codeceptjs navigation <ID>
        Given Navigate to codeceptjs

    Examples:
        | Id |
        | 1  |
        | 2  |