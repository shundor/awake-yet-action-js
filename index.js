const core = require('@actions/core');
const github = require('@actions/github');
const Geocoder = require('node-geocoder');
const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios').default;
// Create variables for future values
var user = '';
var person = '';
var person_info = '';
var user_location = '';
var body = '';
var issue_number = '';
var date_time = '';
var date_string = '';

async function run() {
  try {
    console.log("hello world!")
    const repoOwner = github.context.repo.owner;
    const repo = github.context.repo.repo;
    const actor = github.context.actor;
    console.log(`found: ${repoOwner} ${repo} ${actor}!`);
    const expected_events = ['opened', 'edited', 'reopened', 'created', 'submitted'];

    if (expected_events.includes(github.event.action) && github.event.issue) {
      // Issue details
      console.log('Conditional for payload fired - issues')
      user = github.event.issue.user.login
      body = github.event.issue.body
      issue_number = github.event.issue.number
    } else if (expected_events.includes(github.event.action) && github.event.payload.pull_request) {
      // Pull Request details
      console.log('Conditional for payload fired - pull_request')
      user = github.event.pull_request.user.login
      body = github.event.pull_request.body
    }

// Print our user, body, and issue number
    console.log(`User: ${user} Body: ${body} Issue Number: ${issue_number}`)

  } catch (error) {
    core.setFailed(error.message);

  }
}


run();
