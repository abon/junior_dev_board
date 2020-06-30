const express = require("express");
const { promisify } = require("util");
const redis = require("redis");
const cors = require("cors");

const app = express();
app.use(cors());
const client = redis.createClient();

const getAsync = promisify(client.get).bind(client);

app.get("/jobs", async (req, res) => {
  const jobs = await getAsync("github");
  console.log(JSON.parse(jobs).length);

  return res.send(jobs);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
