import React from "react";
import Board from "./components/board";
import { SORT_MODE } from "./constants/constants.js";
import "./style.css";

const DEFAULT_BOARD_CONFIG = {
    BOARD_3: {
        NUM_OF_CELLS: 9,
        WIN_RULE: 3,
    },
    BOARD_5: {
        NUM_OF_CELLS: 25,
        WIN_RULE: 5,
    },
};

const DEFAULT_BOARD_STATE = {
    PLAYER_TO_MOVE: [],
    CURRENT_MOVE: 0,
    CURRENT_PLAYER: "x",
    WINNER: null,
    LINE: [],
    SORT_MODE: SORT_MODE.ASCENDING,
};

export default class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            boardInfo: {
                numOfCells: DEFAULT_BOARD_CONFIG.BOARD_3.NUM_OF_CELLS,
                winRule: DEFAULT_BOARD_CONFIG.BOARD_3.WIN_RULE,
                numOfRows: Math.sqrt(DEFAULT_BOARD_CONFIG.BOARD_3.NUM_OF_CELLS),
            },
            moves: [
                Array(DEFAULT_BOARD_CONFIG.BOARD_3.NUM_OF_CELLS).fill(null),
            ],
            playerToMove: DEFAULT_BOARD_STATE.PLAYER_TO_MOVE,
            currentMove: DEFAULT_BOARD_STATE.CURRENT_MOVE,
            currentPlayer: DEFAULT_BOARD_STATE.CURRENT_PLAYER,
            winner: DEFAULT_BOARD_STATE.WINNER,
            line: DEFAULT_BOARD_STATE.LINE,
            sortMode: DEFAULT_BOARD_STATE.SORT_MODE,
        };
    }

    checkHorizontalLine(cell, moves) {
        const currentRow = Math.floor(cell / this.state.boardInfo.numOfRows);

        const validMoves = moves.filter((item) => {
            return (
                item >= currentRow * this.state.boardInfo.numOfRows &&
                item < (currentRow + 1) * this.state.boardInfo.numOfRows
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
                Math.floor(item / this.state.boardInfo.numOfRows) !== currentRow
        );

        let result = [cell];

        let prevRow = currentRow;
        for (let i = 1; i < this.state.boardInfo.winRule; i += 1) {
            const currentCell = cell + i * (this.state.boardInfo.numOfRows + 1);
            const currentCellRow = Math.floor(
                currentCell / this.state.boardInfo.numOfRows
            );
            if (
                currentCellRow === prevRow ||
                !validMoves.some((move) => move === currentCell)
            ) {
                result = [cell];
                break;
            }
            result.push(currentCell);
            prevRow = currentCellRow;
        }

        if (result.length === this.state.boardInfo.winRule) return result;

        prevRow = currentRow;
        for (let i = 1; i < this.state.boardInfo.winRule; i += 1) {
            const currentCell = cell - i * (this.state.boardInfo.numOfRows + 1);
            const currentCellRow = Math.floor(
                currentCell / this.state.boardInfo.numOfRows
            );
            if (
                currentCellRow === prevRow ||
                !validMoves.some((move) => move === currentCell)
            ) {
                result = [cell];
                break;
            }
            result.push(currentCell);
            prevRow = currentCellRow;
        }

        return result.length === 1 ? [] : result;
    }

    checkSecondaryDiagonal(cell, moves) {
        const currentRow = Math.floor(cell / this.state.boardInfo.numOfRows);

        const validMoves = moves.filter(
            (item) =>
                (item - cell) % (this.state.boardInfo.numOfRows - 1) === 0 &&
                Math.floor(item / this.state.boardInfo.numOfRows) !== currentRow
        );

        let result = [cell];

        let prevRow = currentRow;
        for (let i = 1; i < this.state.boardInfo.winRule; i += 1) {
            const currentCell = cell + i * (this.state.boardInfo.numOfRows - 1);
            const currentCellRow = Math.floor(
                currentCell / this.state.boardInfo.numOfRows
            );
            if (
                currentCellRow === prevRow ||
                !validMoves.some((move) => move === currentCell)
            ) {
                result = [cell];
                break;
            }
            result.push(currentCell);
            prevRow = currentCellRow;
        }

        if (result.length === this.state.boardInfo.winRule) return result;

        prevRow = currentRow;
        for (let i = 1; i < this.state.boardInfo.winRule; i += 1) {
            const currentCell = cell - i * (this.state.boardInfo.numOfRows - 1);
            const currentCellRow = Math.floor(
                currentCell / this.state.boardInfo.numOfRows
            );
            if (
                currentCellRow === prevRow ||
                !validMoves.some((move) => move === currentCell)
            ) {
                result = [cell];
                break;
            }
            result.push(currentCell);
            prevRow = currentCellRow;
        }

        return result.length === 1 ? [] : result;
    }

    checkLine(moves) {
        let result = [];
        for (let move of moves) {
            let filtered = moves.filter((item) => item !== move);
            result = this.checkHorizontalLine(move, filtered);
            if (result.length !== 0) {
                console.log("horizontal", result);
                return result;
            }

            result = this.checkVerticalLine(move, filtered);
            if (result.length !== 0) {
                console.log("vertical", result);
                return result;
            }

            result = this.checkPrimaryDiagonal(move, filtered);
            if (result.length !== 0) {
                console.log("primary-diagonal", result);
                return result;
            }

            result = this.checkSecondaryDiagonal(move, filtered);
            if (result.length !== 0) {
                console.log("secondary-diagonal", result);
                return result;
            }
        }
        return result; // return winning line or an empty array if it does not exist
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
        if (
            this.state.winner !== null &&
            this.state.currentMove === this.state.moves.length - 1
        )
            return; // prevent click when there was a winner already
        if (this.state.moves[this.state.currentMove][cell] !== null) {
            return; // prevent click when it is not an empty cell
        }

        const newBoard = JSON.parse(
            JSON.stringify(this.state.moves[this.state.currentMove])
        );
        newBoard[cell] = this.state.currentPlayer;

        const winner = this.checkForWinner(newBoard, this.state.currentPlayer);

        if (winner.length !== 0) {
            // if there is a winner
            this.setState((state) => ({
                ...state,
                moves: state.moves
                    .slice(0, state.currentMove + 1)
                    .concat([newBoard]),
                playerToMove: state.playerToMove
                    .slice(0, state.currentMove)
                    .concat([
                        {
                            player: state.currentPlayer,
                            index: cell,
                        },
                    ]),
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
            playerToMove: state.playerToMove
                .slice(0, state.currentMove)
                .concat([
                    {
                        player: state.currentPlayer,
                        index: cell,
                    },
                ]),
            currentMove: state.currentMove + 1,
            currentPlayer: state.currentPlayer === "x" ? "o" : "x",
            winner: null,
            line: [],
        }));
    }

    handleGoToMove(move) {
        this.setState((state) => ({
            ...state,
            currentMove: move,
            currentPlayer:
                state.playerToMove[move]?.player ||
                DEFAULT_BOARD_STATE.CURRENT_PLAYER,
        }));
    }

    handleChangeBoard(config) {
        this.setState((state) => ({
            ...state,
            boardInfo: {
                numOfCells: config.NUM_OF_CELLS,
                winRule: config.WIN_RULE,
                numOfRows: Math.sqrt(config.NUM_OF_CELLS),
            },
            moves: [Array(config.NUM_OF_CELLS).fill(null)],
            playerToMove: DEFAULT_BOARD_STATE.PLAYER_TO_MOVE,
            currentMove: DEFAULT_BOARD_STATE.CURRENT_MOVE,
            currentPlayer: DEFAULT_BOARD_STATE.CURRENT_PLAYER,
            winner: DEFAULT_BOARD_STATE.WINNER,
            line: DEFAULT_BOARD_STATE.LINE,
            sortMode: DEFAULT_BOARD_STATE.SORT_MODE,
        }));
    }

    render() {
        let statusText = "";
        if (
            this.state.winner === null ||
            this.state.currentMove !== this.state.moves.length - 1
        ) {
            statusText = `Next Player: ${this.state.currentPlayer.toUpperCase()}`;
            if (
                this.state.moves[this.state.currentMove].every(
                    (item) => item !== null
                )
            ) {
                statusText = "Result: Draw";
            }
        } else {
            statusText = `Winner: ${this.state.winner.toUpperCase()}`;
        }

        return (
            <div className="game__wrapper">
                <Board
                    boardInfo={this.state.boardInfo}
                    board={this.state.moves[this.state.currentMove]}
                    currentPlayer={this.state.currentPlayer}
                    handleCellClick={this.handleCellClick.bind(this)}
                    handleGoToMove={this.handleGoToMove.bind(this)}
                    line={
                        this.state.currentMove === this.state.moves.length - 1
                            ? this.state.line
                            : []
                    }
                    status={statusText}
                    totalMoves={this.state.moves.length}
                    currentMove={this.state.currentMove}
                    playerToMove={this.state.playerToMove}
                    sortMode={this.state.sortMode}
                    sortAscending={() =>
                        this.setState((state) => ({
                            ...state,
                            sortMode: SORT_MODE.ASCENDING,
                        }))
                    }
                    sortDescending={() =>
                        this.setState((state) => ({
                            ...state,
                            sortMode: SORT_MODE.DESCENDING,
                        }))
                    }
                    changeToBoard3={() =>
                        this.handleChangeBoard(DEFAULT_BOARD_CONFIG.BOARD_3)
                    }
                    changeToBoard5={() =>
                        this.handleChangeBoard(DEFAULT_BOARD_CONFIG.BOARD_5)
                    }
                />
            </div>
        );
    }
}
