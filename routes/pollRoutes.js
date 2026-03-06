const express = require('express');
const router = express.Router();

const { readPolls, writePolls } = require('../utils/fileHandler');


// GET all polls
router.get('/', (req, res) => {

    const polls = readPolls();

    res.json(polls);

});


// GET single poll
router.get('/:id', (req, res) => {

    const polls = readPolls();

    const poll = polls.find(p => p.id == req.params.id);

    if (!poll) {
        return res.status(404).json({ message: "Poll not found" });
    }

    res.json(poll);

});


// CREATE poll
router.post('/', (req, res) => {

    const { question, options } = req.body;

    if (!question || !options) {
        return res.status(400).json({ message: "Question and options required" });
    }

    const polls = readPolls();

    const newPoll = {

        id: Date.now(),

        question,

        options: options.map(option => ({
            text: option,
            votes: 0
        }))

    };

    polls.push(newPoll);

    writePolls(polls);

    res.json({
        message: "Poll created successfully",
        poll: newPoll
    });

});


// VOTE
router.post('/:id/vote', (req, res) => {

    const { optionIndex } = req.body;

    const polls = readPolls();

    const poll = polls.find(p => p.id == req.params.id);

    if (!poll) {
        return res.status(404).json({ message: "Poll not found" });
    }

    if (poll.options[optionIndex]) {

        poll.options[optionIndex].votes++;

    }

    writePolls(polls);

    res.json({
        message: "Vote recorded",
        poll
    });

});


// DELETE poll
router.delete('/:id', (req, res) => {

    let polls = readPolls();

    polls = polls.filter(p => p.id != req.params.id);

    writePolls(polls);

    res.json({ message: "Poll deleted" });

});

module.exports = router;