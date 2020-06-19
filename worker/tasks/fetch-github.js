const fetch = require("node-fetch");

const baseURL = "https://jobs.github.com/positions.json";

async function fetchGitHub() {
  console.log("fetching github");

  let resultCount = 1,
    onPage = 0;
  const allJobs = [];

  while (resultCount > 0) {
    const res = await fetch(`${baseURL}?page=${onPage}`);
    const jobs = await res.json();
    allJobs.push(...jobs);
    resultCount = jobs.length;
    console.log("got", resultCount, "jobs");
    onPage++;
  }
  console.log("got", allJobs.length, "jobs total");
}

fetchGitHub();

module.exports = fetchGitHub;
