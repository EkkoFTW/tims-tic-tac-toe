import React from 'react';
import {AIDifficulties, type AIDifficulty} from "../models/ttt.model.ts";

type HeaderProps = {
    boardSize: number;
    aiDifficulty: AIDifficulty;
    playerMode: string;
    changeBoardSize: (size: number) => void;
    changeAIDifficulty: (difficulty: AIDifficulty) => void;
    togglePlayerMode: () => void;
};

const Header: React.FC<HeaderProps> = ({ boardSize, aiDifficulty, playerMode, changeBoardSize, changeAIDifficulty, togglePlayerMode }) => {
    return (
        <div className="flex flex-col items-center mb-8 w-full">
            <h1 className="text-4xl font-bold text-blue-600 mb-4">Tic-Tac-Toe</h1>
            <div className="flex justify-between w-full max-w-md">
                <div className="flex items-center">
                    <span className="mr-2 text-gray-700">Board Size:</span>
                    <select
                        value={boardSize}
                        onChange={(e) => changeBoardSize(Number(e.target.value))}
                        className="bg-white border border-gray-300 rounded px-2 py-1"
                    >
                        <option value={3}>3×3</option>
                        <option value={4}>4×4</option>
                        <option value={5}>5×5</option>
                    </select>
                </div>

                <div className="flex gap-2">
                    {playerMode === "ai" && (
                        <div className="flex items-center">
                            <select
                                value={aiDifficulty}
                                onChange={(e) => changeAIDifficulty(e.target.value as AIDifficulty)}
                                className="bg-white border border-gray-300 rounded px-2 py-1"
                            >
                                <option value={AIDifficulties.Easy}>Easy</option>
                                <option value={AIDifficulties.Medium}>Medium</option>
                                <option value={AIDifficulties.Hard}>Hard</option>
                            </select>
                        </div>
                    )}

                    <button
                        onClick={togglePlayerMode}
                        className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded"
                    >
                        {playerMode === 'two-player' ? 'Play vs AI' : 'Two Player'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Header;
