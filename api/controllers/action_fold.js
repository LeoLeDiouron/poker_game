function action_fold(req, res, infos_games) {
    var room_id = req.query.room_id;
    var player_id = req.query.player_id;

    console.log('FOLD');
    if (infos_games[room_id].getStatus() == 1) {
        console.log('FOLD');
        infos_games[room_id].getPlayer(player_id).setFold(true);
        infos_games[room_id].getPlayer(player_id).setAction('fold');
        infos_games[room_id].getRound().nextPlayer(infos_games[room_id].getPlayers());
        infos_games[room_id].checkEndRound();
    }
    res.status(200).json({'message':'OK'});
    return infos_games;
}

module.exports = action_fold;