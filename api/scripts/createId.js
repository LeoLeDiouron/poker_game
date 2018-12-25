const alphabet = 'abcdefghijklmnopqrstuvwxyz';

class CreateId {
    constructor() {

    }

    create_word(nb_letters) {
        var word = '';
        for(var i=0; i < nb_letters; i++)
            word += alphabet.charAt(Math.floor(Math.random() * 26));
        return word;
    }

    create_player_id() {
        return this.create_word(3);
    }

    create_room_id() {
        return this.create_word(1);
    }
}

var createId = new CreateId();

module.exports = createId;