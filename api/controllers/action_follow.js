function action_follow(req, res, infos_games) {
    var room_id = req.query.room_id;
    var player_id = req.query.player_id;

    if (infos_games[room_id].getStatus() == 1 && infos_games[room_id].getPlayers()[infos_games[room_id].getRound().getCurrentPlayer()].getName() == player_id) {
        var bet = infos_games[room_id].getRound().getBet() - infos_games[room_id].getPlayer(player_id).getBet();
        if (infos_games[room_id].getPlayer(player_id).increaseBet(bet) == true) {
            infos_games[room_id].getRound().increasePot(bet);
            infos_games[room_id].getRound().nextPlayer(infos_games[room_id].getPlayers());
            infos_games[room_id].getPlayer(player_id).setAction('follow');
        }
        infos_games[room_id].checkEndRound();
    }
    res.status(200).json({'message':'OK'});
    return infos_games;
}

module.exports = action_follow;