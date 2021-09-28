import React from "react";
import ReactDOM from "react-dom";
import './index.css';

const SIZE = 3;

function Square({ value, onClick, highlighted }) {
  return (
    <button className={highlighted ? "winner-square" : "square"} onClick={onClick}>
      {value}
    </button>
  );
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: SIZE,
    }
  }

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
    const size = this.state.size;

    if (highlight) {
      for (let i = 0; i < size; i++) {
        let row = [];

        for (let j = i * size; j < i * size + size; j++) {
          row.push(this.renderSquare(j, highlight.indexOf(j) !== -1));
        }

        board.push(<div key={`row-${i}`} className="board-row">{row}</div>);
      }
    } else {
      for (let i = 0; i < size; i++) {
        let row = [];

        for (let j = i * size; j < i * size + size; j++) {
          row.push(this.renderSquare(j));
        }

        board.push(<div key={`row-${i}`} className="board-row">{row}</div>);
      }
    }

    return board;
  }
}

function calculateWinner(squares, size, pos) {
  const winPoint = size >= 5 ? 4 : size - 1;
  let point = 0;
  let col = pos % size;
  let row = Math.floor(pos / size);
  let x, y, checkPos;
  let line = [];

  // Kiểm tra chiến thắng theo cột
  // Các điểm phía dưới điểm vừa đánh 
  x = row + 1;
  y = col;
  checkPos = x * size + y;

  while (x < size && squares[checkPos] === squares[pos]) {
    point += 1;
    x += 1;
    line.push(checkPos);
    checkPos = x * size + y;
  }

  // Các điểm phía trên điểm vừa đánh
  x = row - 1;
  checkPos = x * size + y;

  while (x >= 0 && squares[checkPos] === squares[pos]) {
    point += 1;
    x -= 1;
    line.push(checkPos);
    checkPos = x * size + y;
  }

  if (point >= winPoint) {
    line.push(pos);
    return {
      player: squares[pos],
      line: line,
    };
  } 

  // Kiểm tra chiến thắng theo hàng
  // Các điểm bên trái điểm vừa đánh
  point = 0
  x = row;
  y = col + 1;
  line = [];
  checkPos = x * size + y;

  while (y < size && squares[checkPos] === squares[pos]) {
    point += 1;
    y += 1;
    line.push(checkPos);
    checkPos = x * size + y;
  }

  // Các điểm bên phải điểm vừa đánh
  y = col - 1;
  checkPos = x * size + y;

  while (y >= 0 && squares[checkPos] === squares[pos]) {
    point += 1;
    y -= 1;
    line.push(checkPos);
    checkPos = x * size + y;
  }

  if (point >= winPoint) {
    line.push(pos);
    return {
      player: squares[pos],
      line: line,
    };    
  } 

  // Kiểm tra chiến thắng theo đường chéo phải
  // Các điểm phía dưới điểm vừa đánh
  point = 0
  x = row + 1;
  y = col + 1;
  checkPos = x * size + y;
  line = [];

  while (x < size && y < size && squares[checkPos] === squares[pos]) {
    point += 1;
    x += 1;
    y += 1;
    line.push(checkPos);
    checkPos = x * size + y;
  }

  // Các điểm phía trên điểm vừa đánh
  x = row - 1;
  y = col - 1;
  checkPos = x * size + y;

  while (x >= 0 && y >= 0  && squares[checkPos] === squares[pos]) {
    point += 1;
    x -= 1;
    y -= 1;
    line.push(checkPos);
    checkPos = x * size + y;
  }

  if (point >= winPoint) {
    line.push(pos);
    return {
      player: squares[pos],
      line: line,
    };
  } 

  // Kiểm tra chiến thắng theo đường chéo trái
  // Các điểm phía dưới điểm vừa đánh
  point = 0
  x = row + 1;
  y = col - 1;
  checkPos = x * size + y;
  line = [];

  while (x < size && y >= 0 && squares[checkPos] === squares[pos]) {
    point += 1;
    x += 1;
    y -= 1;
    line.push(checkPos);
    checkPos = x * size + y;
  }

  // Các điểm phía trên điểm vừa đánh
  x = row - 1;
  y = col + 1;
  checkPos = x * size + y;

  while (x >= 0 && y < size && squares[checkPos] === squares[pos]) {
    point += 1;
    x -= 1;
    y += 1;
    line.push(checkPos);
    checkPos = x * size + y;
  }

  if (point >= winPoint) {
    line.push(pos);
    return {
      player: squares[pos],
      line: line,
    };
  } 

  return null;
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: SIZE,
      history: [{
        squares: Array(SIZE * SIZE).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
      selectedItem: -1,
      position: [],
      isAscending: true,
      winner: null,
      line: [],
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (this.state.winner || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    let player = null;
    let line = [];
    let result = calculateWinner(squares, this.state.size, i);

    if (result) {
      player = result.player;
      line = [...result.line];
    }

    let position = this.state.position.slice(0, this.state.stepNumber);
    position.push(i);

    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
      position: position,
      selectedItem: -1,
      winner: player,
      line: [...line],
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      selectedItem: step,
      winner: null,
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

    let moves = history.map((step, move) => {
      const col = this.state.position[move - 1] % this.state.size + 1;
      const row = Math.floor(this.state.position[move - 1] / this.state.size) + 1;
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

    if (this.state.winner) {
      status = 'Winner: ' + this.state.winner;
    } else if (this.state.stepNumber === this.state.size * this.state.size) {
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
            highlight={this.state.winner ? this.state.line : null}
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
