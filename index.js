const core = require('@actions/core');
const github = require('@actions/github');
const Geocoder = require('node-geocoder');
const moment = require('moment');
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
    const tools = github.getOctokit(process.env.GITHUB_TOKEN);
    console.log("github context action: " + context.payload.action)
    console.log("github context eventName: " + context.eventName)
    //console.log(JSON.stringify(github.context, null, 2));
    const owner = context.repo.owner;
    const repo = context.repo.repo;
    const actor = context.actor;
    console.log(`found: ${owner} ${repo} ${actor}!`);
    const expected_events = ['opened', 'edited', 'reopened', 'created', 'submitted'];

    if (expected_events.includes(context.payload.action) && context.eventName.includes("issue")) {
      // Issue details
      console.log('Conditional for payload fired - issues')
      user = context.payload.comment.user.login
      body = context.payload.comment.body
      issue_number = context.payload.issue.number
    } else if (expected_events.includes(context.payload.action) && context.eventName.includes("pull_request")) {
      // Pull Request details
      console.log('Conditional for payload fired - pull_request')
      user = context.payload.pull_request.user.login
      body = context.payload.pull_request.body
    } else {
      console.log("error")
      console.log(context.payload.action)
      console.log(context.eventName)
      process.exit(1)
    }

    // Print our user, body, and issue number
    console.log(`User: ${user}, Body: ${body}`)

    // Check for string that triggers time check
    body = body.toLowerCase();
    if (body.includes('is') && body.includes('awake?')) {
      // If it does, get user info
      const startIndex = body.indexOf('is') + 'is'.length;
      const endIndex = body.indexOf('awake', startIndex);      
      const subStr = body.substring(startIndex, endIndex);
      
      console.log(subStr);
      person = subStr.trim().replace('@', '');
      console.log(`person: ${person}`);
      person_info = (await tools.rest.users.getByUsername({
        username: person
      })).data;
      //console.log(JSON.stringify(person_info, null, 2));
      // Get the location specified in their profile
      user_location = person_info.location;
      console.log(`user_location: ${user_location}`);

      // Check if location is defined

      // If it is then gather the time information for it
      if (person_info.location != '' || person_info.location.length != 0) {

        // Get the time in that location, first get lat and long then get the time for those coordinates
        // Set options for the Geocoder
        var options = {
          provider: 'google',
          httpAdapter: 'https',
          apiKey: process.env.GOOGLE_API_KEY,
          formatter: null
        };
        // Initialize the Geocoder with the options and get the data
        var geocoder = Geocoder(options);
        var geocode_data = (await geocoder.geocode(`${user_location}`));

        // Timestamp of current time in UTC
        var timestamp = Math.floor((new Date()).getTime() / 1000);
        
        // Get the time zone data from the Google Time Zone API
        const getTimezoneData = () => {
          return axios({
            method: 'get',
            url: `https://maps.googleapis.com/maps/api/timezone/json?location=${geocode_data[0]['latitude']},${geocode_data[0]['longitude']}&timestamp=${timestamp}&key=${process.env.GOOGLE_API_KEY}`
          })
        }
        // print out url        
        console.log(`https://maps.googleapis.com/maps/api/timezone/json?location=${geocode_data[0]['latitude']},${geocode_data[0]['longitude']}&timestamp=${timestamp}&key=${process.env.GOOGLE_API_KEY}`)
        const timeZoneData = (await getTimezoneData()).data;
        console.log(`timeZoneData ${JSON.stringify(timeZoneData)} !`);
        // Assign the date and time in the user's location to the date_time variable
        const local_timestamp = timestamp + + timeZoneData['dstOffset'] + timeZoneData['rawOffset'];
        date_time = new Date(local_timestamp * 1000);
        date_string = moment(date_time).format('MMMM Do YYYY, h:mm a');
        console.log(date_string);  // Output: "January 1, 2022 12:00"

        const responseMsg = `
        Hi there, ${actor}! 👋
        \n
        You asked if ${person} was awake yet.\n
        I can't tell you about their personal sleeping habits, sadly.\n
        I can tell you though that the date and time for ${person} in ${user_location} is currently:\n
        ${date_string}\n
        I hope that helps clarify the matter for you!
      `;
        console.log(responseMsg)
        await tools.rest.issues.createComment({
          owner: owner,
          repo: repo,
          issue_number: issue_number,
          body: responseMsg
        });
      } else {
        // If it is not, formulate a response that lets the questioner know that
        const responseMsg = `
        Sorry, but ${person} did not specify a location in their profile!\n
        I can't look up the time in an undefined location.
      `;
        console.log(responseMsg)
        await tools.rest.issues.createComment({
          owner: owner,
          repo: repo,
          issue_number: issue_number,
          body: responseMsg
        });
      }
    }
  } catch (error) {
    core.setFailed(error.message);

  }
}


run();
