import {PLATFORMS} from "../../configs/constants";
import {IProblems} from "../../types";

interface IPreProcessProblems {
  platform: PLATFORMS;
  problems: IProblems;
}

export const processCFProblems = async ({
  platform,
  problems,
}: IPreProcessProblems): Promise<{
  filtered: number[];
  sortedByIdAsc: number[];
  sortedByScoreAsc: number[];
  sortedByDifficultyAsc: number[];
  sortedBySolvedByAsc: number[];
}> => {
  const problemStatistics = problems.problemStatistics;
  const problemsCount: number = problems.problems.length;
  const filtered: number[] = new Array(problemsCount); // Initially mark all problems filtered
  const sortedByIdAsc: number[] = new Array(problemsCount);
  const sortedByDifficultyAsc: number[] = new Array(problemsCount);
  const sortedBySolvedByAsc: number[] = new Array(problemsCount);
  const sortedByScoreAsc: number[] = new Array(problemsCount);
  for (let i = 0; i < problemsCount; i++) {
    filtered[i] = i;
    sortedByIdAsc[i] = i;
    sortedByDifficultyAsc[i] = i;
    sortedBySolvedByAsc[i] = i;
    sortedByScoreAsc[i] = i;
  }

  //  ---- Pre Sorting the Data ----
  sortedByIdAsc.sort((a, b) => {
    const contestIdA: number = problems.problems[a]?.contestId || 0;
    const indexA: string = problems.problems[a]?.index || "";

    const contestIdB: number = problems.problems[b]?.contestId || 0;
    const indexB: string = problems.problems[b]?.index || "";

    if (contestIdA !== contestIdB) {
      return contestIdB - contestIdA;
    }

    return indexB.localeCompare(indexA);
  });

  sortedByDifficultyAsc.sort((a, b) => {
    const ratingA: number = problems.problems[a]?.rating ?? 0;
    const ratingB: number = problems.problems[b]?.rating ?? 0;
    return ratingA - ratingB;
  });

  if (platform === PLATFORMS.ACD) {
    sortedByScoreAsc.sort((a, b) => {
      const solvedByA: number = problems.problems[a]?.frequency || 0;
      const solvedByB: number = problems.problems[b]?.frequency || 0;
      return solvedByA - solvedByB;
    });
  } else
    sortedBySolvedByAsc.sort((a, b) => {
      const solvedByA: number = problemStatistics[a]?.solvedCount || 0;
      const solvedByB: number = problemStatistics[b]?.solvedCount || 0;
      return solvedByA - solvedByB;
    });

  return {
    filtered,
    sortedByIdAsc,
    sortedByScoreAsc,
    sortedByDifficultyAsc,
    sortedBySolvedByAsc,
  };
};

export const preProcessProblemsHelper = async ({
  platform,
  problems,
}: IPreProcessProblems): Promise<any> => {
  if (platform === PLATFORMS.CF || platform === PLATFORMS.ACD) {
    const result = await processCFProblems({
      platform: platform,
      problems: problems,
    });
    return result;
  }
};
