import { configureStore } from "@reduxjs/toolkit";

import loginSlice from './slices/loginSlice'
import postsSlice from './slices/postsSlice'

const store = configureStore({
    reducer: {
        loginSlice,
        postsSlice
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware(),
    devTools: process.env.NODE_ENV !== "production",
})

export default store;

// export type RootState = ReturnType<typeof store.getState>
// export type AppDispatch = typeof store.dispatch