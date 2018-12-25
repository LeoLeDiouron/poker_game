var Deck = require('./deck');
var Hand = require('./hand');
var Round = require('./round');

var algorithmCombination = require('../scripts/algorithm_combination');
var compareCombination = require('../scripts/compare_combination');

const name_of_card = ['2','3','4','5','6','7','8','9','10','jake','queen','king','ace']

class InfosGame {

    constructor(id) {
        
        this.id = id;
        this.players = [];
        this.status = 0;
        this.is_started = false;

        //this.deck = new Deck();
        //this.status = 0;
        //this.roundOver = false;
        //this.round = new Round(this.deck.giveCards(3));
    }

    newRound() {
        console.log('InfosGame[' + this.id + '] : new round');
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
        console.log('InfosGame[' + this.id + '] : new player (id : ' + player.getName() + ')');
        if (this.players.length < 6 && this.is_started == false) {
            this.players.push(player);
            return true;
        }
        else if (this.players.length >= 6)
            console.log('InfosGame[' + this.id + '] : the maxium of number of players is reached (' + player.getName() + ' is not allowed)');
        else if (this.is_started == true)
            console.log('InfosGame[' + this.id + '] : the game is already started (' + player.getName() + ' is not allowed)');
        return false;
    }

    getPlayers() {
        return this.players;
    }

    getPlayer(id) {
        var player = null;
        this.players.forEach(_player => {
            if (_player.getName() == id)
                player = _player;
        });
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
        } else {
            ready = false;
        }
        if (ready == true)
            this.newRound();
    }

    checkEndRound() {
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
        console.log('InfosGame[' + this.id + '] : end of the round (5 cards are given) - winner : ' + winner_names);
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
                    console.log('InfosGame[' + this.id + '] : end of the round (only one player active) - winner : ' + player.getName());
                    this.round.setWinner(player.getName(), true);
                    player.addCash(this.round.getPot());
                    this.status = 2;
                }
                player.setReady(false);
            })
            return true;
        }
        return false;
    }

}

module.exports = InfosGame;