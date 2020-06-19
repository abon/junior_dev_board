const fetch = require("node-fetch");
const redis = require("redis");
const client = redis.createClient();

const { promisify } = require("util");
// const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

const baseURL = "https://jobs.github.com/positions.json";

async function fetchGitHub() {
  console.log("fetching github");

  let resultCount = 1,
    onPage = 0;
  const allJobs = [];

  //fetch all pages
  while (resultCount > 0) {
    const res = await fetch(`${baseURL}?page=${onPage}`);
    const jobs = await res.json();
    allJobs.push(...jobs);
    resultCount = jobs.length;
    console.log("got", resultCount, "jobs");
    onPage++;
  }

  //filter algo
  const jrJobs = allJobs.filter(job => {
    const jobTitle = job.title.toLowerCase();
    let isJunior = true;

    //algo logic
    if (
      jobTitle.includes("senior") ||
      jobTitle.includes("sr.") ||
      jobTitle.includes("architect") ||
      jobTitle.includes("manager")
    ) {
      return false;
    }
    return true;
  });

  console.log("filtered down to", jrJobs.length);

  //set in redis
  console.log("got", allJobs.length, "jobs total");
  const success = await setAsync("github", JSON.stringify(jrJobs));

  console.log({ success });
}

fetchGitHub();

module.exports = fetchGitHub;
