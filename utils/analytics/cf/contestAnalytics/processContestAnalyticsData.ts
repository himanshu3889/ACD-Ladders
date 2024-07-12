import {IContestStandings, IRankListRow} from "../../../../types";

export type IUsersHandleRank = {[handle: string]: number};

export type IProblemIndicesSubmissionsArrayRecord = {[key: string]: number[]};

interface IGetSubmissionCountByMinRecordProps {
  contestStandings: IContestStandings;
}

interface IGetSubmissionsCountMinuteArrayProps {
  contestStandings: IContestStandings;
  problemIndexNum: number;
}

interface IGetUsersSolvedSecondesForProblemIndexProps {
  problemIndexNum: number;
  contestStandings: IContestStandings;
  userHandlesContestStandingIndex: {[handle: string]: number};
}

interface IGetHandleStandingsInContestProps {
  contestStandings: IContestStandings;
  userHandles: string[];
}

export type IIndicesSolvedByUsersInSec = {
  [problemIndex: string]: IUsersHandleRank;
};

interface IGetProblemIndicesSolvedByUsersInSec {
  contestStandings: IContestStandings;
  userHandles: string[];
}

const getSubmissionsCountMinuteArray = ({
  contestStandings,
  problemIndexNum,
}: IGetSubmissionsCountMinuteArrayProps): number[] => {
  const contestDurationMinutes = Math.ceil(
    contestStandings.contest.durationSeconds / 60
  );
  const sumbmissionsCountMinuteArray: number[] = new Array(
    contestDurationMinutes + 1
  ).fill(0);

  contestStandings.rows.forEach(
    (contestStandingRow: IRankListRow, index: number) => {
      const problemIndexSubmissionTime: number =
        contestStandingRow.problemResults?.[problemIndexNum]
          ?.bestSubmissionTimeSeconds ?? -1;
      if (problemIndexSubmissionTime >= 0) {
        const submissionTimeMinuteCeil = Math.ceil(
          problemIndexSubmissionTime / 60
        );
        sumbmissionsCountMinuteArray[submissionTimeMinuteCeil]++;
      }
    }
  );

  for (let index = 1; index < sumbmissionsCountMinuteArray.length; index++) {
    const previousValue: number = sumbmissionsCountMinuteArray[index - 1];
    sumbmissionsCountMinuteArray[index] += previousValue;
  }

  return sumbmissionsCountMinuteArray;
};

export const getProblemIndicesSubmissionCountByMin = async ({
  contestStandings,
}: IGetSubmissionCountByMinRecordProps): Promise<IProblemIndicesSubmissionsArrayRecord> => {
  const problemIndexSubmissionsByMin: IProblemIndicesSubmissionsArrayRecord =
    {};
  const numProblems = contestStandings.problems.length;
  for (
    let problemIndexNum = 0;
    problemIndexNum < numProblems;
    problemIndexNum++
  ) {
    const problemIndex: string =
      contestStandings.problems[problemIndexNum].index;
    const submissionsByMinute = getSubmissionsCountMinuteArray({
      contestStandings: contestStandings,
      problemIndexNum: problemIndexNum,
    });
    problemIndexSubmissionsByMin[problemIndex] = submissionsByMinute;
  }
  return problemIndexSubmissionsByMin;
};

export const getHandlesRankInContest = ({
  contestStandings,
  userHandles,
}: IGetHandleStandingsInContestProps): IUsersHandleRank => {
  const usersHandleRank: IUsersHandleRank = {};
  const userHandlesSet: Set<string> = new Set(userHandles);

  contestStandings.rows.forEach((contestStandingRow: IRankListRow) => {
    const userHandle: string =
      contestStandingRow.party.members[0]?.handle ?? "";
    const userRank: number = contestStandingRow.rank;
    if (userHandlesSet.has(userHandle)) {
      usersHandleRank[userHandle] = userRank;
    }
  });
  return usersHandleRank;
};

const getProblemIndexSolvedByUsersInSec = ({
  problemIndexNum,
  contestStandings,
  userHandlesContestStandingIndex,
}: IGetUsersSolvedSecondesForProblemIndexProps) => {
  const usersSolvedTime: {[handle: string]: number} = {};
  for (const [handle, standingIndex] of Object.entries(
    userHandlesContestStandingIndex
  )) {
    const userProblemIndexSolvedTime: number =
      contestStandings.rows[standingIndex]?.problemResults?.[problemIndexNum]
        ?.bestSubmissionTimeSeconds ?? -1;
    if (userProblemIndexSolvedTime >= 0) {
      usersSolvedTime[handle] = userProblemIndexSolvedTime;
    }
  }
  return usersSolvedTime;
};

export const getProblemIndicesSolvedByUsersInSec = ({
  contestStandings,
  userHandles,
}: IGetProblemIndicesSolvedByUsersInSec): IIndicesSolvedByUsersInSec => {
  const indicesSolvedByUsersInSec: IIndicesSolvedByUsersInSec = {};
  const userHandlesContestStandingIndex: {[key: string]: number} = {};
  const userHandlesSet: Set<string> = new Set(userHandles);
  contestStandings.rows.forEach(
    (contestStandingRow: IRankListRow, standingIndex: number) => {
      const userHandle: string =
        contestStandingRow.party?.members?.[0]?.handle ?? "";
      if (userHandlesSet.has(userHandle)) {
        userHandlesContestStandingIndex[userHandle] = standingIndex;
      }
    }
  );
  const numProblems = contestStandings.problems.length;
  for (
    let problemIndexNum = 0;
    problemIndexNum < numProblems;
    problemIndexNum++
  ) {
    const problemIndex: string =
      contestStandings.problems[problemIndexNum].index;
    const usersProblemMinSolved = getProblemIndexSolvedByUsersInSec({
      problemIndexNum: problemIndexNum,
      contestStandings: contestStandings,
      userHandlesContestStandingIndex: userHandlesContestStandingIndex,
    });
    indicesSolvedByUsersInSec[problemIndex] = usersProblemMinSolved;
  }
  return indicesSolvedByUsersInSec;
};
