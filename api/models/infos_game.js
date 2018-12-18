var Deck = require('./deck');
var Hand = require('./hand');
var Round = require('./round');

var algorithmCombination = require('../controllers/algorithm_combination');

class InfosGame {

    constructor() {
        this.deck = new Deck();
        this.players = [];
        this.status = 0;
        this.roundOver = false;
        this.winner = "";
        this.round = new Round(this.deck.giveCards(3));
    }

    newRound() {
        this.winner = "";
        this.deck = new Deck();
        this.roundOver = false;
        this.round = new Round(this.deck.giveCards(3));

        this.players.forEach(player => {
            player.setFold(false);
        })
    }

    getStatus() {
        return this.status;
    }

    increaseStatus() {
        this.status++;
    }

    addPlayer(player) {
        if (this.players.length < 6)
            this.players.push(player);
    }

    getPlayers() {
        return this.players;
    }

    getWinner() {
        return this.winner;
    }

    getPlayer(id) {
        var player = null;
        this.players.forEach(_player => {
            if (_player.getName() == id)
                player = _player;
        })
        return player;
    }

    getRound() {
        return this.round;
    }

    giveHands() {
        for (var i = 0; i < this.players.length; i++) {
            this.players[i].setHand(new Hand(this.deck.giveCards(2)));
        }
    }

    isRoundOver() {
        return this.roundOver;
    }

    checkEndRound() {
        console.log('check End Round');

        this.players.forEach(player => {
            console.log('player : ' + player.getName());
            algorithmCombination(this.round.getBoard().getCards(), player.getHand().getCards());
        })

        if (this.checkPlayersFold() == true)
            return;
        if (this.players[this.round.getCurrentPlayer()].getBet() == this.round.getBet() && this.round.isCompletedStep() == true) {
            if (this.round.isOver() == false)
                this.round.nextStep(this.players, this.deck.giveCards(1));
            else {
                this.roundOver = true;
                console.log('End of the round : 5 cards');
            }
            this.players.forEach(player => {
                player.setBet(0);
            });
        }
        
    }

    checkPlayersFold() {
        var nb_players_active = 0;

        this.players.forEach(player => {
            if (player.getFold() == false)
                nb_players_active++;
        });
        if (nb_players_active == 1) {
            this.roundOver = true;
            this.players.forEach(player => {
                if (player.getFold() == false) {
                    console.log('Winner is ' + player.getName())
                    this.winner = player.getName();
                    player.addCash(this.round.getPot());
                    this.newRound();
                    this.giveHands();
                    return;
                }
            })
            console.log('End of the round : only one player active');
            return true;
        }
        return false;
    }

}

module.exports = InfosGame;