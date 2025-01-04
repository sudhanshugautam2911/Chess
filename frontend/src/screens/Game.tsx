import { useEffect, useState } from 'react'
import { ChessBoard } from '../components/ChessBoard'
import { useSocket } from '../hooks/useSocket'
import { Chess } from 'chess.js'


// TODO: move it, code repetition here
export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

const Game = () => {
    const socket = useSocket();
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());
    const [isStarted, setIsStarted] = useState(false)
    const [isFinding, setFinding] = useState(false)
    useEffect(() => {
        if (!socket) {
            return;
        }
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            switch (message.type) {
                case INIT_GAME:
                    setIsStarted(true);
                    setFinding(false);
                    setBoard(chess.board());
                    console.log("Game initialized! You are - ", message?.payload?.color);
                    break;
                case MOVE:
                    // eslint-disable-next-line no-case-declarations
                    const move = message.payload;
                    // Updating board current state whenever a move is made, but if I made a move then my opponent event will hit that means only my opponent move will be updated, so if I want to update my board then i will have to update at the same momement when I am making move so pass setBoard in ChessBoard
                    chess.move(move);
                    setBoard(chess.board());
                    console.log("Move made!", message.payload);
                    break;
                case GAME_OVER:
                    console.log("Game is over");
                    break;
            }
        }
        return () => {
            if (socket) {
                socket.onmessage = null;
            }
        };
    }, [socket])

    if (!socket) return <div>Connecting...</div>
    return (
        <div className='h-screen w-full justify-center flex bg-backgroundColor text-white'>
            <div className='max-w-screen-lg'>
                <div className='h-full grid grid-cols-1 gap-5 md:grid-cols-6'>
                    <div className='col-span-4'>
                        <ChessBoard chess={chess} setBoard={setBoard} board={board} socket={socket} />
                    </div>
                    <div className='h-full col-span-2 flex items-center justify-center'>
                        {
                            isFinding ? (
                                <div className='text-xl text-primary font-bold'>Finding game...</div>
                            ) : isStarted ? (
                                <div className='text-xl text-primary font-bold'>Game started</div>
                            ) : (
                                <button onClick={() => {
                                    socket?.send(JSON.stringify({
                                        type: INIT_GAME
                                    }))
                                    setFinding(true);
                                }} className='px-14 py-3 rounded-md text-lg font-bold bg-primary text-white border-b-4 border-secondary'>Play!</button>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Game