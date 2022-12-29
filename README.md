# Awake Yet?

Check a teammate's timezone and see if they're awake!

 ![](https://github.com/shundor/awake-yet-action-js/workflows/test/badge.svg) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

## About

This action allows you to check a teammate's timezone via an issue or PR comment.

## Usage

In your workflow, to create a new discussion, include a step like this:

```yaml
name: Example Action

on:
  issue_comment:
    types: [created, edited]
    branches:
      - main     
jobs:
  comment:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - name: Comment
        id: awake-yet-action-js
        uses: shundor/awake-yet-action-js@main
        env:
          GITHUB_TOKEN: "${{ secrets.GITHUB_TOKEN }}"
          GOOGLE_API_KEY: "${{ secrets.GOOGLE_API_KEY }}"          
```

## Inputs

The following secret needs to be created:

- `GOOGLE_API_KEY`: The body of the discussion

The following [Google Map Platform](https://console.cloud.google.com/google/maps-apis/overview) API's need to be enabled, and the API should be restricted to them:
- Geocoding API
- Geolocation API
- Maps JavaScript API
- Time Zone API
For this action to work correctly the team must have their location set in their [GitHub Profile](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/personalizing-your-profile#setting-your-location-and-time-zone).

## Outputs

If successful, the issue will have a new comment with the teammate's timezone info:
```
    Hi there, abirismyname! 👋
    

    You asked if rufusmbugua was awake yet.

    I can't tell you about their personal sleeping habits, sadly.

    I can tell you though that the date and time for rufusmbugua in Nairobi, Kenya is currently:

    December 29th 2022, 7:28 pm

    I hope that helps clarify the matter for you!
```    

## Example

This repo contains an example [workflow](https://github.com/shundor/awake-yet-action-js/blob/main/.github/workflows/example.yml) that contains this action.

## Credits

- :bow: Based on [bencgreenberg/awake-yet-action](https://github.com/bencgreenberg/awake-yet-action).
- :bow: [@breton](breton) for the testing and help!
- :bow: [@manishapriya94](manishapriya94) for inspiration!
