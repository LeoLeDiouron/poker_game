var createId = require('../scripts/createId');
var Player = require('../models/player');

function action_join_room(req, res, infos_games) {
    var room_id = req.query.room_id;
    var player_id = createId.create_player_id();

    if (room_id in infos_games) {
        if (infos_games[room_id].addPlayer(new Player(player_id)) == true) {
            res.status(200).json({
                'room_id': room_id,
                'player_id': player_id,
                'cash': infos_games[room_id].getPlayer(player_id).getCash()
            });
        } else {
            res.status(500).json({'error_message':'not enough place'});
        }
    } else {
        res.status(500).json({'error_message':'this room doesn\'t exist'});
    }
    return infos_games;
}

module.exports = action_join_room;