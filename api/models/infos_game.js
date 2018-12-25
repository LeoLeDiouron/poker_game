var Deck = require('./deck');
var Hand = require('./hand');
var Round = require('./round');

var algorithmCombination = require('../scripts/algorithm_combination');
var compareCombination = require('../scripts/compare_combination');

const name_of_card = ['2','3','4','5','6','7','8','9','10','jake','queen','king','ace']

class InfosGame {

    constructor() {
        
        this.players = [];
        this.status = 0;
        this.is_started = false;

        //this.deck = new Deck();
        //this.status = 0;
        //this.roundOver = false;
        //this.round = new Round(this.deck.giveCards(3));
    }

    newRound() {
        console.log('new round !');
        this.deck = new Deck();
        this.status = 1;
        this.is_started = true;
        this.roundOver = false;
        this.round = new Round(this.deck.giveCards(3));
        this.giveHands();

        this.players.forEach(player => {
            player.setFold(false);
            player.setReady(true);
            player.setAction('waiting...');
        })
    }

    getStatus() {
        return this.status;
    }

    setStatus(status) {
        this.status = status;
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
        this.players.forEach(player => {
            player.setFold(false);
            player.setBestCombination(algorithmCombination(this.round.getBoard().getCards(), player.getHand().getCards()));
        })
    }

    isRoundOver() {
        return this.roundOver;
    }

    getWinnerInfos(winner_name) {
        
        if (this.round.getStatusWinner() == false) {
            var combi = '';
            var best_combination = this.getPlayer(winner_name).getBestCombination();

            if (best_combination['type'] != 'double_pair')
                combi = best_combination['type'].replace('_',' ') + ' of ' + name_of_card[best_combination['value']-2];
            else
                combi = best_combination['type'].replace('_',' ') + ' of ' + name_of_card[best_combination['value']['first_pair']-2] + ' / ' + name_of_card[best_combination['value']['second_pair']-2];

            return {
                'cards': this.getPlayer(winner_name).getHand().getCards(),
                'combination': combi
            };
        } else {
            return {};
        }
    }

    checkPlayersReady() {
        var ready = true;
        if (this.players.length > 1) {
            this.players.forEach(player => {
                if (player.isReady() == false)
                    ready = false;
            });
        }
        if (ready == true)
            this.newRound();
    }

    checkEndRound() {
        console.log('check End Round');
        if (this.checkPlayersFold() == true)
            return;
        if (this.players[this.round.getCurrentPlayer()].getBet() == this.round.getBet() && this.round.isCompletedStep() == true) {
            if (this.round.isOver() == false) {
                this.round.nextStep(this.players, this.deck.giveCards(1));
                this.players.forEach(player => {
                    player.setBestCombination(algorithmCombination(this.round.getBoard().getCards(), player.getHand().getCards()));
                })
            }
            else {
                this.comparisonEndRound();
            }
            this.players.forEach(player => {
                player.setBet(0);
            });
        } 
    }

    comparisonEndRound() {
        var winners = compareCombination(this.players);
        var winner_names = '';
        this.roundOver = true;

        winners.forEach(winner => {
            winner_names += winner.getName() + ' ';
        })
        winner_names = winner_names.substring(0, winner_names.length - 1);
        console.log('End of the round : 5 cards');
        console.log('Winner is ' + winner_names);
        this.players.forEach(player => {
            if (player.getName() == winners[0].getName()) {
                this.round.setWinner(player.getName(), false);
                player.addCash(this.round.getPot());
                this.status = 2;
            }
            player.setReady(false);
        });
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
                    this.round.setWinner(player.getName(), true);
                    player.addCash(this.round.getPot());
                    this.status = 2;
                }
                player.setReady(false);
            })
            console.log('End of the round : only one player active');
            return true;
        }
        return false;
    }

}

module.exports = InfosGame;