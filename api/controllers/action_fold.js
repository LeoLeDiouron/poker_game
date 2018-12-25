function action_fold(req, res, infos_games) {
    var room_id = req.query.room_id;
    var player_id = req.query.player_id;

    if (infos_games[room_id].isRoundOver() == false) {
        infos_games[room_id].getPlayer(player_id).setFold(true);
        infos_games[room_id].checkEndRound();
        infos_games[room_id].getPlayer(player_id).setAction('fold');
    }
    res.status(200).json({'message':'OK'});
    return infos_games;
}

module.exports = action_fold;