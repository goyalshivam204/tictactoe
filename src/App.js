
import { useState, useEffect } from "react"

import './App.css';





function App() {

  const w = 3, h = 3;
  const [board, setBoard] = useState(
    [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""]
    ]
  )

  const [winner, setWinner] = useState(false);

  const [render, setRender] = useState(false);
  const [lock, setLock] = useState(false);


  const isEqual = (a, b, c, turn) => {

    // if (a == "" || b == "" || c == "") {
    //   return null;
    // }
    if (turn == a && turn == b && turn == c) {
      return true;
    } else {
      return false;
    }
  }
  const checkWinner = () => {


    let row = 3, col = 3;
    for (let i = 0; i < row; i++) {
      if (isEqual(board[i][0], board[i][1], board[i][2], "X")) {
        return "human";
      } else if (isEqual(board[i][0], board[i][1], board[i][2], "O")) {
        return "cpu";
      }
    }
    for (let j = 0; j < col; j++) {
      if (isEqual(board[0][j], board[1][j], board[2][j], "X")) {
        return "human";
      } else if (isEqual(board[0][j], board[1][j], board[2][j], "O")) {
        return "cpu";
      }
    }

    //main diagonal
    if (isEqual(board[0][0], board[1][1], board[2][2], "X")) {
      return "human";
    } else if (isEqual(board[0][0], board[1][1], board[2][2], "O")) {
      return "cpu";
    }

    // secondary diagonal
    if (isEqual(board[0][2], board[1][1], board[2][0], "X")) {
      return "human";
    } else if (isEqual(board[0][2], board[1][1], board[2][0], "O")) {
      return "cpu";
    }


    for (let i = 0; i < w; i++) {
      for (let j = 0; j < h; j++) {
        if (board[i][j] == "") {
          return "none";
        }
      }
    }

    return "draw";
  }




  const scoreBoard = {
    human: 10,
    draw: 0,
    cpu: -10
  }

  const minimax = (isCpuTurn, depth) => {
    let result = checkWinner();

    if (result != "none") {
      return scoreBoard[result];

    }


    if (isCpuTurn) {
      let bestScore = Infinity;
      for (let i = 0; i < w; i++) {
        for (let j = 0; j < h; j++) {
          if (board[i][j] == "") {
            board[i][j] = "O";
            let score = minimax(!isCpuTurn, depth + 1)
            board[i][j] = "";
            bestScore = Math.min(score, bestScore);
          }
        }
      }
      return bestScore;
    } else {
      let bestScore = -Infinity;
      for (let i = 0; i < w; i++) {
        for (let j = 0; j < h; j++) {
          if (board[i][j] == "") {
            board[i][j] = "X";
            let score = minimax(!isCpuTurn, depth + 1)
            board[i][j] = "";
            bestScore = Math.max(score, bestScore);
          }
        }
      }
      return bestScore;
    }
  }

  const bestMove = () => {
    let bestScore = Infinity;
    let move = {};
    for (let i = 0; i < w; i++) {
      for (let j = 0; j < h; j++) {
        if (board[i][j] == "") {
          board[i][j] = "O";
          let score = minimax(false, 0);
          board[i][j] = "";
          if (bestScore > score) {
            bestScore = score;
            move = { i, j };
          }
          console.log(score, bestScore);
        }
      }
    }


    if (move.hasOwnProperty("i") && move.hasOwnProperty("i")) {
      board[move.i][move.j] = 'O';

    }
  }




  const onClickHandler = (e) => {



    if (lock) {
      return;
    }
    let row = e.target.dataset.row;
    let col = e.target.dataset.col;
    if (board[row][col] != "") {
      alert("invalid move");
      return;
    }


    setBoard((oldBoard) => {
      const tempBoard = oldBoard;
      tempBoard[row][col] = "X";
      return tempBoard;
    });

    setRender((old) => {
      return !old;
    })

    setTimeout(() => {
      bestMove();
      setTimeout(() => {
        setRender((old) => {
          return !old;
        })

        let result = checkWinner();
        if (result != "none") {
          setLock(true);
          setWinner(result);
        }
      }, 100)

    }, 10);



  }

  const greeting = (winner) => {
    if (winner == "draw") {
      return "Game is Tie, Well Tried."
    } else if (winner == "cpu") {
      return "Alas!, you lost the game."
    } else if (winner = "human") {
      return "Hurrah!, you won the game."
    }
  }

  const pageRefreshHandler = () => {
    window.location.reload();
  }
  return (
    <div className="App">
      <h1>Tic Tac Toe</h1>
      <table>

        {
          board.map((row, i) => {
            return (
              <tr key={i}>{
                row.map((cell, j) => {
                  return (
                    <td data-row={i} data-col={j}
                      onClick={(e) => { onClickHandler(e) }}
                      key={j}>{board[i][j]}</td>
                  )
                })
              }
              </tr>
            )


          })
        }

      </table>
      {lock && <h1>{greeting(winner)}</h1 >}
      {lock && <button onClick={(e) => {
        pageRefreshHandler()
      }}>Try Again</button>}
    </div >
  );
}

export default App;
