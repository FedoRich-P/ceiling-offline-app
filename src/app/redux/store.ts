import { configureStore } from '@reduxjs/toolkit';
import { roomConstructorSlice } from './slices/roomConstructor';
import { toolsSlice } from './slices/tools';
import { markupSlice } from './slices/markup';

export const store = configureStore({
    reducer: {
        roomConstructor: roomConstructorSlice.reducer,
        tools: toolsSlice.reducer,
        markup: markupSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;