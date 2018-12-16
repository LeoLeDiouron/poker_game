var InfosGame = require('../models/infos_game');
var Player = require('../models/player');
var createId = require('../controllers/createId');
var game = require('../controllers/game');

const express = require('express');
const router = express.Router();

var infos_games = {};

const STATUS_WAIT = 0;
const STATUS_BOARD = 1;
const STATUS_HAND = 2;
const STATUS_PLAY = 3;

router.get('/begin', (req, res) => {
    var player_id = createId.create_player_id();
    var room_id = createId.create_room_id();
    infos_games[room_id] = new InfosGame();
    infos_games[room_id].addPlayer(new Player(player_id));
    res.status(200).json({
        'room_id': room_id,
        'player_id': player_id,
        'cash': infos_games[room_id].getPlayer(player_id).getCash()
    });
});

router.get('/join', (req, res) => {
    var room_id = req.query.room_id;
    var player_id = createId.create_player_id();
    infos_games[room_id].addPlayer(new Player(player_id));
    res.status(200).json({
        'room_id': room_id,
        'player_id': player_id,
        'cash': infos_games[room_id].getPlayer(player_id).getCash()
    });
});

router.get('/game', (req, res) => {
    infos_games = game(req, res, infos_games);
});

module.exports = router;