import {createSlice} from "@reduxjs/toolkit";
import {IUser} from "../../types";
import {fetchUserSubmissions, fetchUserProfile} from "./userAction";

export interface IUserSlice {
  profile: IUser | null;
  userSolvedProblems: Record<number, Record<string, string>>;
  userAttemptedProblems: Record<number, Record<string, string>>;
  isError: boolean;
  isLoadingSubmissions: boolean;
  isLoadingProfile: boolean;
  message: string;
}

const initialState: IUserSlice = {
  profile: null,
  userSolvedProblems: {},
  userAttemptedProblems: {},
  isError: false,
  isLoadingSubmissions: false,
  isLoadingProfile: false,
  message: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUser: (state: any) => initialState,
  },
  extraReducers: (builder: any) => {
    builder
      .addCase(fetchUserProfile.pending, (state: any) => {
        state.isLoadingProfile = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state: any, action: any) => {
        state.isLoadingProfile = false;
        state.profile = action.payload;
        state.isError = false;
        state.message = "";
      })
      .addCase(fetchUserProfile.rejected, (state: any, action: any) => {
        state.isLoadingProfile = false;
        state.isError = true;
        state.message = action.payload as string;
      });
    builder
      .addCase(fetchUserSubmissions.pending, (state: any) => {
        state.isLoadingSubmissions = true;
      })
      .addCase(fetchUserSubmissions.fulfilled, (state: any, action: any) => {
        state.isLoadingSubmissions = false;
        const {userSolvedProblems, userAttemptedProblems} = action.payload;
        state.userSolvedProblems = userSolvedProblems;
        state.userAttemptedProblems = userAttemptedProblems;
        state.isError = false;
        state.message = "";
      })
      .addCase(fetchUserSubmissions.rejected, (state: any, action: any) => {
        state.isLoadingSubmissions = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const {resetUser} = userSlice.actions;
export default userSlice.reducer;
