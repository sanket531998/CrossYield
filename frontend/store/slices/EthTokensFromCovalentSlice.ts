import { initialSliceState } from "@/types/sliceTypes";
import {
  ETH_TOKEN_BALANCES_COVALENT,
  RELAYER_BASE_URL,
} from "@/utils/CONSTANTS";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState: initialSliceState = {
  state: "pending",
  data: null,
};

export const ethTokensFromCovalentAPICall = createAsyncThunk(
  "ethTokensFromCovalent/ethTokensFromCovalentAPICall",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${RELAYER_BASE_URL}/${ETH_TOKEN_BALANCES_COVALENT}?userAddress=${data?.userAddress}&chainId=${data.chainId}`
      );

      if (response.status !== 200) {
        throw new Error(`Error: ${response.statusText}`);
      }

      return response.data;
    } catch (error: any) {
      console.error("Error fetching ETH tokens from Covalent API:", error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const ethTokensFromCovalentSlice = createSlice({
  name: "ethTokensFromCovalentSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(ethTokensFromCovalentAPICall.pending, (state) => {
        state.state = "pending";
      })
      .addCase(ethTokensFromCovalentAPICall.fulfilled, (state, action) => {
        state.state = "fulfilled";
        state.data = action.payload;
      })
      .addCase(ethTokensFromCovalentAPICall.rejected, (state, action) => {
        state.state = "rejected";
        state.data = action.payload;
      });
  },
});

export default ethTokensFromCovalentSlice.reducer;
export const selectEthTokensFromCovalentState = (state: any) =>
  state.ethTokensFromCovalent;
