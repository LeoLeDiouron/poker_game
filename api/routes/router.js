var get_infos_game = require('../controllers/get_infos_game');
var action_new_room = require('../controllers/action_new_room');
var action_join_room = require('../controllers/action_join_room');
var action_follow = require('../controllers/action_follow');
var action_fold = require('../controllers/action_fold');
var action_raise = require('../controllers/action_raise');
var action_start = require('../controllers/action_start');

const express = require('express');
const router = express.Router();

var infos_games = {};

router.get('/new_room', (req, res) => {
    infos_games = action_new_room(req, res, infos_games);
});

router.get('/join_room', (req, res) => {
    infos_games = action_join_room(req, res, infos_games);
});

router.get('/infos_game', (req, res) => {
    infos_games = get_infos_game(req, res, infos_games);
});

router.post('/follow', (req, res) => {
    infos_games = action_follow(req, res, infos_games);
});

router.post('/fold', (req, res) => {
    infos_games = action_fold(req, res, infos_games);
});

router.post('/raise', (req, res) => {
    infos_games = action_raise(req, res, infos_games);
});

router.post('/start', (req, res) => {
    infos_games = action_start(req, res, infos_games);
});

module.exports = router;