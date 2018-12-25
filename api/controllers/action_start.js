function action_start(req, res, infos_games) {
    var room_id = req.query.room_id;
    var player_id = req.query.player_id;

    if (infos_games[room_id].getStatus() != 1) {
        infos_games[room_id].getPlayer(player_id).setReady(true);
        infos_games[room_id].checkPlayersReady();
    }
    res.status(200).json({'message':'OK'});
    return infos_games;
}

module.exports = action_start;