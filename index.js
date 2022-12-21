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
}

run();
