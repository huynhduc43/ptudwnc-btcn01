import React from "react";
import ReactDOM from "react-dom";
import './index.css';

function Square({ value, onClick, highlighted }) {
  return (
    <button className={highlighted ? "winner-square" : "square"} onClick={onClick}>
      {value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, highlighted) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        highlighted={highlighted}
      />
    );
  }

  render() {
    let board = [];
    const highlight = this.props.highlight;

    if (highlight) {
      for (let i = 0; i < 3; i++) {
        let row = [];
  
        for (let j = i * 3; j < i * 3 + 3; j++) {
            row.push(this.renderSquare(j, highlight.indexOf(j) !== -1));
        }
  
        board.push(<div key={`row-${i}`} className="board-row">{row}</div>);
      }
    } else {
      for (let i = 0; i < 3; i++) {
        let row = [];
  
        for (let j = i * 3; j < i * 3 + 3; j++) {
          row.push(this.renderSquare(j));
        }
  
        board.push(<div key={`row-${i}`} className="board-row">{row}</div>);
      }
    }
    
    return board;
  }
}

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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        player: squares[a],
        line: lines[i],
      };
    }
  }

  return null;
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
      selectedItem: -1,
      position: [0],
      isAscending: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    let position = this.state.position;

    if (this.state.position.slice.length <= history.length) {
      position = this.state.position.slice(0, this.state.stepNumber);
      position.push(i);
    }

    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
      position: position,
      selectedItem: -1,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      selectedItem: step,
    });
  }

  sortListMove() {
    this.setState({
      isAscending: !this.state.isAscending,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let moves = history.map((step, move) => {
      const col = this.state.position[move - 1] % 3 + 1;
      const row = Math.floor(this.state.position[move - 1] / 3) + 1;
      const desc = move ?
        'Go to move #' + move + ": (" + col + ", " + row + ")" :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            {move === this.state.selectedItem ? <b>{desc}</b> : desc}
          </button>
        </li>
      );
    });

    if (!this.state.isAscending) moves = moves.reverse();

    let status;
    
    if (winner) {
      status = 'Winner: ' + winner.player;
    } else if (this.state.stepNumber === 9) {
      status = 'Draw';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            highlight={winner ? winner.line : null}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>Sort: <button style={{ margin: 10 }}
            onClick={() => this.sortListMove()}
          >
            {this.state.isAscending ? "Ascending" : "Descending"}
          </button>
          </div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
