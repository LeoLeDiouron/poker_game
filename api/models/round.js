var Board = require('./board');

const BLIND = 2;

class Round {

    constructor(cards, first_player) {
        this.id = Math.floor(Math.random() * 1000);
        this.board = new Board(cards);
        this.pot = 0;
        this.is_over = false;
        this.completed_step = false;
        this.little_blind = BLIND / 2;
        this.big_blind = BLIND;
        this.first_player = first_player;
        this.current_player = first_player;
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

    resetFirstPlayer(players) {
        this.current_player = this.first_player;
        if (players[this.current_player].getFold() == true)
            this.nextPlayer(players);
    }

    setBlind(players) {
        if (players.length == 2) {
            var idx_player_blind = (this.current_player == 0) ? 1 : 0;
            players[idx_player_blind].increaseBet(this.big_blind);
            this.bet = this.big_blind;
            this.pot = this.big_blind;
        } else {
            var idx_player_big_blind = (this.current_player == 0) ? players.length - 1 : this.current_player - 1;
            var idx_player_little_blind = (idx_player_big_blind == 0) ? players.length - 1 : idx_player_big_blind - 1;
            players[idx_player_big_blind].increaseBet(this.big_blind);
            players[idx_player_little_blind].increaseBet(this.little_blind);
            this.bet = this.big_blind;
            this.pot = this.little_blind + this.big_blind;
        }
        return players;
    }

    nextPlayer(players) {
        this.current_player++;
        if (this.current_player == players.length)
            this.current_player = 0;
        if (this.current_player == this.first_player)
            this.completed_step = true;
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