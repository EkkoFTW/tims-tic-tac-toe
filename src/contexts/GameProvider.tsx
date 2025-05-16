import React, { type ReactNode, useCallback, useEffect, useState, useMemo } from "react";
import {AIDifficulties, type AIDifficulty, type GameContextType, type GameState, type PlayerMode, PlayerModes, type SquareValue, SquareValues} from "../models/ttt.model.ts";

import {GameContext} from "./GameContext.tsx";

const initialBoardSize = 3;
const initialHistory = [Array(initialBoardSize * initialBoardSize).fill(null)];

const initialState: GameState = {
    boardSize: initialBoardSize,
    history: initialHistory,
    currentMove: 0,
    isAscending: true,
    isPlaying: true,
    playerMode: PlayerModes.TwoPlayer,
    aiDifficulty: AIDifficulties.Medium,
    stats: { X: 0, O: 0, draw: 0 },
    showStats: false,
    xIsNext: true,
    currentSquares: initialHistory[0],
    winner: null,
    status: `Next player: ${SquareValues.X}`,
};

interface GameProviderProps {
    children: ReactNode;
}

type PositionCache = Map<string, number>;

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
    const [boardSize, setBoardSize] = useState<number>(initialState.boardSize);
    const [history, setHistory] = useState<SquareValue[][]>(initialState.history);
    const [currentMove, setCurrentMove] = useState<number>(initialState.currentMove);
    const [isAscending, setIsAscending] = useState<boolean>(initialState.isAscending);
    const [isPlaying, setIsPlaying] = useState<boolean>(initialState.isPlaying);
    const [playerMode, setPlayerMode] = useState<PlayerMode>(initialState.playerMode);
    const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>(initialState.aiDifficulty);
    const [stats, setStats] = useState(initialState.stats);
    const [showStats, setShowStats] = useState<boolean>(initialState.showStats);
    const [isViewingHistory, setIsViewingHistory] = useState<boolean>(false);

    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];

    const winningPatterns = useMemo(() => {
        const patterns: number[][] = [];

        for (let i = 0; i < boardSize; i++) {
            const row: number[] = [];
            for (let j = 0; j < boardSize; j++) {
                row.push(i * boardSize + j);
            }
            patterns.push(row);
        }

        for (let i = 0; i < boardSize; i++) {
            const col: number[] = [];
            for (let j = 0; j < boardSize; j++) {
                col.push(j * boardSize + i);
            }
            patterns.push(col);
        }

        const mainDiag: number[] = [];
        for (let i = 0; i < boardSize; i++) {
            mainDiag.push(i * boardSize + i);
        }
        patterns.push(mainDiag);

        const antiDiag: number[] = [];
        for (let i = 0; i < boardSize; i++) {
            antiDiag.push(i * boardSize + (boardSize - 1 - i));
        }
        patterns.push(antiDiag);

        return patterns;
    }, [boardSize]);

    const calculateWinner = useCallback((squares: SquareValue[]): SquareValue | null => {
        for (const pattern of winningPatterns) {
            const firstValue = squares[pattern[0]];
            if (!firstValue) continue;

            let isWinning = true;
            for (let i = 1; i < pattern.length; i++) {
                if (squares[pattern[i]] !== firstValue) {
                    isWinning = false;
                    break;
                }
            }

            if (isWinning) return firstValue;
        }

        return null;
    }, [winningPatterns]);

    const winner = calculateWinner(currentSquares);

    useEffect(() => {
        setHistory([Array(boardSize * boardSize).fill(null)]);
        setCurrentMove(0);
        setIsPlaying(true);
        setIsViewingHistory(false);
    }, [boardSize]);


    const updateStats = useCallback((gameWinner: SquareValue | null) => {
        setStats(prevStats => {
            if (!gameWinner && currentSquares.every(sq => sq !== null)) {
                return { ...prevStats, draw: prevStats.draw + 1 };
            }
            if (gameWinner === SquareValues.X || gameWinner === SquareValues.O) {
                return { ...prevStats, [gameWinner]: prevStats[gameWinner] + 1 };
            }
            return prevStats;
        });
    }, [currentSquares]);


    const handlePlay = useCallback((nextSquares: SquareValue[]) => {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
        setIsViewingHistory(false);

        const gameWinner = calculateWinner(nextSquares);
        if (gameWinner || nextSquares.every(square => square !== null)) {
            setIsPlaying(false);
            updateStats(gameWinner);
        }
    }, [history, currentMove, calculateWinner, updateStats]);

    const findStrategicMove = useCallback((squares: SquareValue[], player: SquareValue): number | null => {
        for (let i = 0; i < squares.length; i++) {
            if (!squares[i]) {
                const squaresCopy = [...squares];
                squaresCopy[i] = player;
                if (calculateWinner(squaresCopy) === player) {
                    return i;
                }
            }
        }
        return null;
    }, [calculateWinner]);

    const makeEasyAIMove = useCallback(() => {
        const emptySquares = currentSquares
            .map((square, i) => (square === null ? i : null))
            .filter(i => i !== null) as number[];

        if (emptySquares.length > 0) {
            const randomIndex = Math.floor(Math.random() * emptySquares.length);
            const nextSquares = [...currentSquares];
            nextSquares[emptySquares[randomIndex]] = SquareValues.O;
            handlePlay(nextSquares);
        }
    }, [currentSquares, handlePlay]);

    const makeMediumAIMove = useCallback(() => {
        const squares = [...currentSquares];

        const aiWinMove = findStrategicMove(squares, SquareValues.O);
        if (aiWinMove !== null) {
            squares[aiWinMove] = SquareValues.O;
            handlePlay(squares);
            return;
        }

        const playerWinMove = findStrategicMove(squares, SquareValues.X);
        if (playerWinMove !== null) {
            squares[playerWinMove] = SquareValues.O;
            handlePlay(squares);
            return;
        }

        if (boardSize % 2 !== 0) {
            const center = Math.floor(boardSize * boardSize / 2);
            if (!squares[center]) {
                squares[center] = SquareValues.O;
                handlePlay(squares);
                return;
            }
        }

        const emptySquares = squares.map((square, i) => (square === null ? i : null)).filter(i => i !== null) as number[];
        if (emptySquares.length > 0) {
            const randomIndex = Math.floor(Math.random() * emptySquares.length);
            squares[emptySquares[randomIndex]] = SquareValues.O;
            handlePlay(squares);
        }
    }, [currentSquares, boardSize, handlePlay, findStrategicMove]);

    const getOrderedMoves = useCallback((board: SquareValue[]): number[] => {
        const moves: number[] = [];
        const emptyIndices: number[] = [];
        const center = Math.floor((boardSize * boardSize) / 2);
        const corners = [
            0,
            boardSize - 1,
            boardSize * (boardSize - 1),
            boardSize * boardSize - 1
        ];

        if (!board[center]) {
            moves.push(center);
        }

        for (const corner of corners) {
            if (!board[corner]) {
                moves.push(corner);
            }
        }

        for (let i = 0; i < board.length; i++) {
            if (!board[i] && i !== center && !corners.includes(i)) {
                emptyIndices.push(i);
            }
        }

        for (let i = emptyIndices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [emptyIndices[i], emptyIndices[j]] = [emptyIndices[j], emptyIndices[i]];
        }

        return [...moves, ...emptyIndices];
    }, [boardSize]);

    const evaluatePosition = useCallback((board: SquareValue[]): number => {
        let score = 0;

        for (const pattern of winningPatterns) {
            let xCount = 0;
            let oCount = 0;

            for (const index of pattern) {
                if (board[index] === SquareValues.X) xCount++;
                else if (board[index] === SquareValues.O) oCount++;
            }

            if (xCount > 0 && oCount === 0) {
                score -= xCount * xCount;
            }
            if (oCount > 0 && xCount === 0) {
                score += oCount * oCount;
            }
        }

        return score;
    }, [winningPatterns]);

    const minimax = useCallback((
        board: SquareValue[],
        depth: number,
        isMaximizing: boolean,
        alpha: number,
        beta: number,
        cache: PositionCache,
        maxDepth: number
    ): number => {
        const boardKey = board.map(cell => cell === null ? '-' : cell).join('') + (isMaximizing ? '1' : '0');

        if (cache.has(boardKey)) {
            return cache.get(boardKey)!;
        }

        const winner = calculateWinner(board);
        if (winner === SquareValues.O) return 10 - depth;
        if (winner === SquareValues.X) return depth - 10;
        if (board.every(sq => sq !== null)) return 0;

        if (depth >= maxDepth) {
            return evaluatePosition(board);
        }

        const moves = getOrderedMoves(board);

        let bestScore: number;
        if (isMaximizing) {
            bestScore = -Infinity;
            for (const i of moves) {
                board[i] = SquareValues.O;
                const score = minimax(board, depth + 1, false, alpha, beta, cache, maxDepth);
                board[i] = null;
                bestScore = Math.max(bestScore, score);
                alpha = Math.max(alpha, score);
                if (beta <= alpha) break;
            }
        } else {
            bestScore = Infinity;
            for (const i of moves) {
                board[i] = SquareValues.X;
                const score = minimax(board, depth + 1, true, alpha, beta, cache, maxDepth);
                board[i] = null;
                bestScore = Math.min(bestScore, score);
                beta = Math.min(beta, score);
                if (beta <= alpha) break;
            }
        }

        cache.set(boardKey, bestScore);
        return bestScore;
    }, [calculateWinner, evaluatePosition, getOrderedMoves]);

    const makeHardAIMove = useCallback(() => {
        const squares = [...currentSquares];
        let bestMove = -1;

        const aiWinMove = findStrategicMove(squares, SquareValues.O);
        if (aiWinMove !== null) {
            squares[aiWinMove] = SquareValues.O;
            handlePlay(squares);
            return;
        }

        const playerWinMove = findStrategicMove(squares, SquareValues.X);
        if (playerWinMove !== null) {
            squares[playerWinMove] = SquareValues.O;
            handlePlay(squares);
            return;
        }

        const emptyCount = squares.filter(sq => sq === null).length;
        let maxDepth = 9;

        if (boardSize > 3) {
            maxDepth = 3;
        } else if (emptyCount > 6) {
            maxDepth = 6;
        }

        const cache: PositionCache = new Map();
        let bestScore = -Infinity;

        const orderedMoves = getOrderedMoves(squares);

        for (const i of orderedMoves) {
            if (squares[i] !== null) continue;

            squares[i] = SquareValues.O;
            const score = minimax(squares, 0, false, -Infinity, Infinity, cache, maxDepth);
            squares[i] = null;

            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }

        if (bestMove !== -1) {
            const nextSquares = [...currentSquares];
            nextSquares[bestMove] = SquareValues.O;
            handlePlay(nextSquares);
        } else {
            makeEasyAIMove();
        }
    }, [
        currentSquares,
        boardSize,
        handlePlay,
        minimax,
        makeEasyAIMove,
        findStrategicMove,
        getOrderedMoves
    ]);

    const makeAIMove = useCallback(() => {
        if (!isPlaying || xIsNext || playerMode !== PlayerModes.AI || isViewingHistory) return;

        const aiMoveTimeout = setTimeout(() => {
            if (aiDifficulty === AIDifficulties.Easy) {
                makeEasyAIMove();
            } else if (aiDifficulty === AIDifficulties.Medium) {
                makeMediumAIMove();
            } else if (aiDifficulty === AIDifficulties.Hard) {
                makeHardAIMove();
            }
        }, 500);
        return () => clearTimeout(aiMoveTimeout);

    }, [
        isPlaying,
        xIsNext,
        playerMode,
        aiDifficulty,
        makeEasyAIMove,
        makeMediumAIMove,
        makeHardAIMove,
        isViewingHistory
    ]);

    useEffect(() => {
        if (playerMode === PlayerModes.AI && !xIsNext && isPlaying && !isViewingHistory) {
            makeAIMove();
        }
    }, [playerMode, xIsNext, isPlaying, makeAIMove, isViewingHistory]);

    const handleSquareClick = (idx: number) => {
        if (isViewingHistory) {
            setIsViewingHistory(false);
        }

        if (!isPlaying || currentSquares[idx] || (playerMode === PlayerModes.AI && !xIsNext)) {
            return;
        }
        const nextSquares = [...currentSquares];
        nextSquares[idx] = xIsNext ? SquareValues.X : SquareValues.O;
        handlePlay(nextSquares);
    };

    const jumpTo = (nextMove: number) => {
        const isHistoricalMove = nextMove < history.length - 1;
        setIsViewingHistory(isHistoricalMove);

        setCurrentMove(nextMove);
        const newCurrentSquares = history[nextMove];
        const gameWinner = calculateWinner(newCurrentSquares);
        const isDraw = newCurrentSquares.every(sq => sq !== null);
        setIsPlaying(!gameWinner && !isDraw);
    };

    const newGame = useCallback(() => {
        setHistory([Array(boardSize * boardSize).fill(null)]);
        setCurrentMove(0);
        setIsPlaying(true);
        setIsViewingHistory(false);
    }, [boardSize]);


    const toggleSortOrder = () => {
        setIsAscending(!isAscending);
    };

    const togglePlayerMode = () => {
        setPlayerMode(prevMode => {
            const newMode = prevMode === PlayerModes.TwoPlayer ? PlayerModes.AI : PlayerModes.TwoPlayer;
            newGame();
            return newMode;
        });
    };

    const changeAIDifficulty = (difficulty: AIDifficulty) => {
        setAiDifficulty(difficulty);
    };

    const toggleStats = () => {
        setShowStats(!showStats);
    };

    const changeBoardSize = (newSize: number) => {
        setBoardSize(newSize);
    };

    let status;
    if (winner) {
        status = `Winner: ${winner}`;
    } else if (currentSquares.every(square => square !== null)) {
        status = "Game ended in a draw";
    } else {
        status = `Next player: ${xIsNext ? SquareValues.X : SquareValues.O}`;
    }

    const contextValue: GameContextType = {
        boardSize,
        history,
        currentMove,
        isAscending,
        isPlaying,
        playerMode,
        aiDifficulty,
        stats,
        showStats,
        xIsNext,
        currentSquares,
        winner,
        status,
        handleSquareClick,
        jumpTo,
        newGame,
        toggleSortOrder,
        togglePlayerMode,
        changeAIDifficulty,
        toggleStats,
        changeBoardSize,
    };

    return <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>;
};