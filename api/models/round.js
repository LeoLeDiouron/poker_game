var Board = require('./board');

const BLIND = 2;

class Round {

    constructor(cards) {
        this.id = Math.floor(Math.random() * 1000);
        this.board = new Board(cards);
        this.pot = 0;
        this.is_over = false;
        this.completed_step = false;
        this.little_blind = BLIND / 2;
        this.big_blind = BLIND;
        this.current_player = 0;
        this.winner = '';
        this.winner_last_player = false;
        this.bet = 0;
    }

    getId() {
        return this.id;
    }

    setWinner(winner, last_player) {
        this.winner = winner;
        this.winner_last_player = last_player;
    }

    getStatusWinner() {
        return this.winner_last_player;
    }
    
    getWinner() {
        return this.winner;
    }

    isCompletedStep() {
        return this.completed_step;
    }

    isOver() {
        return this.is_over;
    }

    setBet(bet) {
        this.bet = bet;
    }

    getBet() {
        return this.bet;
    }

    increaseBet(bet) {
        this.bet += bet;
    }

    getBoard() {
        return this.board;
    }

    getBlind() {
        return this.big_blind;
    }

    setPot(pot) {
        this.pot = pot;
    }

    increasePot(bet) {
        this.pot += bet;
    }

    getPot() {
        return this.pot;
    }

    getCurrentPlayer() {
        return this.current_player;
    }

    nextPlayer(players) {
        if (players.length - 1 > this.current_player) {
            this.current_player++;
        } else {
            this.completed_step = true;
            this.current_player = 0;
        }
        if (players[this.current_player].getFold() == true)
            this.nextPlayer(players);
    }

    nextStep(players, card) {
        this.current_player = 0;
        this.completed_step = false;
        while(players[this.current_player].getFold() == true)
            this.current_player++;
        players.forEach(player => {
            if (player.getFold() == false)
                player.setAction('waiting...');
        })
        this.board.addCard(card);
        this.bet = 0;
        if (this.board.getCards().length == 5) {
            this.is_over = true;
        }
    }


}

module.exports = Round;