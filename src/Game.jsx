import React from "react";
import Board from "./components/board";
import "./style.css";

const DEFAULT_NUM_OF_CELLS = 9;

export default class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            boardInfo: {
                numOfCells: DEFAULT_NUM_OF_CELLS,
                winRule: 3,
                numOfRows: Math.sqrt(DEFAULT_NUM_OF_CELLS),
            },
            moves: [Array(DEFAULT_NUM_OF_CELLS).fill(null)],
            currentMove: 0,
            currentPlayer: "x",
            winner: null,
            line: [],
        };
    }

    checkHorizontalLine(cell, moves) {
        const currentRow = Math.floor(cell / this.state.boardInfo.numOfRows);

        const validMoves = moves.filter((item) => {
            return (
                item >= currentRow &&
                item < currentRow + this.state.boardInfo.numOfRows
            );
        });

        let result = [cell];

        for (let i = 1; i < this.state.boardInfo.winRule; i += 1) {
            const currentCell = cell + i;
            if (!validMoves.some((move) => move === currentCell)) {
                result = [cell];
                break;
            }
            result.push(currentCell);
        }

        if (result.length === this.state.boardInfo.winRule) return result;

        for (let i = 1; i < this.state.boardInfo.winRule; i += 1) {
            const currentCell = cell - i;
            if (!validMoves.some((move) => move === currentCell)) {
                result = [cell];
                break;
            }
            result.push(currentCell);
        }

        return result.length === 1 ? [] : result;
    }

    checkVerticalLine(cell, moves) {
        const currentCol = cell % this.state.boardInfo.numOfRows;

        const validMoves = moves.filter(
            (item) => item % this.state.boardInfo.numOfRows === currentCol
        );

        let result = [cell];

        for (let i = 1; i < this.state.boardInfo.winRule; i += 1) {
            const currentCell = cell + i * this.state.boardInfo.numOfRows;
            if (!validMoves.some((move) => move === currentCell)) {
                result = [cell];
                break;
            }
            result.push(currentCell);
        }

        if (result.length === this.state.boardInfo.winRule) return result;

        for (let i = 1; i < this.state.boardInfo.winRule; i += 1) {
            const currentCell = cell - i * this.state.boardInfo.numOfRows;
            if (!validMoves.some((move) => move === currentCell)) {
                result = [cell];
                break;
            }
            result.push(currentCell);
        }

        return result.length === 1 ? [] : result;
    }

    checkPrimaryDiagonal(cell, moves) {
        const currentRow = Math.floor(cell / this.state.boardInfo.numOfRows);

        const validMoves = moves.filter(
            (item) =>
                (item - cell) % (this.state.boardInfo.numOfRows + 1) === 0 &&
                item / this.state.boardInfo.numOfRows !== currentRow
        );

        let result = [cell];

        for (let i = 1; i < this.state.boardInfo.winRule; i += 1) {
            const currentCell = cell + i * (this.state.boardInfo.numOfRows + 1);
            if (!validMoves.some((move) => move === currentCell)) {
                result = [cell];
                break;
            }
            result.push(currentCell);
        }

        if (result.length === this.state.boardInfo.winRule) return result;

        for (let i = 1; i < this.state.boardInfo.winRule; i += 1) {
            const currentCell = cell - i * (this.state.boardInfo.numOfRows + 1);
            if (!validMoves.some((move) => move === currentCell)) {
                result = [cell];
                break;
            }
            result.push(currentCell);
        }

        return result.length === 1 ? [] : result;
    }

    checkSecondaryDiagonal(cell, moves) {
        const currentRow = Math.floor(cell / this.state.boardInfo.numOfRows);

        const validMoves = moves.filter(
            (item) =>
                (item - cell) % (this.state.boardInfo.numOfRows - 1) === 0 &&
                item / this.state.boardInfo.numOfRows !== currentRow
        );

        let result = [cell];

        for (let i = 1; i < this.state.boardInfo.winRule; i += 1) {
            const currentCell = cell + i * (this.state.boardInfo.numOfRows - 1);
            if (!validMoves.some((move) => move === currentCell)) {
                result = [cell];
                break;
            }
            result.push(currentCell);
        }

        if (result.length === this.state.boardInfo.winRule) return result;

        for (let i = 1; i < this.state.boardInfo.winRule; i += 1) {
            const currentCell = cell - i * (this.state.boardInfo.numOfRows - 1);
            if (!validMoves.some((move) => move === currentCell)) {
                result = [cell];
                break;
            }
            result.push(currentCell);
        }

        return result.length === 1 ? [] : result;
    }

    checkLine(moves) {
        let result = [];
        for (let move of moves) {
            let filtered = moves.filter((item) => item !== move);
            result = this.checkHorizontalLine(move, filtered);
            if (result.length !== 0) return result;
            result = this.checkVerticalLine(move, filtered);
            if (result.length !== 0) return result;

            result = this.checkPrimaryDiagonal(move, filtered);
            if (result.length !== 0) return result;

            result = this.checkSecondaryDiagonal(move, filtered);
            if (result.length !== 0) return result;
        }
        return result;
    }

    checkForWinner(board, currentPlayer) {
        const currentPlayerMoves = [];

        board.forEach((cell, index) => {
            if (cell === currentPlayer) {
                currentPlayerMoves.push(index);
            }
        });

        return this.checkLine(currentPlayerMoves);
    }

    handleCellClick(cell) {
        if (this.state.winner !== null) return;
        if (this.state.moves[this.state.currentMove][cell] !== null) {
            return;
        }

        const newBoard = JSON.parse(
            JSON.stringify(this.state.moves[this.state.currentMove])
        );
        newBoard[cell] = this.state.currentPlayer;

        const winner = this.checkForWinner(newBoard, this.state.currentPlayer);

        if (winner.length !== 0) {
            this.setState((state) => ({
                ...state,
                moves: state.moves
                    .slice(0, state.currentMove + 1)
                    .concat([newBoard]),
                currentMove: state.currentMove + 1,
                currentPlayer: state.currentPlayer === "x" ? "o" : "x",
                winner: state.currentPlayer,
                line: winner,
            }));
            return;
        }

        this.setState((state) => ({
            ...state,
            moves: state.moves
                .slice(0, state.currentMove + 1)
                .concat([newBoard]),
            currentMove: state.currentMove + 1,
            currentPlayer: state.currentPlayer === "x" ? "o" : "x",
        }));
    }

    render() {
        return (
            <div className="game__wrapper">
                <Board
                    boardInfo={this.state.boardInfo}
                    board={this.state.moves[this.state.currentMove]}
                    currentPlayer={this.state.currentPlayer}
                    handleCellClick={this.handleCellClick.bind(this)}
                    winner={this.state.winner}
                    line={this.state.line}
                />
            </div>
        );
    }
}
