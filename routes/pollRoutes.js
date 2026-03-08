const express = require("express");
const router = express.Router();

const { readPolls, writePolls } = require("../utils/fileHandler");


router.get("/", (req, res) => {

    const polls = readPolls();

    res.json(polls);

});


router.post("/", (req, res) => {

    const { question, options } = req.body;

    const polls = readPolls();

    const newPoll = {
        id: Date.now(),
        question,
        options: options.map(o => ({
            text: o,
            votes: 0
        }))
    };

    polls.push(newPoll);

    writePolls(polls);

    res.json(newPoll);

});


router.post("/:id/vote", (req, res) => {

    const polls = readPolls();

    const poll = polls.find(p => p.id == req.params.id);

    if (!poll) {
        return res.status(404).json({ message: "Poll not found" });
    }

    const { optionIndex } = req.body;

    poll.options[optionIndex].votes++;

    writePolls(polls);

    res.json(poll);

});


module.exports = router;