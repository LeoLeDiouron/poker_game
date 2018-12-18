function algorithmCombination(cards_board, cards_hand) {
    var result = {'type': '', 'value': 0};

    var pair = checkPair(cards_board, cards_hand);
    if (pair != 0) {
        var brelan = checkBrelan(cards_board, cards_hand);
        if (brelan != 0) {
            result = {'type': 'brelan', 'value': brelan};
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
        console.log('pair in hand : ' + cards_hand[0].getValue());
    }
    cards_hand.forEach(card_hand => {
        cards_board.forEach(card_board => {
            if (card_hand.getValue() == card_board.getValue()) {
                console.log('pair in board : ' + card_hand.getValue());
                pair = (pair < card_hand.getValue()) ? card_hand.getValue() : pair;
            }
        });
    });

    return pair;
}

function checkBrelan(cards_board, cards_hand) {
    var brelan = 0;

    if (cards_hand[0].getValue() == cards_hand[1].getValue()) {
        cards_board.forEach(card_board => {
            if (cards_hand[0].getValue() == card_board.getValue()) {
                console.log('brelan in hand : ' + cards_hand[0].getValue());
                brelan = (brelan < cards_hand[0].getValue()) ? cards_hand[0].getValue() : brelan;
            }
        })
    } else {
        cards_hand.forEach(card_hand => {
            var occurence = {};
            cards_board.forEach(card_board => {
                if (card_hand.getValue() == card_board.getValue()) 
                    occurence[card_hand.getValue()]++;
            });
            for (value in occurence) {
                if (occurence[value] == 3) {
                    console.log('brelan in board : ' + value);
                    brelan = (brelan < value) ? value : brelan;
                }
            }
        });
    }
    if (brelan != 0)
        console.log('best brelan is ' + brelan);

    return brelan;
}

function checkDoublePair(cards_board, cards_hand) {
    var first_pair = 0;
    var second_pair = 0;

    cards_board.forEach(card_board => {
        if (cards_hand[0].getValue() == card_board.getValue()) {
            first_pair = cards_board[0].getValue();
        }
    });
    cards_board.forEach(card_board => {
        if (cards_hand[1].getValue() == card_board.getValue()) {
            second_pair = cards_board[1].getValue();
        }
    });
    if (first_pair != 0 && second_pair != 0 && first_pair < second_pair) {
        return {'first_pair': second_pair, 'second_pair': first_pair};
    }
    return {'first_pair': first_pair, 'second_pair': second_pair};
}

module.exports = algorithmCombination;