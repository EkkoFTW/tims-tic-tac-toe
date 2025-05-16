import React from 'react';

interface HistoryProps {
    history: Array<(string | null)[]>;
    currentMove: number;
    isAscending: boolean;
    onJumpTo: (move: number) => void;
    onToggleSort: () => void;
}

const History: React.FC<HistoryProps> = ({ history, currentMove, isAscending, onJumpTo, onToggleSort }) => {
    const moves = history.map((_, move) => {
        const description = move ? `Go to move #${move}` : 'Go to game start';
        return (
            <li key={move} className="mb-1">
                <button
                    className={`px-2 py-1 rounded ${currentMove === move ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                    onClick={() => onJumpTo(move)}
                >
                    {description}
                </button>
            </li>
        );
    });

    return (
        <div className="bg-white p-4 rounded shadow-md w-full md:w-64">
            <div className="flex justify-between items-center mb-2">
                <h2 className="font-bold">Game History</h2>
                <button
                    onClick={onToggleSort}
                    className="text-blue-600 text-sm"
                >
                    {isAscending ? '▼ Desc' : '▲ Asc'}
                </button>
            </div>
            <ol className={`pl-5 list-decimal ${!isAscending ? 'flex flex-col-reverse' : ''}`}>
                {moves}
            </ol>
        </div>
    );
};

export default History;
