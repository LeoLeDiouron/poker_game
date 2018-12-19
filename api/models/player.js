class Player {

    constructor(name) {
        this.name = name;
        this.hand = null;
        this.cash = 100;
        this.bet = 0;
        this.fold = false;
        this.action = ''
        this.is_ready = false;
        this.best_combination = {'type':'', 'value':0}

        this.setAction('waiting...');
    }

    setBet(bet) {
        this.bet = bet;
    }

    getBet() {
        return this.bet;
    }

    setFold(status) {
        this.fold = status;
    }

    getFold() {
        return this.fold;
    }

    setBestCombination(best_combination) {
        this.best_combination = best_combination;
    }

    getBestCombination() {
        return this.best_combination;
    }

    increaseBet(bet) {
        if (this.cash - bet >= 0) {
            this.bet += bet;
            this.cash -= bet;
            return true;
        } else {
            return false;
        }
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

    setAction(action) {
        this.action = ' : ' + action;
    }

    getAction() {
        return this.action;
    }

}

module.exports = Player;