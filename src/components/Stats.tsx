import React from 'react';

type StatsProps = {
    stats: { X: number; O: number; draw: number };
    showStats: boolean;
    toggleStats: () => void;
};

const Stats: React.FC<StatsProps> = ({ stats, showStats, toggleStats }) => {
    return (
        <div className="flex flex-col items-center">
            <button
                onClick={toggleStats}
                className="mt-6 text-blue-600 underline"
            >
                {showStats ? 'Hide Stats' : 'Show Stats'}
            </button>

            {showStats && (
                <div className="mt-4 bg-white p-4 rounded shadow-md">
                    <h3 className="font-bold mb-2">Game Statistics</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div className="text-xl font-bold text-blue-600">{stats.X}</div>
                            <div className="text-gray-600">X Wins</div>
                        </div>
                        <div>
                            <div className="text-xl font-bold text-green-600">{stats.O}</div>
                            <div className="text-gray-600">O Wins</div>
                        </div>
                        <div>
                            <div className="text-xl font-bold text-gray-600">{stats.draw}</div>
                            <div className="text-gray-600">Draws</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Stats;
