import express from "express";
import cors from "cors";
import hash from "object-hash";
import config from "./config.json" assert {type: "json"};
import emailApi from "./routers/email.js";
import poemApi from "./routers/poem.js";

const app = express(); 
const port = config.port || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    const redirectHtml = `<script>location.href = "https://www.samproduce.com";</script>`;
    res.end(redirectHtml);
});

app.use("/email", emailApi);
app.use("/poem", poemApi);

app.listen(port, () => {
    // perform a database connection when server starts
    console.log(`Server is running on port: ${port}`);
  });