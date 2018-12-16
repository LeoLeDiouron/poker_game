var Card = require('./card');

class Deck {

    constructor() {
        this.cards = [];
        
        const colors = ['heart', 'diamond', 'club', 'spade'];

        colors.forEach(color => {
            for(var i = 2; i < 15; i++) {
                this.cards.push(new Card(color, i));
            }
        })
        this.shuffle();
    }

    shuffle() {
        for(var i=0; i<1000; i++) {
            var new_place = Math.floor(Math.random() * this.cards.length);
            this.cards.splice(new_place, 0, this.cards.pop());
        }
    }

    showDeck() {
        this.cards.forEach(card => {
            console.log('color : ' + card.getColor() + ' - value : ' + card.getValue());
        })
    }

    giveCards(nb_cards) {
        var cards = [];
        while (nb_cards > 0) {
            if (this.cards.length > 0)
                cards.push(this.cards.pop());
            else
                return [];
            nb_cards--;
        }
        return cards;
    }

    addHandToDeck(hand) {
        hand.getCards().forEach(card => {
            var new_place = Math.floor(Math.random() * this.cards.length);
            this.cards.splice(new_place, 0, card);
        })
    }

}

module.exports = Deck;