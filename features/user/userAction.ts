import {AsyncThunk, createAsyncThunk} from "@reduxjs/toolkit";
import {PLATFORMS} from "../../configs/constants";
import {
  fetchCFUserProfileApi,
  fetchCFUserSubmissionsApi,
} from "../../service/codeforces";
import {ISubmission, IUser} from "../../types";
import {preProcessUserSubmissionsHelper} from "../evaluators/processUserSubmissions";

interface IUserArg {
  platform: PLATFORMS;
  userId: string;
}

type IUserProfileThunkReturnType = IUser;
export const fetchUserProfile: AsyncThunk<
  IUserProfileThunkReturnType,
  IUserArg,
  {}
> = createAsyncThunk(
  "user/fetchUserProfile",
  async (arg: IUserArg, thunkAPI: any) => {
    try {
      const platform = arg.platform;
      const userId = arg.userId;
      let response: any = [];
      let userProfile: IUser | null = null;
      if (platform === PLATFORMS.CF || platform === PLATFORMS.ACD) {
        response = await fetchCFUserProfileApi(userId);
        userProfile = response.result[0];
      }
      return userProfile;
    } catch (error: any) {
      const message =
        error.response?.data?.error || "Error fetching user profile";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

type IUserSubmissionsThunkReturnType = {
  userSolvedProblems: Record<number, Record<string, string>>;
  userAttemptedProblems: Record<number, Record<string, string>>;
};

export const fetchUserSubmissions: AsyncThunk<
  IUserSubmissionsThunkReturnType,
  IUserArg,
  {}
> = createAsyncThunk(
  "user/fetchUserSubmissions",
  async (arg: IUserArg, thunkAPI) => {
    try {
      const platform = arg.platform;
      const userId = arg.userId;
      let response: any = [];
      if (platform === PLATFORMS.CF || platform === PLATFORMS.ACD) {
        response = await fetchCFUserSubmissionsApi(userId);
      }
      const userSubmissions: ISubmission[] = response.result;
      const result = await preProcessUserSubmissionsHelper({
        platform: platform,
        userSubmissions: userSubmissions,
      });
      return result;
    } catch (error: any) {
      const message =
        error.response?.data?.error || "Error fetching user submissions";
      return thunkAPI.rejectWithValue(message);
    }
  }
);
