const express = require('express');

const port = 3000;

const app = express();

app.get('/', function (req, res) {
    res.send('hello world')
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

module.exports = app;