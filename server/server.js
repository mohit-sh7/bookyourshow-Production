import express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Server is live!");
});

app.listen(port, "0.0.0.0", () => {
    console.log(`Listening on port ${port}`);
});