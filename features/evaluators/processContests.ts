import {PLATFORMS} from "../../configs/constants";
import {IContest} from "../../types";

export interface ICFContestRenewal {
  contestName: string;
  round: string;
  contestType: string;
  isEducationalContest: boolean;
}

interface IPreprocessContests {
  platform: PLATFORMS;
  contests: IContest[];
}

export type IContestRenew = Record<number, ICFContestRenewal>;
export type ISimilarRoundDiv1Div2Contests = Record<string, number[]>;

export const cFContestRenewal = async (
  item: IContest
): Promise<ICFContestRenewal> => {
  const contestName: string = item.name;
  const contestNameLength: number = contestName.length;
  const words: string[] = [];
  let prevIdx: number = 0;
  let currIdx: number = 0;

  while (prevIdx < contestNameLength) {
    while (
      currIdx < contestNameLength &&
      contestName[currIdx] !== " " &&
      contestName[currIdx] !== "(" &&
      contestName[currIdx] !== ")" &&
      contestName[currIdx] !== ","
    ) {
      currIdx++;
    }

    const word: string = contestName.slice(prevIdx, currIdx);
    words.push(word);
    currIdx++;
    prevIdx = currIdx;
  }

  const contest: ICFContestRenewal = {
    contestName: contestName,
    round: "",
    contestType: "",
    isEducationalContest: false,
  };

  if (words[0] === "Educational") {
    contest.isEducationalContest = true;
    contest.contestType = "Div. 2";
  }

  const wordsCount: number = words.length;
  for (let wordsIdx: number = 0; wordsIdx < wordsCount; wordsIdx++) {
    if (!contest.round && words[wordsIdx] === "Round") {
      contest.round = words[wordsIdx + 1];
    }
    if (!contest.contestType && words[wordsIdx] === "Div.") {
      contest.contestType = "Div. " + words[wordsIdx + 1];

      if (
        wordsIdx + 4 < wordsCount &&
        words[wordsIdx + 2] === "+" &&
        words[wordsIdx + 3] === "Div."
      ) {
        contest.contestType += " + Div. " + words[wordsIdx + 4];
      }
    }
  }
  return contest;
};

interface IPreprocessCFContests {
  contestData: IContestRenew;
  similarRoundDiv1Div2Contests: ISimilarRoundDiv1Div2Contests;
}
export const processCFContests = async ({
  platform,
  contests,
}: IPreprocessContests): Promise<IPreprocessCFContests> => {
  const contestData: IContestRenew = {};
  const similarRoundDiv1Div2Contests: ISimilarRoundDiv1Div2Contests = {};

  contests.forEach(async (item: IContest) => {
    const contestID: number = item.id;
    const contestRenewData: ICFContestRenewal = await cFContestRenewal(item);
    const contestRound: string = contestRenewData.round;
    const contestType: string = contestRenewData.contestType;
    const isEducationalContest: boolean = contestRenewData.isEducationalContest;
    contestData[contestID] = contestRenewData;
    if (!isEducationalContest && ["Div. 1", "Div. 2"].includes(contestType)) {
      const currentIDs = similarRoundDiv1Div2Contests[contestRound] || [];
      currentIDs.push(contestID);
      similarRoundDiv1Div2Contests[contestRound] = currentIDs;
    }
  });
  return {contestData, similarRoundDiv1Div2Contests};
};

export const preProcessContestsHelper = async ({
  platform,
  contests,
}: IPreprocessContests) => {
  if (platform === PLATFORMS.CF || PLATFORMS.ACD) {
    const result = await processCFContests({
      platform: platform,
      contests: contests,
    });
    return result;
  }
};
