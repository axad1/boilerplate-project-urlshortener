require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const dns = require("dns");

app.use(bodyParser.urlencoded({ extended: false }));

// Basic Configuration
const port = process.env.PORT || 3000;
let count = 0;
const urls = {};

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", function (req, res) {
  const url = req.body.url;
  if (!url) return res.json({ error: "invalid url" });
  dns.lookup(url, (err, address, family) => {
    if (err) {
      console.error("Domain does not resolve:", err);
      return res.json({ error: "invalid url" });
    } else {
      console.log("IP address:", address); // e.g., 93.184.216.34
      console.log("IP version:", family); // e.g., IPv4
      count++;
      const shorturl = {
        original_url: url,
        short_url: count,
      };
      urls[count] = shorturl;

      return res.json(shorturl);
    }
  });
  // res.json({ original_url: "https://freeCodeCamp.org", short_url: 1 });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
