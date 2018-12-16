var Card = require('./card');

class Hand {
    constructor(cards) {
        this.cards = cards;
    }

    getCards() {
        return this.cards;
    }
}

module.exports = Hand;