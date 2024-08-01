import { useState } from "react";

function Square({ squareIndex, winner, value, onClickSquare }) {
  return (
    <button
      className={
        winner && winner.winningBlock.includes(Number(squareIndex))
          ? "square yellow"
          : "square"
      }
      onClick={onClickSquare}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return { name: squares[a], winningBlock: lines[i] };
      }
    }
    return null;
  }

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  function checkGameOver() {
    return squares.every((val) => val);
  }

  const winner = calculateWinner(squares);
  const isGameOver = checkGameOver();

  let status;
  if (winner) {
    status = "Winner is " + winner.name;
  } else {
    if (isGameOver) {
      status = "Game ended in a draw";
    } else {
      status = "Next player is " + (xIsNext ? "X" : "O");
    }
  }

  function renderSquares() {
    const row = 3;
    const col = 3;
    const board = [];

    for (let rowIndex = 0; rowIndex < row; rowIndex++) {
      const rowSquares = [];
      for (let colIndex = 0; colIndex < col; colIndex++) {
        const key = rowIndex * row + colIndex;
        rowSquares.push(
          <Square
            key={key}
            squareIndex={key}
            value={squares[key]}
            winner={winner}
            onClickSquare={() => handleClick(key)}
          />,
        );
      }
      board.push(
        <div className="board-row" key={rowIndex}>
          {rowSquares}
        </div>,
      );
    }
    return board;
  }

  return (
    <>
      <div className="status">{status}</div>
      {renderSquares()}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, index) => {
    let message;

    if (index > 0) {
      message = `Go to move # ${index}`;
    } else {
      message = "Go to game start";
    }

    return (
      <li key={index}>
        {currentMove === index ? (
          "현재 move # " + index + "에 있습니다"
        ) : (
          <button onClick={() => jumpTo(index)}>{message}</button>
        )}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
