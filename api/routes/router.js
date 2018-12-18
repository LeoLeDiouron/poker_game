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

router.get('/infos_game', (req, res) => {
    infos_games = game(req, res, infos_games);
});

router.post('/follow', (req, res) => {
    var room_id = req.query.room_id;
    var player_id = req.query.player_id;

    if (infos_games[room_id].isRoundOver() == false) {
        var bet = infos_games[room_id].getRound().getBet() - infos_games[room_id].getPlayer(player_id).getBet();
        if (infos_games[room_id].getPlayer(player_id).increaseBet(bet) == true) {
            infos_games[room_id].getRound().increasePot(bet);
            infos_games[room_id].getRound().nextPlayer(infos_games[room_id].getPlayers());
            infos_games[room_id].getPlayer(player_id).setAction('follow');
        }
        infos_games[room_id].checkEndRound();
    }
    res.status(200).json({'message':'OK'});
});

router.post('/fold', (req, res) => {
    var room_id = req.query.room_id;
    var player_id = req.query.player_id;

    if (infos_games[room_id].isRoundOver() == false) {
        infos_games[room_id].getPlayer(player_id).setFold(true);
        infos_games[room_id].checkEndRound();
        infos_games[room_id].getPlayer(player_id).setAction('fold');
    }
    res.status(200).json({'message':'OK'});
});

router.post('/raise', (req, res) => {
    var room_id = req.query.room_id;
    var player_id = req.query.player_id;
    var raise = parseInt(req.query.raise);

    if (infos_games[room_id].isRoundOver() == false) {
        var bet = infos_games[room_id].getRound().getBet() - infos_games[room_id].getPlayer(player_id).getBet() + raise;
        if (infos_games[room_id].getPlayer(player_id).increaseBet(bet) == true) {
            infos_games[room_id].getRound().increaseBet(raise);
            infos_games[room_id].getRound().increasePot(bet);
            infos_games[room_id].getRound().nextPlayer(infos_games[room_id].getPlayers());
            infos_games[room_id].getPlayer(player_id).setAction('raise by ' + raise);
        }
        infos_games[room_id].checkEndRound();
    }
    res.status(200).json({'message':'OK'});
});

module.exports = router;