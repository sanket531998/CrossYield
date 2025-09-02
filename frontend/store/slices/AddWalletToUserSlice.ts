import { initialSliceState } from "@/types/sliceTypes";
import { ADD_WALLET_TO_USER, RELAYER_BASE_URL } from "@/utils/CONSTANTS";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState: initialSliceState = {
  state: "pending",
  data: null,
};

export const addWalletToUserAPICall = createAsyncThunk(
  "addWalletToUser/addWalletToUserAPICall",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${RELAYER_BASE_URL}/${ADD_WALLET_TO_USER}`,
        data
      );

      if (response.status !== 200) {
        throw new Error(`Error: ${response.statusText}`);
      }

      return response.data;
    } catch (error: any) {
      console.error("Error while adding wallet to user", error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addWalletToUserSlice = createSlice({
  name: "addWalletToUserSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addWalletToUserAPICall.pending, (state) => {
        state.state = "pending";
      })
      .addCase(addWalletToUserAPICall.fulfilled, (state, action) => {
        state.state = "fulfilled";
        state.data = action.payload;
      })
      .addCase(addWalletToUserAPICall.rejected, (state, action) => {
        state.state = "rejected";
        state.data = action.payload;
      });
  },
});

export default addWalletToUserSlice.reducer;
export const addWalletToUserState = (state: any) => state.addWalletToUser;
