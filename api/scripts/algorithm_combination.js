// TODO: FIND A GENERIC WAY TO GET ALL THE DATAS FROM THE CARDS

function algorithmCombination(cards_board, cards_hand) {
    var result = {'type': '', 'value': 0};

    var pair = checkPair(cards_board, cards_hand);
    if (pair != 0) {
        var three_of_a_kind = checkThreeOfAKind(cards_board, cards_hand);
        if (three_of_a_kind != 0) {
            var four_of_a_kind = checkFourOfAKind(cards_board, cards_hand);
            if (four_of_a_kind != 0) {
                result = {'type': 'four_of_a_kind', 'value': four_of_a_kind};
            } else {
                result = {'type': 'three_of_a_kind', 'value': three_of_a_kind};
            }
        } else {
            var double_pair = checkDoublePair(cards_board, cards_hand);
            if (double_pair.first_pair != 0 && double_pair.second_pair != 0) {
                result = {'type': 'double_pair', 'value': double_pair};
            } else {
                result = {'type': 'pair', 'value': pair};
            }
        }
    } else {
        var high_card = checkHighCard(cards_hand);
        result = {'type': 'high_card', 'value': high_card};
    }

    var flush = checkFlush(cards_board, cards_hand);
    if (flush.length > 0) {
        result = {'type': 'flush', 'value': flush};
    } else {
        var straight = checkStraight(cards_board, cards_hand);
        if (straight != 0) {
            result = {'type': 'straight', 'value': straight};
        }
    }

    return result;
}

function checkHighCard(cards_hand) {
    if (cards_hand[0].getValue() > cards_hand[1].getValue()) {
        return cards_hand[0].getValue();
    } else {
        return cards_hand[1].getValue();
    }
}

function checkPair(cards_board, cards_hand) {
    var pair = 0;

    if (cards_hand[0].getValue() == cards_hand[1].getValue()) {
        pair = (pair < cards_hand[0].getValue()) ? cards_hand[0].getValue() : pair;
    }
    cards_hand.forEach(card_hand => {
        cards_board.forEach(card_board => {
            if (card_hand.getValue() == card_board.getValue()) {
                pair = (pair < card_hand.getValue()) ? card_hand.getValue() : pair;
            }
        });
    });

    return pair;
}

function checkThreeOfAKind(cards_board, cards_hand) {
    var three_of_a_kind = 0;

    if (cards_hand[0].getValue() == cards_hand[1].getValue()) {
        cards_board.forEach(card_board => {
            if (cards_hand[0].getValue() == card_board.getValue()) {
                three_of_a_kind = (three_of_a_kind < cards_hand[0].getValue()) ? cards_hand[0].getValue() : three_of_a_kind;
            }
        })
    } else {
        three_of_a_kind = checkOccurences(cards_board, cards_hand, three_of_a_kind, 2);
    }

    return three_of_a_kind;
}

function checkDoublePair(cards_board, cards_hand) {
    var first_pair = 0;
    var second_pair = 0;

    cards_board.forEach(card_board => {
        if (cards_hand[0].getValue() == card_board.getValue()) {
            first_pair = cards_hand[0].getValue();
        }
    });
    cards_board.forEach(card_board => {
        if (cards_hand[1].getValue() == card_board.getValue()) {
            second_pair = cards_hand[1].getValue();
        }
    });
    if (first_pair != 0 && second_pair != 0 && first_pair < second_pair) {
        return {'first_pair': second_pair, 'second_pair': first_pair};
    }
    return {'first_pair': first_pair, 'second_pair': second_pair};
}

function checkFlush(cards_board, cards_hand) {
    var flush = [];
    var colors_occurences = {
        'club':0,
        'spade':0,
        'diamond':0,
        'heart':0
    };

    cards_board.forEach(card_board => {
        colors_occurences[card_board.getColor()]++;
    });
    cards_hand.forEach(card_hand => {
        colors_occurences[card_hand.getColor()]++;
    });

    for(color in colors_occurences) {
        if (colors_occurences[color] >= 5) {
            console.log('color 5: ' + color);
            cards_board.forEach(card_board => {
                if (card_board.getColor() == color)
                    flush = insertFlush(flush, card_board.getValue());
            });
            cards_hand.forEach(card_hand => {
                if (card_hand.getColor() == color)
                    flush = insertFlush(flush, card_hand.getValue());
            });
        }
    }

    return flush;
}

function checkStraight(cards_board, cards_hand) {
    var straight = 0;

    return straight;
}

function checkFull(cards_board, cards_hand) {
    var full = {};

    return full;
}

function checkFourOfAKind(cards_board, cards_hand) {
    var four_of_a_kind = 0;

    if (cards_hand[0].getValue() == cards_hand[1].getValue()) {
        var occurence = 0;
        cards_board.forEach(card_board => {
            if (cards_hand[0].getValue() == card_board.getValue()) {
                occurence++;
            }
        });
        if (occurence >= 2)
            four_of_a_kind = (four_of_a_kind < cards_hand[0].getValue()) ? cards_hand[0].getValue() : four_of_a_kind;
    } else {
        four_of_a_kind = checkOccurences(cards_board, cards_hand, four_of_a_kind, 3);
    }

    return four_of_a_kind;
}

/*  _________________________________ SCRIPTS _________________________________ */

function insertFlush(flush, value) {
    var initial_length = flush.length;
    for (var i = 0; i < initial_length; i++) {
        if (flush[i] < value) {
           flush.splice(i, 0, value);
           break;
        }
    }
    if (flush.length == initial_length)
        flush.push(value);
    return flush;
}

function checkOccurences(cards_board, cards_hand, result, nb_occurences) {
    cards_hand.forEach(card_hand => {
        var occurence = {};
        cards_board.forEach(card_board => {
            if (card_hand.getValue() == card_board.getValue()) {
                if (card_hand.getValue() in occurence)
                    occurence[card_hand.getValue().toString()]++;
                else 
                    occurence[card_hand.getValue().toString()] = 1;
            }
        });
        for (value in occurence) {
            if (occurence[value] == nb_occurences) {
                result = (result < value) ? value : result;
            }
        }
    });
    return result;
}

module.exports = algorithmCombination;