function algorithmCombination(cards_board, cards_hand) {
    
    var resume = resumeCards(cards_board, cards_hand);

    var results = {
        'high_card':resume['high_card'],
        'pair':0,
        'double_pair':[],
        'three_of_a_kind':0,
        'straight':0,
        'flush':{'color':'', 'values':[]},
        'full':[],
        'four_of_a_kind':0,
        'straight_flush':{'color':'', 'value':0}
    };

    // pair, double pair, three of a kind, four of a kind

    for (value in resume['values']) {
        if (resume['values'][value] == 2) {
            if (results['pair'] != 0) {
                if (results['double_pair'].length == 0) {
                    results['double_pair'] = [value, results['pair']];
                } else {
                    results['double_pair'][1] = results['double_pair'][0];
                    results['double_pair'][0] = value;
                }    
            }
            results['pair'] = value;
        }
        if (resume['values'][value] == 3)
            results['three_of_a_kind'] =  value;
        if (resume['values'][value] == 4)
            results['four_of_a_kind'] = value;
    }

    // full

    if (results['three_of_a_kind'] != 0 && results['pair'] != 0) {
        results['full'] = [results['three_of_a_kind'], results['pair']];
    }

    // flush

    for (color in resume['colors']) {
        if (resume['colors'][color] >= 5) {
            results['flush']['color'] = color;
            cards_board.forEach(card_board => {
                if (card_board.getColor() == color)
                    results['flush'] = insertFlush(results['flush'], card_board.getValue());
            });
            cards_hand.forEach(card_hand => {
                if (card_hand.getColor() == color)
                    results['flush'] = insertFlush(results['flush'], card_hand.getValue());
            });
        }
    }

    // straight

    var idx = resume['min'];
    while (idx <= resume['max'] - 4) {
        var is_straight = true;
        var _idx = idx;
        while (_idx < idx + 4) {
            if (resume['values'][_idx] == 0) {
                is_straight = false;
                break;
            }
            _idx++;
        }
        if (is_straight == true) {
            results['straight'] = _idx;
        }
        idx++;
    }

    // straight flush

    if (results['flush']['values'].length != 0 && results['straight'] != 0) {
        results['straight_flush'] = {'color':results['flush']['color'], 'value': results['straight']};
    }

    // find the best type

    for (type in results) {
        if ((type == 'double_pair' || type == 'full') && (results[type].length > 0)) {
            result = {'type': type, 'value': results[type]}
        } else if ((type == 'flush' || type == 'straight_flush') && results[type]['color'] != '') {
            result = {'type': type, 'value': results[type]}
        } else if (results[type] > 0) {
            result = {'type': type, 'value': results[type]}
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

function insertFlush(flush, value) {
    var initial_length = flush['values'].length;
    for (var i = 0; i < initial_length; i++) {
        if (flush['values'][i] < value) {
           flush['values'].splice(i, 0, value);
           break;
        }
    }
    if (flush['values'].length == initial_length)
        flush['values'].push(value);
    return flush;
}

function resumeCards(cards_board, cards_hand) {
    var resume = {
        'colors' : {
            'club':0,
            'spade':0,
            'diamond':0,
            'heart':0
        },
        'values' : {},
        'min' : 15,
        'max' : 0,
        'high_card': 0
    }

    for (var i = 2; i < 15; i++) {
        resume['values'][i] = 0;
    }

    cards_board.forEach(card_board => {
        resume = analyzeCard(resume, card_board.getValue(), card_board.getColor());
    });
    cards_hand.forEach(card_hand => {
        resume = analyzeCard(resume, card_hand.getValue(), card_hand.getColor());
    });
    resume['high_card'] = checkHighCard(cards_hand);
    return resume;
}

function analyzeCard(resume, value, color) {

    if (resume['min'] > value)
        resume['min'] = value;
    if (resume['max'] < value)
        resume['max'] = value;

    resume['colors'][color]++;
    resume['values'][value.toString()]++;

    return resume;
}

module.exports = algorithmCombination;