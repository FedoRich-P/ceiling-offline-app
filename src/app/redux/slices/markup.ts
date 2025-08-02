import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { MarkupIconType } from "@/shared/types/point.ts";
import { v4 as uuidv4 } from 'uuid';
import type {RootState} from "../store.ts";

export interface MarkupIcon {
    id: string;
    type: MarkupIconType;
    x: number;
    y: number;
    label?: string;
}

interface Stroke {
    id: string;
    points: number[];
    color: string;
    width: number;
}

interface MarkupState {
    strokes: Stroke[];
    icons: MarkupIcon[];
    selectedIconId: string | null;
    labels: Record<string, string>;
    isDrawing: boolean;
    currentStroke: number[];
}

const initialState: MarkupState = {
    strokes: [],
    icons: [],
    selectedIconId: null,
    labels: {},
    isDrawing: false,
    currentStroke: [],
};

export const markupSlice = createSlice({
    name: 'markup',
    initialState,
    reducers: {
        addStroke: (state, action: PayloadAction<Stroke>) => {
            state.strokes.push(action.payload);
        },
        clearStrokes: (state) => {
            state.strokes = [];
        },
        setIsDrawing: (state, action: PayloadAction<boolean>) => {
            state.isDrawing = action.payload;
        },
        setCurrentStroke: (state, action: PayloadAction<number[]>) => {
            state.currentStroke = action.payload;
        },
        addMarkupIcon: (state, action: PayloadAction<Omit<MarkupIcon, 'id' | 'label'>>) => {
            const id = uuidv4();
            state.icons.push({ id, ...action.payload, label: '' });
            state.labels[id] = '';
        },
        deleteMarkupIcon: (state, action: PayloadAction<string>) => {
            state.icons = state.icons.filter(icon => icon.id !== action.payload);
            delete state.labels[action.payload];
            if (state.selectedIconId === action.payload) {
                state.selectedIconId = null;
            }
        },
        updateMarkupIcon: (state, action: PayloadAction<{ id: string; label?: string; x?: number; y?: number }>) => {
            const icon = state.icons.find(i => i.id === action.payload.id);
            if (icon) {
                if (action.payload.label !== undefined) icon.label = action.payload.label;
                if (action.payload.x !== undefined) icon.x = action.payload.x;
                if (action.payload.y !== undefined) icon.y = action.payload.y;
            }
        },
        updateMarkupIconPosition: (state, action: PayloadAction<{ id: string; x: number; y: number }>) => {
            const icon = state.icons.find(i => i.id === action.payload.id);
            if (icon) {
                icon.x = action.payload.x;
                icon.y = action.payload.y;
            }
        },
        setSelectedIconId: (state, action: PayloadAction<string | null>) => {
            state.selectedIconId = action.payload;
        },
    },
});

export const {
    addStroke,
    clearStrokes,
    addMarkupIcon,
    deleteMarkupIcon,
    updateMarkupIcon,
    setSelectedIconId,
    updateMarkupIconPosition,
    setIsDrawing,
    setCurrentStroke,
} = markupSlice.actions;

export const strokesSelector = (state: RootState) => state.markup.strokes;
export const markupIconsSelector = (state: RootState) => state.markup.icons;
export const selectedIconIdSelector = (state: RootState) => state.markup.selectedIconId;
export const iconLabelsSelector = (state: RootState) => state.markup.labels;
export const isDrawingSelector = (state: RootState) => state.markup.isDrawing;
export const currentStrokeSelector = (state: RootState) => state.markup.currentStroke;
