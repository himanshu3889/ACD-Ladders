import {createSlice} from "@reduxjs/toolkit";
import {fetchAllContests} from "./contestAction";
import {IContestRenew, ISimilarRoundDiv1Div2Contests} from "../evaluators/processContests";

export interface IContestSlice {
  allContests: IContestRenew;
  similarRoundDiv1Div2Contests: ISimilarRoundDiv1Div2Contests;
  isError: boolean;
  isLoading: boolean;
  message: string;
  isPreprocessed: boolean;
}

const initialState: IContestSlice = {
  allContests: {},
  similarRoundDiv1Div2Contests: {},
  isError: false,
  isLoading: false,
  message: "",
  isPreprocessed: false,
};

export const contestsSlice = createSlice({
  name: "contests",
  initialState,
  reducers: {
    resetContests: (state: any) => initialState,
  },
  extraReducers: (builder: any) => {
    builder
      .addCase(fetchAllContests.pending, (state: any) => {
        state.isLoading = true;
      })
      .addCase(fetchAllContests.fulfilled, (state: any, action: any) => {
        state.isLoading = false;
        state.allContests = action.payload.contestData;
        state.similarRoundDiv1Div2Contests =
          action.payload.similarRoundDiv1Div2Contests;
        state.isPreprocessed = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(fetchAllContests.rejected, (state: any, action: any) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const {resetContests} = contestsSlice.actions;
export default contestsSlice.reducer;
