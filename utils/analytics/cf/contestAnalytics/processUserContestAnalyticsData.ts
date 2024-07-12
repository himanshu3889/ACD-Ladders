import {IUsersRankArrayMap} from "../../../../components/analytics/cf/contestAnalytics/contestAnalyticsUserRank/ContestAnalyticsUserRankChart";
import {
  IContestStandings,
  IProblemResult,
  IRankListRow,
} from "../../../../types";
import {IUsersHandleRank} from "./processContestAnalyticsData";
import {UserRanking} from "./userRanking";

export interface IGetUsersContestRankDataProps {
  contestStandings: IContestStandings;
  usersHandleRank: IUsersHandleRank;
}

type UserPoints = [number, number]; // [userIndexInContestStanding, userPoints]  : USER RANK STORE TO SAVE THE MEMORY
type MinuteData = UserPoints[];
type UserPointsMinuteArray = MinuteData[];

export const getUsersContestRankPerMinute = ({
  contestStandings,
  usersHandleRank,
}: IGetUsersContestRankDataProps): IUsersRankArrayMap => {
  if (!contestStandings) {
    return new Map<string, number[]>();
  }
  const contestUserHandles: string[] = Object.keys(usersHandleRank);
  const usersRankArrayMap: IUsersRankArrayMap = new Map<string, number[]>();
  const contestDurationInSec: number = Math.ceil(
    contestStandings?.contest.durationSeconds ?? 0
  );
  const contestDurationInMin: number = Math.ceil(contestDurationInSec / 60);
  const userPointsMinuteArray: UserPointsMinuteArray = Array(
    contestDurationInMin + 1
  )
    .fill([])
    .map(() => []);

  // Process each users data and move it to the particular minute range to process it minute by minute
  contestStandings?.rows.forEach(
    (userStanding: IRankListRow, userStandingIndex: number) => {
      userStanding.problemResults.forEach(
        (problemResults: IProblemResult, index: number) => {
          const problemSubmissionTimeInSec: number | null =
            problemResults?.bestSubmissionTimeSeconds ?? null;
          if (problemSubmissionTimeInSec !== null) {
            const problemSubmissionTimeInMin: number = Math.ceil(
              problemSubmissionTimeInSec / 60
            );
            const problemPoints: number = problemResults.points;
            userPointsMinuteArray[problemSubmissionTimeInMin].push([
              userStandingIndex,
              problemPoints,
            ]);
          }
        }
      );
    }
  );

  // Build the user rankings per minute
  const maxPoints: number = contestStandings?.rows[0].points ?? 0;
  const userRanking = new UserRanking(maxPoints);

  userPointsMinuteArray.forEach((minuteData, minute: number) => {
    minuteData.forEach(([contestStandingRowIndex, userPoints]) => {
      const userHandle: string =
        contestStandings?.rows?.[contestStandingRowIndex]?.party?.members?.[0]
          ?.handle ?? "";
      userRanking.updatePoints(userHandle, userPoints);
    });

    // Loop on each users to assign the rank at particular minute
    contestUserHandles.forEach((userHandle: string) => {
      const userActualRank: number = usersHandleRank?.[userHandle] ?? 0;
      const userCurrentRank: number | null =
        minute === contestDurationInMin
          ? userActualRank
          : userRanking.getRank(userHandle);
      const userNewRankData =
        usersRankArrayMap.get(userHandle) ??
        new Array(contestDurationInMin + 1).fill(0);
      if (userCurrentRank !== null) {
        userNewRankData[minute] = userCurrentRank;
        usersRankArrayMap.set(userHandle, userNewRankData);
      }
    });
  });
  return usersRankArrayMap;
};
