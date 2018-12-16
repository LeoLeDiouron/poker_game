var Board = require('./board');

const BLIND = 2;

class Round {

    constructor(cards) {
        this.board = new Board(cards);
        this.pot = 0;
        this.little_blind = BLIND / 2;
        this.big_blind = BLIND;
        this.current_player = 0;
    }

    getBoard() {
        return this.board;
    }

    getBlind() {
        return this.big_blind;
    }

    getCurrentPlayer() {
        return this.current_player;
    }

    nextPlayer() {
        this.current_player++;
    }

}

module.exports = Round;