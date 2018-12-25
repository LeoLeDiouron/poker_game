function get_infos_game(req, res, infos_games) {

    var room_id = req.query.room_id;
    var player_id = req.query.player_id;

    if (infos_games.hasOwnProperty(room_id) == false) {
        console.log('Room id ' + room_id + ' doesn\'t exist !');
        res.status(200).json({});
        return infos_games;
    }

    /*if (infos_games[room_id].getPlayers().length > 1 && infos_games[room_id].getStatus() == 0) {
        infos_games[room_id].giveHands();
        //infos_games[room_id].getRound().setBet(0);
        infos_games[room_id].increaseStatus();
    }*/

    var players = []; 
    infos_games[room_id].getPlayers().forEach(player => {
        players.push({'id':player.getName(), 'cash':player.getCash(), 'action':player.getAction()});
    });

    if (infos_games[room_id].getStatus() > 0) {
        return infosGameRound(req, res, infos_games);
    } else {
        res.status(200).json({
            'status': infos_games[room_id].getStatus(),
            'room_id': room_id,
            'player_id': player_id,
            'players': players,
            'cash': infos_games[room_id].getPlayer(player_id).getCash()
        });
    }
    return infos_games;
}

function infosGameRound(req, res, infos_games) {

    var room_id = req.query.room_id;
    var player_id = req.query.player_id;

    var round = {};
    var winner = "";

    var big_blind = infos_games[room_id].getRound().getBlind();

    var hand = [];
    infos_games[room_id].getPlayer(player_id).getHand().getCards().forEach(card => {
        hand.push({'value':card.getValue(), 'color':card.getColor()});
    });

    var cards_board = [];
    infos_games[room_id].getRound().getBoard().getCards().forEach(card => {
        cards_board.push({'value':card.getValue(), 'color':card.getColor()});
    });

    var players = []; 
    infos_games[room_id].getPlayers().forEach(player => {
        players.push({'id':player.getName(), 'cash':player.getCash(), 'action':player.getAction()});
    });

    infos_games[room_id].getPlayers()[infos_games[room_id].getRound().getCurrentPlayer()].setAction('playing...');

    if (infos_games[room_id].getRound().getWinner() != '') {
        var winner_name = infos_games[room_id].getRound().getWinner();
        var winner_infos = infos_games[room_id].getWinnerInfos(winner_name);
        var winner_cards = [];

        if ('combination' in winner_infos) {
            winner_infos['cards'].forEach(winner_card => {
                winner_cards.push({'value':winner_card.getValue(), 'color':winner_card.getColor()})
            })
            winner = {
                'name': winner_name,
                'cards': winner_cards,
                'combination': winner_infos['combination']
            }
        } else {
            winner = {
                'name': winner_name
            }
        }
    }

    var round = {
        'winner': winner,
        'pot': infos_games[room_id].getRound().getPot(),
        'current_bet': infos_games[room_id].getRound().getBet(),
        'board': cards_board,
        'little_blind': big_blind / 2,
        'big_blind': big_blind,
        'current_player': infos_games[room_id].getPlayers()[infos_games[room_id].getRound().getCurrentPlayer()].getName()
    }
    
    res.status(200).json({
        'status': infos_games[room_id].getStatus(),
        'room_id': room_id,
        'player_id': player_id,
        'round_id':infos_games[room_id].getRound().getId(),
        'players': players,
        'hand': hand,
        'round': round,
        'ready': infos_games[room_id].getPlayer(player_id).isReady(),
        'cash': infos_games[room_id].getPlayer(player_id).getCash(),
        'best_combination': infos_games[room_id].getPlayer(player_id).getBestCombination()
    });
    return infos_games;
}

module.exports = get_infos_game;