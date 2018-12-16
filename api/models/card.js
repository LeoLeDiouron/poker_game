class Card {

    constructor(color, value) {
        this.color = color;
        this.value = value;
    }

    getColor() {
        return this.color;
    }

    getValue() {
        return this.value;
    }
}

module.exports = Card;