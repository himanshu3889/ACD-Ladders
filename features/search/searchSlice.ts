import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export enum SearchType {
  Rolling = "rolling",
}

export interface ISearchSlice {
  isLoading: boolean;
  searchPattern: string;
  hasCaseSensitive: boolean;
  hasMatchOnlyWords: boolean;
  problemsSeenCount: number;
  isSearchOnAllProblems: boolean; 
}

const initialState: ISearchSlice = {
  searchPattern: "",
  problemsSeenCount: 0,
  hasCaseSensitive: false,
  hasMatchOnlyWords: false,
  isLoading: false,
  isSearchOnAllProblems: false,
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    resetSearch: () => {
      return initialState;
    },
    updateSearch: (
      state: ISearchSlice,
      action: PayloadAction<Partial<ISearchSlice>>
    ) => {
      state = {
        ...state,
        ...action.payload,
      };
      return state;
    },
  },
});

export const {resetSearch, updateSearch} = searchSlice.actions;

export default searchSlice.reducer;
