import React from 'react'
import { IContest } from '../types';

export interface IContestRenew {
  contestName: string,
  round: string;
  contestType: string;
  isEducationalContest: boolean;
};

export default function contestDataRenewal(item: IContest): IContestRenew {
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

  const contest: IContestRenew = {
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
}
