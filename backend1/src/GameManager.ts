import { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./message";
import { Game } from "./Game";


export class GameManager {
    private games: Game[];
    private static instance: GameManager;
    private pendingUser: WebSocket | null;
    private users: WebSocket[];

    private constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }

    static getInstance(): GameManager {
        if (!this.instance) {
            this.instance = new GameManager();
            return this.instance;
        }
        return this.instance
    }

    addUser(socket: WebSocket) {
        this.users.push(socket);
        this.addHandler(socket);
    }
    removeUser(socket: WebSocket) {
        this.users = this.users.filter(user => user !== socket);
    }

    private addHandler(socket: WebSocket) {
        socket.on('message', (data) => {
            const message = JSON.parse(data.toString());
            if (message.type === INIT_GAME) {
                if (this.pendingUser) {
                    // start a game - It is an instance of our Game class, that means every single game is a different instance 
                    const game = new Game(this.pendingUser, socket);
                    this.games.push(game);
                    this.pendingUser = null;
                    console.log("Game started!");
                } else {
                    console.log("Pending User added");
                    this.pendingUser = socket;
                }
            }

            if(message.type === MOVE) {
                // find that particular game and call its makemove to updates that game's state
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if(game) {
                    game.makeMove(socket, message.payload);
                }
            }
        })
    }

}