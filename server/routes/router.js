var express = require('express');
var router = express.Router();
var path = require('path');

const file_to_load = 'views/game.html';

router.get('/', (req, res) => {
    res.sendFile(path.resolve(file_to_load));
});

module.exports = router;