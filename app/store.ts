import {combineReducers, configureStore, Reducer} from "@reduxjs/toolkit";
import {persistStore, persistReducer} from "redux-persist";
import autoMergeLevel1 from "redux-persist/es/stateReconciler/autoMergeLevel1";
import storage from "redux-persist/lib/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import contestReducer, {IContestSlice} from "../features/contests/contestSlice";
import filterReducer, {IFilterSlice} from "../features/filters/filterSlice";
import problemReducer, {
  IProblemsSlice,
} from "../features/problems/problemSlice";
import userReducer, {IUserSlice} from "../features/user/userSlice";
import searchReducer, {ISearchSlice} from "../features/search/searchSlice";

export interface IRootReducerState {
  problems: IProblemsSlice;
  contests: IContestSlice;
  filters: IFilterSlice;
  user: IUserSlice;
  search: ISearchSlice;
}

const rootReducers: Reducer<IRootReducerState> = combineReducers({
  problems: problemReducer,
  contests: contestReducer,
  filters: filterReducer,
  user: userReducer,
  search: searchReducer,
});

const filterTransform = {
  in: (state: IFilterSlice) => {
    return {
      ...state,
      problemsSeenCount: 0,
      problemsSeenMaxCount: 0,
      pageNumber: 1,
    };
  },
  out: (state: IFilterSlice) => {
    return state;
  },
};

const contestTransform = {
  in: (state: IContestSlice) => {
    return {
      ...state,
      isError: false,
      isLoading: false,
      message: "",
    };
  },
  out: (state: IContestSlice) => {
    return state;
  },
};

const problemTransform = {
  in: (state: IProblemsSlice) => {
    return {
      ...state,
      isError: false,
      isLoading: false,
      message: "",
    };
  },
  out: (state: IProblemsSlice) => {
    return state;
  },
};

const userTransform = {
  in: (state: IUserSlice) => {
    return {
      ...state,
      profile: null,
      userSolvedProblems: {},
      userAttemptedProblems: {},
      isError: false,
      isLoadingSubmissions: false,
      isLoadingProfile: false,
      message: "",
    };
  },
  out: (state: IUserSlice) => {
    return state;
  },
};


const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel1,
  blacklist: ["search"], // blacklisting
  transforms: [
    filterTransform,
    problemTransform,
    contestTransform,
    userTransform,
  ],
};

const persistedReducer = persistReducer<ReturnType<typeof rootReducers>>(
  persistConfig,
  rootReducers
);

export const rootStore = configureStore({
  reducer: persistedReducer,
  // Ignore the warnings from large objects https://stackoverflow.com/questions/65217815/redux-handling-really-large-state-object
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

export const persistor = persistStore(rootStore);
