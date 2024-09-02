import {AsyncThunk, createAsyncThunk} from "@reduxjs/toolkit";
import {PLATFORMS} from "../../configs/constants";
import {fetchCFContestsApi} from "../../service/codeforces";
import {IContest} from "../../types";
import {IContestRenew, preProcessContestsHelper} from "../evaluators/processContests";

interface IFetchAllContestsArg {
  platform: PLATFORMS;
}
type ContestsThunkReturnType = IContestRenew;
export const fetchAllContests: AsyncThunk<
  ContestsThunkReturnType,
  IFetchAllContestsArg,
  {}
> = createAsyncThunk(
  "problems/fetchContests",
  async (arg: IFetchAllContestsArg, thunkAPI: any) => {
    try {
      const platform = arg.platform;
      let response: any = [];
      if (platform === PLATFORMS.CF || platform === PLATFORMS.ACD) {
        response = await fetchCFContestsApi();
      }
      console.log({platform})
      console.log({response})
      const contests:IContest[] = response.result;
      const renewContests = await preProcessContestsHelper({
        platform: platform,
        contests: contests,
      });
      return renewContests;
    } catch (error: any) {
      const message = error.response?.data?.error || "Error fetching contests";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

