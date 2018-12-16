var Deck = require('./deck');
var Hand = require('./hand');
var Round = require('./round');

class InfosGame {

    constructor() {
        this.deck = new Deck();
        this.players = [];
        this.status = 0;

        this.round = new Round(this.deck.giveCards(3));
        //this.deck.showDeck();
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

}

module.exports = InfosGame;