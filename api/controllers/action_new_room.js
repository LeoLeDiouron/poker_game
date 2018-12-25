var createId = require('../scripts/createId');
var InfosGame = require('../models/infos_game');
var Player = require('../models/player');

function action_new_room(req, res, infos_games) {
    var player_id = createId.create_player_id();
    var room_id = createId.create_room_id();

    infos_games[room_id] = new InfosGame();
    infos_games[room_id].addPlayer(new Player(player_id));
    res.status(200).json({
        'room_id': room_id,
        'player_id': player_id,
        'cash': infos_games[room_id].getPlayer(player_id).getCash()
    });
    return infos_games;
}

module.exports = action_new_room;