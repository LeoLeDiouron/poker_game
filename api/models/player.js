class Player {

    constructor(name) {
        this.name = name;
        this.hand = null;
        this.cash = 100;
        this.is_ready = false;
    }

    setHand(hand) {
        this.hand = hand;
    }

    setCash(cash) {
        this.cash = cash;
    }

    isReady() {
        return this.is_ready;
    }

    setReady() {
        this.is_ready = true;
    }

    addCash(cash_to_add) {
        this.cash += cash_to_add;
    }

    takeCash(cash_to_take) {
        if (this.cash >= cash_to_take) {
            this.cash -= cash_to_take;
            return true;
        } else {
            return false;
        }
    }

    getName() {
        return this.name;
    }

    getHand() {
        return this.hand;
    }

    getCash() {
        return this.cash;
    }

}

module.exports = Player;