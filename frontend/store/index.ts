import { configureStore } from "@reduxjs/toolkit";
import ethTokensFromCovalentReducer from "./slices/EthTokensFromCovalentSlice";

export const store = configureStore({
  reducer: {
    ethTokensFromCovalent: ethTokensFromCovalentReducer,
  },
});

// Optional: types for TS
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
