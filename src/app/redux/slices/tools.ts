import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ToolMode } from "@/shared/types/point.ts";
import type {RootState} from "../store.ts";

interface ToolsState {
    color: string;
    lineWidth: number;
    mode: ToolMode;
}

const initialState: ToolsState = {
    color: '#FF0000',
    lineWidth: 2,
    mode: 'none',
};

export const toolsSlice = createSlice({
    name: 'tools',
    initialState,
    reducers: {
        setColor: (state, action: PayloadAction<string>) => {
            state.color = action.payload;
        },
        setLineWidth: (state, action: PayloadAction<number>) => {
            state.lineWidth = action.payload;
        },
        setMode: (state, action: PayloadAction<ToolsState['mode']>) => {
            state.mode = action.payload;
        },
    },
});

export const { setColor, setLineWidth, setMode } = toolsSlice.actions;

export const colorSelector = (state: RootState) => state.tools.color;
export const lineWidthSelector = (state: RootState) => state.tools.lineWidth;
export const modeSelector = (state: RootState) => state.tools.mode;
