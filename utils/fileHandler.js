const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'data', 'polls.json');

function readPolls() {

    const data = fs.readFileSync(filePath);

    return JSON.parse(data);

}

function writePolls(polls) {

    fs.writeFileSync(filePath, JSON.stringify(polls, null, 2));

}

module.exports = { readPolls, writePolls };