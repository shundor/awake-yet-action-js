const core = require('@actions/core');
const github = require('@actions/github');

// most @actions toolkit packages have async methods
async function run() {
  try {
    console.log("hello world!")
    const repoOwner = github.context.repo.owner;
    const repo = github.context.repo.repo;
    const actor = github.context.actor;
    console.log(`found: ${repoOwner} ${repo} ${actor}!`);
    const expected_events = ['opened', 'edited', 'reopened', 'created', 'submitted'];
    console.log("Full action\n" + github.context.action)
    if (expected_events.includes(github.event.action) && github.event.issue) {
      // Issue details
      console.log('Conditional for payload fired - issues')
      const action = github.event.payload.issue.action
      user = github.event.payload.issue.user
      body = github.event.payload.issue.body
      issue_number = github.event.payload.issue.number
    } else if (expected_events.includes(github.event.payload.action) && github.event.payload.pull_request) {
      // Pull Request details
      console.log('Conditional for payload fired - pull_request')
      const action = github.event.payload.pull_request.action
      user = github.event.payload.pull_request.user
      body = github.event.payload.pull_request.body
    }

  } catch (error) {
    core.setFailed(error.message);

  }
}


run();
