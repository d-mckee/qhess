const { v4 : uuid } = require("uuid");
const { Board } = require("../lib/qhess.js");
const io = require("socket.io");

class Game {
    constructor(player) {
        this.id = uuid();
        this.ip = player.handshake.address;
        this.turn = player.id;
        this.players = [player.id];
        this.board = new Board();
        io.sockets.socket(player.id).emit('game_created', { gid: this.id });
    }

    addPlayer(player) {
        if (players.length < 2) {
            this.players.push(player.id);
            io.sockets.socket(player.id).emit("game_joined", { gid: this.id });
        }
    }

    movePiece(caller, id, to, e) {
        if (caller == this.turn) {
            let piece = this.board.findPiece(id);
            let x, y = to;
            piece.moveTo(x, y, e);
            this.changeTurn();
        }
    }
    
    changeTurn() {
        if (this.turn == this.players[0]) {
            this.turn = this.players[1];
        } else {
            this.turn = this.players[0];
        }
        io.sockets.socket(this.turn).emit("turn_ready");
    }

    updateBoard() {
        this.players.forEach(p => io.sockets.socket(p).emit("board_update", this.board.board));
    }
}

module.exports = { Game };