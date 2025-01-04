import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
// import { Chessboard } from "react-chessboard";


interface SquareData {
  square: Square; 
  type: PieceSymbol;  
  color: Color; 
}

export const ChessBoard = ({ chess, setBoard, board, socket }: {
  chess: Chess;
  setBoard: (board: (SquareData | null)[][]) => void;
  board: (SquareData | null)[][];
  socket: WebSocket
}) => {
  const [from, setFrom] = useState<Square | null>(null);
  const [to, setTo] = useState<Square | null>(null);

  const handleSquareClick = (square: Square | null, i: number, j: number) => {
    const sq = (String.fromCharCode(65 + j)).toLowerCase() + "" + (8 - i) as Square;
    console.log(sq);

    if (!from) {
      if (sq == square) {
        setFrom(square);
      }
    } else {
      setTo(sq)
      // TODO: Change this "move" to our MOVE (export globally)
      // TODO: currently we are assuming that its a valid move
      socket.send(JSON.stringify({
        type: "move",
        payload: {
          from: from,
          to: sq
        }
      }))
      // TODO: Should be in a try/catch, it will throw err for invalid move
      chess.move({
        from: from,
        to: sq
      })
      setBoard(chess.board());
      setFrom(null);
      setTo(null);
    }
  }

  // function onDrop(sourceSquare: Square, targetSquare: Square) {
  //   // Try making the move using chess.js
  //   const move = chess.move({
  //     from: sourceSquare,
  //     to: targetSquare,
  //     promotion: "q", // Always promote to a queen (you can adjust this logic later)
  //   });

  //   if (move === null) {
  //     // If the move is invalid, return false to indicate failure
  //     console.log("Invalid move");
  //     return false;
  //   }

  //   // If the move is valid, update the board locally
  //   setBoard(chess.board());

  //   socket.send(JSON.stringify({
  //     type: "move",
  //     payload: {
  //       from: sourceSquare,
  //       to: targetSquare,
  //     }
  //   }));

  //   return true; // Move was successful
  // }


  return (
    <div className="h-full flex flex-col items-center justify-center select-none">

      {/* <Chessboard position={chess.fen()} onPieceDrop={onDrop} customNotationStyle={{ fontSize: '20px' }} /> */}

      {
        board.map((row, i) => {
          return <div key={i} className="flex">
            {
              row.map((square, j) => {
                return <div key={j}
                  onClick={() => handleSquareClick(square?.square ?? null, i, j)}
                  className={`flex items-center justify-center font-bold text-black 
                  ${square?.square === from ? 'border-2 border-red-600' : ''} 
                  ${square?.square === to ? 'border-4 border-blue-600' : ''} 
                  ${square ? 'cursor-pointer' : ''} w-20 h-20 
                  ${(i + j) % 2 === 0 ? 'bg-coordinateDark' : 'bg-coordinateLight'}`}>

                  {square ? square.type : ""}

                </div>
              })
            }
          </div>
        })
      }
    </div>
  )
}
