var Card = require('./card');

class Board {

    constructor(cards) {
        this.cards = cards;
        this.status = 1;
    }

    addCard(card) {
        if (this.status < 3) {
            this.cards.push(card);
            this.status++;
            return true;
        } else {
            return false;
        }
    }

    getCards() {
        return this.cards;
    }

}

module.exports = Board;