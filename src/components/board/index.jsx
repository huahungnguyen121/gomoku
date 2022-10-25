import React from "react";
import Cell from "../cell/index.jsx";
import "./index.css";

export default class Board extends React.Component {
    renderBoard() {
        const numOfRows = Math.sqrt(this.props.boardInfo.numOfCells);

        return Array(numOfRows)
            .fill(null)
            .map((_, row) => (
                <div className="board__board-row" key={row}>
                    {Array(numOfRows)
                        .fill(null)
                        .map((_, col) => {
                            const cellIndex = row * numOfRows + col;
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

    render() {
        return (
            <>
                <div className="board__game-status">
                    {this.props.winner === null
                        ? `Next Player: ${this.props.currentPlayer.toUpperCase()}`
                        : `Winner: ${this.props.winner.toUpperCase()}`}
                </div>
                <div className="board__board-wrapper">{this.renderBoard()}</div>
            </>
        );
    }
}
