import Square from "./Square.tsx";
import type {SquareValue} from "../models/ttt.model.ts";
import React from "react";

type BoardProps = {
    squares: SquareValue[],
    onSquareClick: (idx: number) => void,
    boardSize: number
};

const Board: React.FC<BoardProps> =({ squares, onSquareClick, boardSize }) => {
    const rows = [];
    for (let i = 0; i < boardSize; i++) {
        const cells = [];
        for (let j = 0; j < boardSize; j++) {
            const idx = i * boardSize + j;
            cells.push(
                <Square
                    key={idx}
                    value={squares[idx]}
                    onSquareClick={() => onSquareClick(idx)}
                />
            );
        }
        rows.push(
            <div key={i} className="board-row flex">
                {cells}
            </div>
        );
    }

    const boardWidth = boardSize * 60;

    return (
        <div className="flex flex-col items-center" style={{ width: boardWidth }}>
            {rows}
        </div>
    );
}

export default Board;