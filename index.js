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
  } catch (error) {
    core.setFailed(error.message);
  }

  // Events the action is looking for
  const expected_events= ['opened', 'edited', 'reopened', 'created', 'submitted'];
  console.log("Full event\n" + github.event)
  console.log("Action:\n" + github.event.action)
  console.log("Issue:\n" + github.event.issue)
  // if (expected_events.includes(github.event.action) && github.event.issue) {
  //   // Issue details
  //   console.log('Conditional for payload fired - issues')
  //   const action = github.event.payload.issue.action
  //   user = github.context.payload.issue.user
  //   body = github.context.payload.issue.body
  //   issue_number = github.context.payload.issue.number
  // } else if (expected_events.includes(github.context.payload.action) && github.context.payload.pull_request) {
  // // Pull Request details
  //   console.log('Conditional for payload fired - pull_request')
  //   const action = github.context.payload.pull_request.action
  //   user = github.context.payload.pull_request.user
  //   body = github.context.payload.pull_request.body
  // };
}

run();
