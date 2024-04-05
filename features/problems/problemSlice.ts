import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {PLATFORMS} from "../../configs/constants";
import {IProblems} from "../../types";
import {StatusOptions} from "../filters/filterConstants";
import {fetchAllProblems, preprocessProblems} from "./problemAction";

// number[] contains the indices from all problemsSlice
export interface IProblemsSlice {
  platform: PLATFORMS;
  allProblems: IProblems; // problems and problem statistics
  filtered: number[]; 
  problemsStatus: StatusOptions[]; // status of each problem in allProblems
  otherContestId: number[]; // For Same div1 and div2 round the higher index div2 problems are found in div1, -1: Not found
  sortedByIdAscOrder: number[];
  sortedByDifficultyAscOrder: number[];
  sortedByScoreAscOrder: number[];
  sortedBySolvedByAscOrder: number[];
  isError: boolean;
  isLoading: boolean;
  message: string;
  isPreprocessed: boolean;
}

const initialState: IProblemsSlice = {
  platform: PLATFORMS.ACD, // default platform for every user
  allProblems: {problems: [], problemStatistics: []},
  filtered: [],
  problemsStatus: [],
  otherContestId: [],
  sortedByIdAscOrder: [],
  sortedByDifficultyAscOrder: [],
  sortedByScoreAscOrder: [],
  sortedBySolvedByAscOrder: [],
  isError: false,
  isLoading: false,
  message: "",
  isPreprocessed: false,
};

export const problemsSlice = createSlice({
  name: "problems",
  initialState,
  reducers: {
    resetAllProblems: (state: any) => initialState,
    setFilteredProblems: (state: any, action: PayloadAction<number[]>) => {
      state.filtered = action.payload;
    },
    setPlatform: (state:any, action:PayloadAction<PLATFORMS>) => {
      state.platform = action.payload;
    },
    removeFiltering: (state: any) => {
      state.filtered = []; // TODO: WHEN USER REMOVED THE PROBLEMS ARE NOT SHOWING
      const allProblemsCount: number = state.allProblems?.problems?.length || 0;
      state.problemsStatus = new Array(allProblemsCount).fill(
        StatusOptions.Unsolved
      );
      state.otherContestId = new Array(allProblemsCount).fill(-1);
    },
    updateProblemStatus: (
      state,
      action: PayloadAction<{index: number; value: StatusOptions}>
    ) => {
      const {index, value} = action.payload;
      if (index >= 0 && index < state.problemsStatus.length) {
        state.problemsStatus[index] = value;
      }
    },
    updateMultiProblemStatus: (
      state,
      action: PayloadAction<Map<number, string>>
    ) => {
      const problemsStatusPending = action.payload;
      problemsStatusPending.forEach((value: any, index: number) => {
        if (index >= 0 && index < state.problemsStatus.length) {
          state.problemsStatus[index] = value;
        }
      });
    },
    updateOtherContestId: (
      state,
      action: PayloadAction<{index: number; value: number}>
    ) => {
      const {index, value} = action.payload;
      if (index >= 0 && index < state.otherContestId.length) {
        state.otherContestId[index] = value;
      }
    },
    updateMultiOtherContestId: (
      state,
      action: PayloadAction<Map<number, number>>
    ) => {
      const otherContestIdPending = action.payload;
      otherContestIdPending.forEach((value: any, index: number) => {
        if (index >= 0 && index < state.otherContestId.length) {
          state.otherContestId[index] = value;
        }
      });
    },
  },
  extraReducers: (builder: any) => {
    builder
      .addCase(fetchAllProblems.pending, (state: any) => {
        state.isLoading = true;
      })
      .addCase(fetchAllProblems.fulfilled, (state: any, action: any) => {
        state.isLoading = false;
        state.allProblems = action.payload.allProblems;
        // FILL THE problem status and other contest id array with default value
        const allProblemsCount: number =
          action.payload?.allProblems?.problems?.length || 0;
        state.problemsStatus = new Array(allProblemsCount).fill(
          StatusOptions.Unsolved
        );
        state.otherContestId = new Array(allProblemsCount).fill(-1);
        state.filtered = state.isError = false;
        state.message = "";
      })
      .addCase(fetchAllProblems.rejected, (state: any, action: any) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
    builder
      .addCase(preprocessProblems.pending, (state: any) => {
        state.isLoading = true;
      })
      .addCase(preprocessProblems.fulfilled, (state: any, action: any) => {
        state.isLoading = false;
        state.sortedByIdAscOrder = action.payload?.sortedByIdAsc || [];
        state.sortedByScoreAscOrder = action.payload?.sortedByScoreAsc || [];
        state.sortedByDifficultyAscOrder =
          action.payload?.sortedByDifficultyAsc || [];
        state.sortedBySolvedByAscOrder =
          action.payload?.sortedBySolvedByAsc || [];
        state.isError = false;
        state.message = "";
        state.isPreprocessed = true; // mark as preprocessed
      })
      .addCase(preprocessProblems.rejected, (state: any, action: any) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const {
  resetAllProblems,
  setPlatform,
  setFilteredProblems,
  removeFiltering,
  updateProblemStatus,
  updateMultiProblemStatus,
  updateOtherContestId,
  updateMultiOtherContestId,
} = problemsSlice.actions;
export default problemsSlice.reducer;
