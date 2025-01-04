
import { WebSocketServer } from 'ws';
import { GameManager } from './GameManager'

const wss = new WebSocketServer({ port: 8080 });


wss.on('connection', function connection(ws) {
    ws.on('error', console.error);

    GameManager.getInstance().addUser(ws);
    ws.on('disconnect', ()=> {
        GameManager.getInstance().removeUser(ws);
    });

});