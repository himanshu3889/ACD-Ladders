import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
  CFContestTypes,
  problemsPerPage,
  SortingOrders,
  StatusOptions,
  initialTagState,
} from "./filterConstants";

export interface IFilterSlice {
  problemDifficultyRange: [number, number];
  problemIndexRange: [string, string];
  problemSolvedRange: [number, number];
  tagState: Record<string, boolean>;
  isTagsORLogicFiltered: boolean;
  isTagsExcluded: boolean;
  contestType: CFContestTypes | "";
  currStatus: StatusOptions;
  problemsSeenCount: number;
  problemsSeenMaxCount: number;
  sortingOrder: SortingOrders;
  pageNumber: number;
  problemsPerPage: number;
  sortingParam: string;
  filterProblemsSeenCount: number;
}

export interface IFiltersState {
  problemDifficultyRange: [number, number];
  problemIndexRange: [string, string];
  problemSolvedRange: [number, number];
  tagState: Record<string, boolean>;
  isTagsORLogicFiltered: boolean;
  isTagsExcluded: boolean;
  contestType: CFContestTypes | "";
  currStatus: StatusOptions;
}

const initialState: IFilterSlice = {
  problemDifficultyRange: [0, 5000],
  problemIndexRange: ["A", "Z"],
  problemSolvedRange: [0, 9999999999],
  tagState: initialTagState,
  isTagsORLogicFiltered: false,
  isTagsExcluded: false,
  contestType: "",
  currStatus: StatusOptions.All,
  problemsSeenCount: 0,
  problemsSeenMaxCount: 0,
  sortingOrder: SortingOrders.None,
  pageNumber: 1,
  problemsPerPage: problemsPerPage[0],
  sortingParam: "", 
  filterProblemsSeenCount: 0,
};

export const resetFiltersState: IFiltersState = {
  problemDifficultyRange: initialState.problemDifficultyRange,
  problemIndexRange: initialState.problemIndexRange,
  problemSolvedRange: initialState.problemSolvedRange,
  tagState: initialState.tagState,
  isTagsORLogicFiltered: initialState.isTagsORLogicFiltered,
  isTagsExcluded: initialState.isTagsExcluded,
  contestType: initialState.contestType,
  currStatus: initialState.currStatus,
};

export const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    resetFilters: () => initialState,
    updateFilter: (
      state: IFilterSlice,
      action: PayloadAction<Partial<IFilterSlice>>
    ) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    toggleTag: (state: IFilterSlice, action: PayloadAction<string>) => {
      const tagKey = action.payload;
      return {
        ...state,
        tagState: {
          ...state.tagState,
          [tagKey]: !state.tagState[tagKey], // Toggle the tag value
        },
      };
    },
  },
});

export const {resetFilters, updateFilter, toggleTag} = filterSlice.actions;

export default filterSlice.reducer;
