const express = require("express");
const router = express.Router();

const { readPolls, writePolls } = require("../utils/fileHandler");

router.get("/", (req, res) => {

    const polls = readPolls();
    res.json(polls);

});


router.post("/", (req, res) => {

    const { question, options } = req.body;

    if (!question || !options || options.length < 2) {
        return res.status(400).json({
            message: "Question and at least 2 options are required"
        });
    }

    const polls = readPolls();

    const newPoll = {
        id: Date.now(),
        question,
        options: options.map(o => ({
            text: o,
            votes: 0,
            voters: [] 
        }))
    };

    polls.push(newPoll);

    writePolls(polls);

    res.json(newPoll);

});


router.post("/:id/vote", (req, res) => {

    const { optionIndex, userId } = req.body;

    if (optionIndex === undefined) {
        return res.status(400).json({ message: "optionIndex required" });
    }

    if (!userId) {
        return res.status(400).json({ message: "userId required" });
    }

    const polls = readPolls();

    const poll = polls.find(p => p.id == req.params.id);

    if (!poll) {
        return res.status(404).json({ message: "Poll not found" });
    }

    if (!poll.options[optionIndex]) {
        return res.status(400).json({ message: "Invalid option index" });
    }

    poll.options.forEach(opt => {
        if (!opt.voters) {
            opt.voters = [];
        }
    });


    const alreadyVoted = poll.options.some(opt =>
        opt.voters.includes(userId)
    );

    if (alreadyVoted) {
        return res.json({
            success: false,
            message: "You already voted"
        });
    }
    poll.options[optionIndex].votes++;
    poll.options[optionIndex].voters.push(userId);

    writePolls(polls);

    res.json({
        success: true
    });

});

router.get("/admin/results", (req, res) => {

    const { readUsers } = require("../utils/fileHandler");

    const polls = readPolls();
    const users = readUsers();

    const results = polls.map(poll => {

        const options = poll.options.map(option => {

            const voterNames = option.voters.map(voterId => {

                const user = users.find(u => u.id === voterId);

                return user ? user.username : "Unknown";

            });

            return {
                option: option.text,
                votes: option.votes,
                voters: voterNames
            };

        });

        return {
            pollId: poll.id,
            question: poll.question,
            options
        };

    });

    res.json(results);

});


module.exports = router;