function find_avaible_room(infos_games) {
    for (room_id in infos_games) {
        if (infos_games[room_id].isAvaible() == true) {
            return room_id;
        }
    }
    return null;
}

module.exports = find_avaible_room;