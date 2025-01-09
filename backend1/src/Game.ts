import { WebSocket } from "ws";
import { Chess } from 'chess.js'
import { GAME_OVER, INIT_GAME, MOVE } from "./message";

export class Game {
    public player1: WebSocket;
    public player2: WebSocket;
    private board: Chess;
    private startTime: Date;

    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "white"
            }
        }))
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "black"
            }
        }))
    }
    makeMove(socket: WebSocket, move: {
        to: string,
        from: string
    }) {
        console.log(move);
        // user should not be able to make move until its their turn
        if (this.board.turn() === 'w' && socket !== this.player1) {
            return;
        }
        if (this.board.turn() === 'b' && socket !== this.player2) {
            return;
        }

        // if move not valid it will throw error
        try {
            this.board.move(move);
        } catch (e) {
            console.log("err: ", e);
            return;
        }
        // LEARN: in websocket - send is used to send an event to a specific client.
        if (this.board.isGameOver()) {
            console.log("OVER");
            
            if (this.board.isDraw()) {
                this.player1.send(JSON.stringify({
                    type: GAME_OVER,
                    payload: {
                        winner: 'draw'
                    }
                }))
                this.player2.send(JSON.stringify({
                    type: GAME_OVER,
                    payload: {
                        winner: 'draw'
                    }
                }))
                return;
            }
            // console.log(this.board.turn() === 'w' ? 'black' : 'white');

            this.player1.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === 'w' ? 'black' : 'white'
                }
            }))
            this.player2.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === 'w' ? 'black' : 'white'
                }
            }))
            return;
        }

        // if game not over, inform otherside about the move
        // if board is odd after making a move that means move is made by player 1 so inform about this to player2
        // Notify the opponent of the move
        const opponent = socket === this.player1 ? this.player2 : this.player1;
        opponent.send(JSON.stringify({
            type: MOVE,
            payload: move
        }));

    }
}