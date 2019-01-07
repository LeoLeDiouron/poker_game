var createId = require('../scripts/createId');
var Player = require('../models/player');

function action_random_room(req, res, infos_games, room_id) {
    if (room_id != null) {
        var player_id = createId.create_player_id();

        if (infos_games[room_id].addPlayer(new Player(player_id)) == true) {
            res.status(200).json({
                'room_id': room_id,
                'player_id': player_id,
                'cash': infos_games[room_id].getPlayer(player_id).getCash()
            });
        } else {
            res.status(200).json({});
        }
    } else {
        res.status(500).json({});
    }
    return infos_games;
}

module.exports = action_random_room;