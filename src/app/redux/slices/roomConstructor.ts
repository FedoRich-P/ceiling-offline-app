import {createAsyncThunk, createSlice, type PayloadAction} from '@reduxjs/toolkit';
import type {Diagonal, Point} from "@/shared/types/point.ts";
import type {RootState} from "../store.ts";
import {db, type DisplayDiagonal} from "@/shared/db/db.ts";

interface RoomState {
    points: Point[];
    diagonals: Diagonal[];
    displayDiagonals: DisplayDiagonal[];
    history: Point[][];
    selectedPointIndex: number | null;
    name: string | undefined;
    area: number;
    perimeter: number;
    corners: number;
    lengths: { name: string; length: number }[];
}

const initialState: RoomState = {
    points: [],
    diagonals: [],
    displayDiagonals: [],
    history: [],
    selectedPointIndex: null,
    name: '',
    area: 0,
    perimeter: 0,
    corners: 0,
    lengths: [],
};

export const loadRoomFromDb = createAsyncThunk(
    'room/loadRoomFromDb',
    async (roomId: number) => {
        const room = await db.rooms.get(roomId);
        // Важно: предполагается, что room хранится с разделёнными полями, не в data как JSON
        if (!room) throw new Error('Room not found');
        return {
            diagonals: room.diagonals || [],
            name: room.name,
            area: room.area || 0,
            perimeter: room.perimeter || 0,
            corners: room.corners || 0,
            lengths: room.lengths || [],
        };
    }
);

export const roomConstructorSlice = createSlice({
    name: 'roomConstructor',
    initialState,
    reducers: {
        addPoint: (state, action: PayloadAction<Point>) => {
            state.history.push([...state.points]);
            state.points.push(action.payload);
        },
        updatePoint: (state, action: PayloadAction<{ index: number; point: Point }>) => {
            state.history.push([...state.points]);
            state.points[action.payload.index] = action.payload.point;
        },
        undo: (state) => {
            if (state.history.length > 0) {
                const prev = state.history.pop();
                if (prev) state.points = prev;
            }
        },
        deletePoint: (state, action: PayloadAction<number>) => {
            state.history.push([...state.points]);
            state.points.splice(action.payload, 1);
        },
        renamePoint: (state, action: PayloadAction<{ index: number; name: string }>) => {
            state.points[action.payload.index].name = action.payload.name;
        },
        clearPoints: (state) => {
            state.points = [];
            state.history = [];
        },
        setSelectedPoint: (state, action: PayloadAction<number | null>) => {
            state.selectedPointIndex = action.payload;
        },
        addDiagonal: (state, action: PayloadAction<{ from: number; to: number }>) => {
            const exists = state.diagonals.find(d =>
                (d.from === action.payload.from && d.to === action.payload.to) ||
                (d.to === action.payload.from && d.from === action.payload.to)
            );
            if (!exists) {
                state.diagonals.push(action.payload);
            }
        },
        deleteDiagonal: (state, action: PayloadAction<{ from: number; to: number }>) => {
            state.diagonals = state.diagonals.filter(d =>
                !((d.from === action.payload.from && d.to === action.payload.to) ||
                    (d.to === action.payload.from && d.from === action.payload.to))
            );
        },
        // Добавим редьюсер для обновления метрик (если нужно)
        updateMetrics: (state, action: PayloadAction<{
            area: number,
            perimeter: number,
            corners: number,
            lengths: { name: string; length: number }[]
        }>) => {
            state.area = action.payload.area;
            state.perimeter = action.payload.perimeter;
            state.corners = action.payload.corners;
            state.lengths = action.payload.lengths;
        }
    },
    extraReducers: builder => {
        builder.addCase(loadRoomFromDb.fulfilled, (state, action) => {
            const {
                diagonals, name,
                area, perimeter, corners, lengths
            } = action.payload;
            state.diagonals = diagonals || [];
            state.name = name;
            state.area = area;
            state.perimeter = perimeter;
            state.corners = corners;
            state.lengths = lengths;
        });
    },
});

export const {
    addPoint,
    updatePoint,
    deletePoint,
    undo,
    renamePoint,
    clearPoints,
    setSelectedPoint,
    deleteDiagonal,
    addDiagonal,
    updateMetrics,
} = roomConstructorSlice.actions;

export const pointsSelector = (state: RootState) => state.roomConstructor.points;
export const historySelector = (state: RootState) => state.roomConstructor.history;
export const selectedPointIndexSelector = (state: RootState) => state.roomConstructor.selectedPointIndex;
export const diagonalsSelector = (state: RootState) => state.roomConstructor.diagonals;
export const displayDiagonalsSelector = (state: RootState) => state.roomConstructor.displayDiagonals;
