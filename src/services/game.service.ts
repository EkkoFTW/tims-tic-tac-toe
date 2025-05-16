import {useContext} from "react";
import {GameContext} from "../contexts/GameContext.tsx";
import type {GameContextType} from "../models/ttt.model.ts";

export const useGame = (): GameContextType => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};