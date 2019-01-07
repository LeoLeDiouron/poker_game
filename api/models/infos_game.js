var Deck = require('./deck');
var Hand = require('./hand');
var Round = require('./round');

var algorithmCombination = require('../scripts/algorithm_combi');
var compareCombination = require('../scripts/compare_combination');

const name_of_card = ['2','3','4','5','6','7','8','9','10','jake','queen','king','ace']

class InfosGame {

    constructor(id) {      
        this.id = id;
        this.players = [];
        this.status = 0;
        this.first_player = 0;
    }

    newRound() {
        console.log('InfosGame[' + this.id + '] : new round');
        this.deck = new Deck();
        this.status = 1;
        this.round = new Round(this.deck.giveCards(3), this.first_player);
        this.first_player++;
        if (this.first_player == this.players.length)
            this.first_player = 0;
        this.giveHands();

        this.players.forEach(player => {
            player.setFold(false);
            player.setReady(true);
            player.setAction('waiting...');
        })

        this.players = this.round.setBlind(this.players);
    }

    endRound() {
        console.log('InfosGame[' + this.id + '] : end of the round');
        this.status = 2;
        this.players.forEach(player => {
            player.setAction('not ready');
            player.setReady(false);
        })
    }

    isAvaible() {
        if (this.status == 1) 
            return false;
        else
            return true;
    }

    getStatus() {
        return this.status;
    }

    addPlayer(player) {
        console.log('InfosGame[' + this.id + '] : new player (id : ' + player.getName() + ')');
        if (this.players.length < 6 && this.status != 1) {
            this.players.push(player);
            return true;
        }
        else if (this.players.length >= 6)
            console.log('InfosGame[' + this.id + '] : the maxium of number of players is reached (' + player.getName() + ' is not allowed)');
        else if (this.status == 1)
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

    getWinnerInfos(winner_name) {
        
        if (this.round.getStatusWinner() == false) {
            var best_combination = this.getPlayer(winner_name).getBestCombination();
            var combi = '';
            
            if (best_combination['type'] == 'double_pair' || best_combination['type'] == 'full')
                combi = best_combination['type'] + ' of ' + name_of_card[best_combination['value'][0]-2] + ' / ' + name_of_card[best_combination['value'][1]-2];
            else if (best_combination['type'] == 'flush' || best_combination['type'] == 'straight_flush')
                combi = best_combination['type'] + ' of ' + best_combination['value']['color'];
            else
                combi = best_combination['type'] + ' of ' + name_of_card[best_combination['value']-2];

            while (combi.indexOf('_') != -1)
                combi = combi.replace('_', ' ');

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
                });
                this.round.resetFirstPlayer(this.players);
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

        winners.forEach(winner => {
            winner_names += winner.getName() + ' ';
        })
        winner_names = winner_names.substring(0, winner_names.length - 1);
        console.log('InfosGame[' + this.id + '] : end of the round (5 cards are given) - winner : ' + winner_names);
        this.players.forEach(player => {
            if (player.getName() == winners[0].getName()) {
                this.round.setWinner(player.getName(), false);
                player.addCash(this.round.getPot());
            }
        });
        this.endRound();
    }

    checkPlayersFold() {
        var nb_players_active = 0;

        this.players.forEach(player => {
            if (player.getFold() == false)
                nb_players_active++;
        });
        if (nb_players_active == 1) {
            this.players.forEach(player => {
                if (player.getFold() == false) {
                    console.log('InfosGame[' + this.id + '] : end of the round (only one player active) - winner : ' + player.getName());
                    this.round.setWinner(player.getName(), true);
                    player.addCash(this.round.getPot());
                }
            });
            this.endRound();
            return true;
        }
        return false;
    }

}

module.exports = InfosGame;