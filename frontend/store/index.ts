import { configureStore } from "@reduxjs/toolkit";
import ethTokensFromCovalentReducer from "./slices/EthTokensFromCovalentSlice";
import addWalletToUserReducer from "./slices/AddWalletToUserSlice";

export const store = configureStore({
  reducer: {
    ethTokensFromCovalent: ethTokensFromCovalentReducer,
    addWalletToUser: addWalletToUserReducer,
  },
});

// Optional: types for TS
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
