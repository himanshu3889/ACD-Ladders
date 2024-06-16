import {AsyncThunk, createAsyncThunk} from "@reduxjs/toolkit";
import {PLATFORMS} from "../../configs/constants";
import {fetchACDLaddersProblemsApi} from "../../service/acdLadders";
import {fetchCFProblemsApi} from "../../service/codeforces";
import {IProblems} from "../../types";
import {preProcessProblemsHelper} from "../evaluators/processProblems";

interface IFetchAllProblemsArg {
  platform: PLATFORMS;
}
type ProblemsThunkReturnType = {
  platform: PLATFORMS;
};
export const fetchAllProblems: AsyncThunk<
  ProblemsThunkReturnType,
  IFetchAllProblemsArg,
  {}
> = createAsyncThunk(
  "problems/allProblems",
  async (arg: IFetchAllProblemsArg, thunkAPI: any) => {
    try {
      const platform = arg.platform;
      let response: any = [];
      if (platform === PLATFORMS.CF) {
        response = await fetchCFProblemsApi();
      } else if (platform === PLATFORMS.ACD) {
        response = await fetchACDLaddersProblemsApi();
      }
      return {platform: platform, allProblems: response.result};
    } catch (error: any) {
      const message = error.response?.data?.error || "Error fetching problems";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

interface IPreprocessProblemsArg {
  platform: PLATFORMS;
  problems: IProblems;
}
type IPreprocessProblems = any;
export const preprocessProblems: AsyncThunk<
  IPreprocessProblems,
  IPreprocessProblemsArg,
  {}
> = createAsyncThunk(
  "problems/pre-process-problems",
  async (arg: IPreprocessProblemsArg, thunkAPI: any) => {
    console.log("Preprocessing problems...");
    const result = await preProcessProblemsHelper({
      platform: arg.platform,
      problems: arg.problems,
    });
    console.log("Problems preprocessed")
    return result;
  }
);
