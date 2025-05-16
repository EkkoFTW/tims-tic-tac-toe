import  { createContext } from 'react';
import type {GameContextType} from "../models/ttt.model.ts";

export const GameContext = createContext<GameContextType | undefined>(undefined);