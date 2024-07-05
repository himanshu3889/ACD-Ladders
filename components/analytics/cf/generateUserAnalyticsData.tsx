import {PLATFORMS} from "../../../configs/constants";
import {getProblemStatus} from "../../../features/evaluators/problemFilter";
import {
  IPreprocessCFContests,
  processCFContests,
} from "../../../features/evaluators/processContests";
import {
  IProcessedCFUserSubmissions,
  processCFUserSubmissions,
} from "../../../features/evaluators/processUserSubmissions";
import {StatusOptions} from "../../../features/filters/filterConstants";
import {IUserSolvedAttemptedProblems} from "../../../features/user/userSlice";
import {ANALYTICS_TOTAL, UserAnalyticsKeys} from "../../../pages/analytics/cf";
import {IContest, ISubmission} from "../../../types";
import {IDateRangeFilter} from "./submissionAnalyticsChart/SubmissionAnalyticsChart";

export const generatePairs = (values: string[]) => {
  const pairs: [string, string][] = [];
  for (let i = 0; i < values.length; i++) {
    for (let j = i + 1; j < values.length; j++) {
      pairs.push([values[i], values[j]]);
    }
  }
  return pairs;
};

export const incrementTotalCount = (
  mainObject: any,
  key1: string,
  key2: string
) => {
  if (!mainObject[key1]) {
    mainObject[key1] = {};
  }
  if (!mainObject[key1][key2]) {
    mainObject[key1][key2] = {};
  }
  if (!mainObject[key1][key2][ANALYTICS_TOTAL]) {
    mainObject[key1][key2][ANALYTICS_TOTAL] = 0;
  }
  mainObject[key1][key2][ANALYTICS_TOTAL]++;
};

export const incrementNestedCount = (
  mainObject: any,
  key1: string,
  key2: string,
  key3: string,
  key4: string
) => {
  if (!mainObject[key1]) {
    mainObject[key1] = {};
  }
  if (!mainObject[key1][key2]) {
    mainObject[key1][key2] = {};
  }
  if (!mainObject[key1][key2][key3]) {
    mainObject[key1][key2][key3] = {};
  }
  if (!mainObject[key1][key2][key3][key4]) {
    mainObject[key1][key2][key3][key4] = 0;
  }
  mainObject[key1][key2][key3][key4]++;

  if (!mainObject[key3]) {
    mainObject[key3] = {};
  }
  if (!mainObject[key3][key4]) {
    mainObject[key3][key4] = {};
  }
  if (!mainObject[key3][key4][key1]) {
    mainObject[key3][key4][key1] = {};
  }
  if (!mainObject[key3][key4][key1][key2]) {
    mainObject[key3][key4][key1][key2] = 0;
  }
  mainObject[key3][key4][key1][key2]++;
};

const updateUserAnalyticsData = (
  userAnalyticsData: any,
  keys: string[],
  problemTags: string[],
  problemRating: number,
  problemStatus: StatusOptions,
  contestType: string,
  problemIndex: string,
  participantType: string,
  pairs: [string, string][]
) => {
  const getNextKey = (key: string) => {
    if (key === UserAnalyticsKeys.INDEX) {
      return problemIndex[0];
    }
    return key === UserAnalyticsKeys.RATING
      ? problemRating.toString()
      : key === UserAnalyticsKeys.STATUS
      ? problemStatus
      : key === UserAnalyticsKeys.CONTEST_TYPE
      ? contestType
      : key === UserAnalyticsKeys.PARTICIPANT_TYPE
      ? participantType
      : "";
  };

  // Increment the total count
  keys.forEach((key1: string) => {
    if (key1 === "tag") {
      problemTags.forEach((tag: string) => {
        incrementTotalCount(userAnalyticsData, key1, tag);
      });
    }
    const key2 = getNextKey(key1);
    incrementTotalCount(userAnalyticsData, key1, key2);
  });

  //  Update data for each pair
  pairs.forEach(([key1, key2]) => {
    if (key2 === "tag") {
      const tempKey = key1;
      key1 = key2;
      key2 = tempKey;
    }
    if (key1 === "tag") {
      problemTags.forEach((tag: string) => {
        incrementNestedCount(
          userAnalyticsData,
          key1,
          tag,
          key2,
          getNextKey(key2)
        );
      });
    } else {
      incrementNestedCount(
        userAnalyticsData,
        key1,
        getNextKey(key1),
        key2,
        getNextKey(key2)
      );
    }
  });
};

export const getUserAnalyticsData = async ({
  userSubmissions,
  contests,
  statusFilters,
  participantTypeFilters,
  dateRangeFilters,
}: {
  userSubmissions: ISubmission[];
  contests: IContest[];
  statusFilters: StatusOptions[];
  participantTypeFilters: string[];
  dateRangeFilters: IDateRangeFilter;
}) => {
  // processCFContests  process the contests
  const {contestData, similarRoundDiv1Div2Contests}: IPreprocessCFContests =
    await processCFContests({platform: PLATFORMS.CF, contests: contests});
  // processCFUserSubmissions process the user submissions
  const {
    userSolvedProblems,
    userAttemptedProblems,
  }: IProcessedCFUserSubmissions = await processCFUserSubmissions({
    platform: PLATFORMS.CF,
    userSubmissions: userSubmissions,
    dateRange: dateRangeFilters,
  });
  // enable maximum options in the graph

  const userAnalyticsData: any = Object.values(UserAnalyticsKeys).reduce(
    (acc, key) => {
      acc[key as UserAnalyticsKeys] = {};
      return acc;
    },
    {} as {[key in UserAnalyticsKeys]: any}
  );

  const keys = Object.keys(userAnalyticsData);
  const pairs = generatePairs(keys);

  const problemSeenSet: Set<string> = new Set();

  userSubmissions.forEach(async (submission: ISubmission) => {
    const contestId: number = submission?.contestId ?? -1;
    const problemRating: number = submission.problem?.rating ?? 0;
    if (!problemRating || contestId === -1 || !contestData[contestId]) {
      return; // go to next iteration
    }
    const problemIndex: string = submission.problem.index;
    const problemName: string = submission.problem.name;
    const problemTags: string[] = submission.problem?.tags ?? [];
    const participantType: string = submission.author.participantType;
    const contestType: string = contestData[contestId].contestType;
    const contestRound: string = contestData[contestId].round;

    // Apply the date range filter if any
    const submittedTime: number = submission.creationTimeSeconds;
    const startTime = dateRangeFilters?.[0] ?? null;
    const endTime = dateRangeFilters?.[1] ?? null;
    if (
      (startTime && submittedTime < startTime) ||
      (endTime && submittedTime > endTime)
    ) {
      return;
    }

    const {
      isSolved,
      isAttempted,
      isDidThroughOtherContest,
      sameProblemOtherContestId,
    } = getProblemStatus({
      problemName: problemName,
      problemContestID: contestId,
      problemContestRound: contestRound,
      similarRoundDiv1Div2Contests: similarRoundDiv1Div2Contests,
      userSolvedProblems: userSolvedProblems,
      userAttemptedProblems: userAttemptedProblems,
    });

    const problemStatuses: StatusOptions[] = [];

    const problemStatusPushHelper = (
      problemStatus: StatusOptions,
      userSolvedAttemptedProblem: IUserSolvedAttemptedProblems // change based on the problemStatus
    ) => {
      const uid1 = contestId + problemIndex + "_" + problemStatus;
      let uid2 = "";
      const sameProblemOtherContestIndex =
        userSolvedAttemptedProblem?.[sameProblemOtherContestId]?.[problemName];
      if (sameProblemOtherContestIndex) {
        uid2 =
          sameProblemOtherContestId +
          sameProblemOtherContestIndex +
          problemStatus;
      }
      if (!(problemSeenSet.has(uid1) || problemSeenSet.has(uid2))) {
        problemSeenSet.add(uid1);
        problemStatuses.push(problemStatus);
      }
    };

    if (isSolved) {
      const problemStatus: StatusOptions = StatusOptions.Solved;
      problemStatusPushHelper(problemStatus, userSolvedProblems);
    }
    if (isAttempted) {
      const problemStatus: StatusOptions = StatusOptions.Attempted;
      problemStatusPushHelper(problemStatus, userAttemptedProblems);
    }
    problemStatuses.map((problemStatus: StatusOptions) => {
      // check for the status filter
      if (statusFilters.length > 0 && !statusFilters.includes(problemStatus)) {
        return;
      }
      // check for the participant type filter
      if (
        participantTypeFilters.length > 0 &&
        !participantTypeFilters.includes(participantType)
      ) {
        return;
      }
      updateUserAnalyticsData(
        userAnalyticsData,
        keys,
        problemTags,
        problemRating,
        problemStatus,
        contestType,
        problemIndex,
        participantType,
        pairs
      );
    });
  });
  return userAnalyticsData;
};
