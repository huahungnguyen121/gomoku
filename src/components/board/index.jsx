import React from "react";
import { SORT_MODE } from "../../constants/constants.js";
import Cell from "../cell/index.jsx";
import "./index.css";

export default class Board extends React.Component {
    renderBoard() {
        return Array(this.props.boardInfo.numOfRows)
            .fill(null)
            .map((_, row) => (
                <div className="board__board-row" key={row}>
                    {Array(this.props.boardInfo.numOfRows)
                        .fill(null)
                        .map((_, col) => {
                            const cellIndex =
                                row * this.props.boardInfo.numOfRows + col;
                            return (
                                <Cell
                                    key={`cell-${cellIndex}`}
                                    value={this.props.board[cellIndex] || ""}
                                    highlight={
                                        this.props.line
                                            ? this.props.line.some(
                                                  (item) => item === cellIndex
                                              )
                                            : false
                                    }
                                    onClick={() =>
                                        this.props.handleCellClick(cellIndex)
                                    }
                                />
                            );
                        })}
                </div>
            ));
    }

    renderHistory() {
        return Array(this.props.totalMoves)
            .fill(null)
            .map((_, index) => {
                const sortIndex =
                    this.props.sortMode === SORT_MODE.ASCENDING
                        ? index
                        : this.props.totalMoves - 1 - index;
                const player = this.props.playerToMove[sortIndex - 1]?.player;
                const coordinates = [
                    Math.floor(
                        this.props.playerToMove[sortIndex - 1]?.index /
                            this.props.boardInfo.numOfRows
                    ),
                    this.props.playerToMove[sortIndex - 1]?.index %
                        this.props.boardInfo.numOfRows,
                ];

                let moveInfo = "";
                if (
                    player !== undefined &&
                    !isNaN(coordinates[0]) &&
                    !isNaN(coordinates[1])
                ) {
                    moveInfo = `${player.toUpperCase()} [row: ${
                        coordinates[0] + 1
                    }, col: ${coordinates[1] + 1}]`;
                }

                return (
                    <li
                        className={`board__move-history-item${
                            sortIndex === this.props.currentMove
                                ? " board__move-history-item--highlight"
                                : ""
                        }`}
                        key={`move-${sortIndex}`}
                    >
                        <button
                            onClick={() => this.props.handleGoToMove(sortIndex)}
                        >
                            {sortIndex === 0
                                ? `Go to start`
                                : `Go to move #${sortIndex}`}
                        </button>
                        <span>{moveInfo}</span>
                    </li>
                );
            });
    }

    changeSortMode() {
        if (this.props.sortMode === SORT_MODE.ASCENDING) {
            this.props.sortDescending();
        } else {
            this.props.sortAscending();
        }
    }

    render() {
        return (
            <>
                <div className="board__control">
                    <span>Rule: </span>
                    <button
                        className={
                            this.props.boardInfo.winRule === 3
                                ? "board__button--highlight"
                                : ""
                        }
                        onClick={() => this.props.changeToBoard3()}
                    >
                        3 Consecutive Squares
                    </button>
                    <button
                        className={
                            this.props.boardInfo.winRule === 5
                                ? "board__button--highlight"
                                : ""
                        }
                        onClick={() => this.props.changeToBoard5()}
                    >
                        5 Consecutive Squares
                    </button>
                    <span>Sort: </span>
                    <button onClick={() => this.changeSortMode()}>
                        {this.props.sortMode === SORT_MODE.ASCENDING
                            ? "Ascending"
                            : "Descending"}
                    </button>
                </div>
                <div className="board__container">
                    <div className="board__game">
                        <div className="board__game-board">
                            {this.renderBoard()}
                        </div>
                    </div>
                    <div className="board__game-status">
                        <div className="board__game-status-text">
                            {this.props.status}
                        </div>
                        <ol className="board__move-history">
                            {this.renderHistory()}
                        </ol>
                    </div>
                </div>
            </>
        );
    }
}
