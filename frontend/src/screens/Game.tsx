import { useEffect, useState } from 'react'
import { ChessBoard } from '../components/ChessBoard'
import { useSocket } from '../hooks/useSocket'
import { Chess } from 'chess.js'
import { Link } from 'react-router';
import { BoardOrientation } from 'react-chessboard/dist/chessboard/types';


// TODO: move it, code repetition here
export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

const Game = () => {
    const socket = useSocket();
    const [chess] = useState(new Chess());
    // const [board, setBoard] = useState(chess.board());
    const [isStarted, setIsStarted] = useState(false)
    const [isFinding, setFinding] = useState(false)
    const [isOver, setIsOver] = useState("")
    const [boardOrientation, setBoardOrientation] = useState<BoardOrientation>('white')
    const [turn, setTurn] = useState('w');

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
                    // setBoard(chess.board());
                    if (message.payload.color === 'black') {
                        setBoardOrientation('black');
                    }
                    console.log("Game initialized! You are - ", message?.payload?.color);
                    break;
                case MOVE:
                    // eslint-disable-next-line no-case-declarations
                    const move = message.payload;
                    // Updating board current state whenever a move is made, but if I made a move then my opponent event will hit that means only my opponent move will be updated, so if I want to update my board then i will have to update at the same momement when I am making move so pass setBoard in ChessBoard
                    chess.move(move);
                    // setBoard(chess.board());
                    
                    setTurn(chess.turn());
                    console.log("Move made!", message.payload);
                    break;
                case GAME_OVER:
                    setIsStarted(false)
                    setIsOver(`${message?.payload?.winner}`)
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
                {/* MODEL DIALOG */}
                {isOver !== "" && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-backgroundColor rounded-xl shadow-lg w-full sm:max-w-lg">
                            {/* Header */}
                            <div className="flex justify-between items-center border-b px-4 py-3">
                                <h3 className="text-lg font-bold text-gray-800"></h3>
                                <h3 className="text-lg font-bold text-white">{isOver[0].toUpperCase() + isOver.slice(1)} Won</h3>
                                <Link to="/">
                                    <button
                                        type="button"
                                        onClick={() => setIsOver("")}
                                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white text-gray-800 hover:bg-gray-200 focus:outline-none"
                                        aria-label="Close"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-5 h-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path d="M18 6 6 18"></path>
                                            <path d="M6 6 18 18"></path>
                                        </svg>
                                    </button>
                                </Link>
                            </div>

                            {/* Body */}
                            <div className="px-4 py-4">
                                <p className="text-white text-sm text-center">
                                    Congratulations to {isOver}. It was a hard-fought match!
                                </p>
                            </div>

                        </div>
                    </div>
                )}

                <div className='h-full grid grid-cols-1 gap-5 md:grid-cols-6'>
                    <div className='col-span-4'>
                        <ChessBoard chess={chess} socket={socket} boardOrientation={boardOrientation} setTurn={setTurn} />
                    </div>
                    <div className='h-full gap-10 col-span-2 flex flex-col items-center justify-center'>
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
                        {isStarted && (
                            <h1 className='bg-secondary p-2 rounded-md'>
                                {turn === (boardOrientation === 'white' ? 'w' : 'b') ? "Your turn" : "Opponent's turn"}
                            </h1>
                        )}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Game