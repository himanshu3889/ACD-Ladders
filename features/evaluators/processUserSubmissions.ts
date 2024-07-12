import {IDateRangeFilter} from "../../components/analytics/cf/submissionAnalyticsChart/SubmissionAnalyticsChart";
import {PLATFORMS} from "../../configs/constants";
import {ISubmission} from "../../types";
import {IUserSolvedAttemptedProblems} from "../user/userSlice";

interface IPreProcessContests {
  platform: PLATFORMS;
  userSubmissions: ISubmission[];
  dateRange?: IDateRangeFilter;
}

export interface IProcessedCFUserSubmissions {
  userSolvedProblems: IUserSolvedAttemptedProblems;
  userAttemptedProblems: IUserSolvedAttemptedProblems;
}

export const processCFUserSubmissions = async ({
  platform,
  userSubmissions,
  dateRange,
}: IPreProcessContests): Promise<IProcessedCFUserSubmissions> => {
  const userSolvedProblems: IUserSolvedAttemptedProblems = {};
  const userAttemptedProblems: IUserSolvedAttemptedProblems = {};

  userSubmissions.forEach((item: ISubmission) => {
    const contestId: number | undefined = item.problem.contestId;
    const problemIndex: string = item.problem.index;
    const problemName: string = item.problem.name;
    const verdict: string | undefined = item.verdict;
    const submittedTime: number = item.creationTimeSeconds;
    const startTime = dateRange?.[0] ?? null;
    const endTime = dateRange?.[1] ?? null;
    if (
      (startTime && submittedTime < startTime) ||
      (endTime && submittedTime > endTime)
    ) {
      return;
    }

    if (contestId !== undefined) {
      if (verdict === "OK") {
        if (!userSolvedProblems[contestId]) {
          userSolvedProblems[contestId] = {};
        }
        userSolvedProblems[contestId][problemName] = problemIndex;
      } else {
        if (!userAttemptedProblems[contestId]) {
          userAttemptedProblems[contestId] = {};
        }
        userAttemptedProblems[contestId][problemName] = problemIndex;
      }
    }
  });
  return {userSolvedProblems, userAttemptedProblems};
};

export const preProcessUserSubmissionsHelper = async ({
  platform,
  userSubmissions,
}: IPreProcessContests): Promise<any> => {
  if (platform === PLATFORMS.CF || platform === PLATFORMS.ACD) {
    const result = await processCFUserSubmissions({
      platform: platform,
      userSubmissions: userSubmissions,
    });
    return result;
  }
};
