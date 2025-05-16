import {type SquareValue, SquareValues} from "../models/ttt.model.ts";
import React from "react";

type SquareProps = {
    value: SquareValue,
    onSquareClick: () => void
};

const Square: React.FC<SquareProps> = ({ value, onSquareClick }) => {
    return (
        <button
            className={`w-14 h-14 border border-gray-400 flex items-center justify-center text-2xl font-bold
        ${!value ? 'hover:bg-gray-100' : ''} 
        ${value === SquareValues.X ? 'text-blue-600' : 'text-red-600'}`}
            onClick={onSquareClick}
        >
            {value}
        </button>
    );
}

export default Square;