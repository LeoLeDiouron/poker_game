const type_values = {
    "high_card" : 0,
    "pair" : 1,
    "double_pair" : 2,
    "three_of_a_kind" : 3,
    "straight" : 4,
    "flush" : 5,
    "full" : 6,
    "four_of_a_kind" : 7,
    "straight_flush" : 8,
    "royal_straight_flush" : 9
}

function compareCombination(players) {
    var winners = [];
    var best_combination = {"type":"high_card", "value":0}

    players.forEach(player => {
        winners = checkPlayer(player, winners, best_combination);
        if (winners[0].getName() == player.getName())
            best_combination = player.getBestCombination();
    });
    return winners;
}

function checkPlayer(player, winners, best_combination) {
    var classment = 0;
    var player_combination = player.getBestCombination();

    if (type_values[player_combination['type']] > type_values[best_combination['type']]) {
        classment = 2;
    } else if (type_values[player_combination['type']] == type_values[best_combination['type']]) {
        if (player_combination['type'] == 'double_pair') {
            if ((player_combination['value']['first_pair'] > best_combination['value']['first_pair']) ||
                (player_combination['value']['first_pair'] == best_combination['value']['first_pair'] && player_combination['value']['second_pair'] > best_combination['value']['second_pair'])) {
                classment = 2;
            } else if (player_combination['value']['first_pair'] == best_combination['value']['first_pair'] && player_combination['value']['second_pair'] == best_combination['value']['second_pair']) {
                if (checkHandCards(player, winners[0]) == true)
                    classment = 1;
            }
        } else {
            if (player_combination['value'] > best_combination['value']) {
                classment = 2;
            } else if (player_combination['value'] == best_combination['value']) {
                classment = (checkHandCards(player, winners[0]) == true) ? 2 : 1;
            }
        }
    }
    if (classment == 2) {
        winners = [player];
        best_combination = player_combination;
    } else if (classment == 1) {
        winners.push(player);
    }
    return winners;
}

function checkHandCards(player, winner) {
    var cards_player = {'first_card':0, 'second_card':0};
    var cards_winner = {'first_card':0, 'second_card':0};

    cards_player['first_card'] = (compareValue(player) == true) ? player.getHand().getCards()[0].getValue() : player.getHand().getCards()[1].getValue();
    cards_winner['first_card'] = (compareValue(winner) == true) ? winner.getHand().getCards()[0].getValue() : winner.getHand().getCards()[1].getValue();
    if (cards_player['first_card'] > cards_winner['first_card'])
        return true;
    
    cards_player['second_card'] = (compareValue(player) == true) ? player.getHand().getCards()[1].getValue() : player.getHand().getCards()[0].getValue();
    cards_winner['second_card'] = (compareValue(winner) == true) ? winner.getHand().getCards()[1].getValue() : winner.getHand().getCards()[0].getValue()
    if (cards_player['second_card'] > cards_winner['second_card'])
        return true;

    return false;
}

function compareValue(player) {
    if (player.getHand().getCards()[0].getValue() > player.getHand().getCards()[1].getValue())
        return true;
    else
        return false;
}

module.exports = compareCombination;