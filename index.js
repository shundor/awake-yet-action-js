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
    const context = github.context;
    console.log("github context action"+ context.payload.action)
    console.log("github context eventName"+ context.eventName)
    console.log(JSON.stringify(github.context, null, 2));
    const repoOwner = context.repo.owner;
    const repo = context.repo.repo;
    const actor = context.actor;
    console.log(`found: ${repoOwner} ${repo} ${actor}!`);
    const expected_events = ['opened', 'edited', 'reopened', 'created', 'submitted'];

    if (expected_events.includes(context.payload.action) && context.eventName.includes("issue")) {
      // Issue details
      console.log('Conditional for payload fired - issues')
      user = context.payload.comment.user.login
      body = context.payload.comment.body
    } else if (expected_events.includes(context.payload.action) && context.eventName.includes("pull_request")) {
      // Pull Request details
      console.log('Conditional for payload fired - pull_request')
      user = context.payload.pull_request.user.login
      body = context.payload.pull_request.body
    } else {
      console.log("error")
      console.log(context.payload.action)
      console.log(context.eventName)
      exit(1)      
    }

// Print our user, body, and issue number
    console.log(`User: ${user} Body: ${body}`)

  } catch (error) {
    core.setFailed(error.message);

  }
}


run();
