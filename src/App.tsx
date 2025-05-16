import { type JSX } from 'react';
import History from './components/History';
import Board from './components/Board';
import Stats from './components/Stats';
import Header from './components/Header';

import {useGame} from "./services/game.service.ts";

const App: () => JSX.Element = () => {
    const {
        boardSize,
        aiDifficulty,
        playerMode,
        changeBoardSize,
        togglePlayerMode,
        status,
        currentSquares,
        handleSquareClick,
        newGame,
        isPlaying,
        stats,
        showStats,
        toggleStats,
        history,
        currentMove,
        isAscending,
        jumpTo,
        toggleSortOrder,
        changeAIDifficulty,
    } = useGame();

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 py-8 font-sans">
            <div className="flex flex-col md:flex-row gap-8 w-full px-4 max-w-screen-lg">
                <div className="flex-1 flex flex-col items-center">
                    <Header
                        boardSize={boardSize}
                        aiDifficulty={aiDifficulty}
                        playerMode={playerMode}
                        changeBoardSize={changeBoardSize}
                        changeAIDifficulty={changeAIDifficulty}
                        togglePlayerMode={togglePlayerMode}
                    />

                    <div className={`mb-4 text-center ${!isPlaying ? 'bg-yellow-100 border border-yellow-300 p-3 rounded-lg shadow' : 'p-3'}`}>
                        <h2 className="text-xl font-semibold text-gray-700">{status}</h2>
                    </div>

                    <Board
                        squares={currentSquares}
                        onSquareClick={handleSquareClick}
                        boardSize={boardSize}
                    />

                    <button
                        onClick={newGame}
                        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition duration-150 ease-in-out"
                    >
                        {isPlaying ? 'Restart Game' : 'New Game'}
                    </button>

                    <Stats
                        stats={stats}
                        showStats={showStats}
                        toggleStats={toggleStats}
                    />
                </div>

                <History
                    history={history}
                    currentMove={currentMove}
                    isAscending={isAscending}
                    onJumpTo={jumpTo}
                    onToggleSort={toggleSortOrder}
                />
            </div>
        </div>
    );
}

export default App;
