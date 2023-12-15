import React from "react";
import useProblemsStore from "../store/Problems";
import useUserStore from "../store/User";
import { IProblem } from "../types";

type problemsFilterProps = {
  problemDifficultyRange: [number, number];
  problemIndexRange: [string, string];
  problemSolvedRange: [number, number];
  tagState: Record<string, boolean>;
  isTagsORLogicFiltered: boolean;
  isTagsExcluded: boolean;
  contestType: number;
  currStatus: number;
  allStatus: string[];
  allContestTypes: string[];
  problemsSeenCount: number;
  setProblemsSeenCount: React.Dispatch<React.SetStateAction<number>>;
  sortingOrder: number;
  sortingOrdersArr: string[];
  pageNumber: number;
  setPageNumber: React.Dispatch<React.SetStateAction<number>>;
  problemsPerPage: number;
  sortingParam: string;
};

export const problemsFilter = (props: problemsFilterProps) => {
  const {
    problemDifficultyRange,
    problemIndexRange,
    problemSolvedRange,
    tagState,
    isTagsORLogicFiltered,
    isTagsExcluded,
    contestType,
    currStatus,
    allStatus,
    allContestTypes,
    problemsSeenCount,
    sortingOrdersArr,
    sortingOrder,
    pageNumber,
    setPageNumber,
    problemsPerPage,
    sortingParam,
    setProblemsSeenCount,
  } = props;

  const {
    allProblems,
    allSortedProblemsByIdAsc,
    allSortedProblemsByDifficultyAsc,
    allSortedProblemsBySolvedCountAsc,
    allSortedProblemsByScoreAsc,
    problemsStatusSpacedOtherContestId,
    filteredProblems,
    setFilteredProblems,
    contestData,
    similarRoundDiv1Div2Contests,
  }: any = useProblemsStore();
  const { userProfile, userSolvedProblems, userAttemptedProblems }: any =
    useUserStore();

  function getSameProblemOtherContestId(
    problemContestRound: string,
    problemContestID: number
  ): number {
    const sameRoundContestIds: number[] =
      similarRoundDiv1Div2Contests[problemContestRound];
    let sameProblemOtherContestId: number = -1;
    if (sameRoundContestIds) {
      if (sameRoundContestIds.length === 2) {
        sameProblemOtherContestId =
          sameRoundContestIds[0] === problemContestID
            ? sameRoundContestIds[1]
            : sameRoundContestIds[0];
      } else if (
        sameRoundContestIds.length === 1 &&
        sameRoundContestIds[0] !== problemContestID
      ) {
        sameProblemOtherContestId = sameRoundContestIds[0];
      }
    }
    return sameProblemOtherContestId;
  }

  function hasSatisfyFilters(index: number): boolean {
    const problem: IProblem = allProblems?.problems[index];
    const problemIndex: string = problem?.index;
    const problemName: string = problem?.name;
    const problemRating: number = problem?.rating ?? 0;
    const problemContestID: number = problem?.contestId || -1;

    const problemContestType: string =
      contestData[problemContestID]?.contestType || "";
    const isProblemContestEducational: boolean =
      contestData[problemContestID]?.isEducationalContest || false;
    const problemContestRound: string =
      contestData[problemContestID]?.round || "";
    const problemSolvedCount: number =
      allProblems.problemStatistics[index]?.solvedCount || 0;

    // If UserProfile then find the problem status
    if (userProfile && problemContestID !== undefined) {
      const sameProblemOtherContestId: number = 
        getSameProblemOtherContestId(problemContestRound,problemContestID);

      let isDidThroughOtherContest: boolean = false;
      let isSolved: boolean =
        userSolvedProblems.has(problemContestID) &&
        userSolvedProblems.get(problemContestID)?.has(problemName);

      if (!isSolved && sameProblemOtherContestId !== -1) {
        isSolved =
          userSolvedProblems.has(sameProblemOtherContestId) &&
          userSolvedProblems.get(sameProblemOtherContestId)?.has(problemName);
        isDidThroughOtherContest = isSolved;
      }

      let isAttempted: boolean =
        !isSolved &&
        userAttemptedProblems.has(problemContestID) &&
        userAttemptedProblems.get(problemContestID)?.has(problemName);

      if (!isSolved && !isAttempted && sameProblemOtherContestId !== -1) {
        isAttempted =
          userAttemptedProblems.has(sameProblemOtherContestId) &&
          userAttemptedProblems.get(sameProblemOtherContestId)?.has(problemName);
        isDidThroughOtherContest = isAttempted;
      }

      // set the problems status 
      problemsStatusSpacedOtherContestId[index] = 
        isSolved
        ? "Solved"
        : isAttempted
        ? "Attempted"
        : "Unsolved";

      if (isDidThroughOtherContest) {
        problemsStatusSpacedOtherContestId[index] += " " + sameProblemOtherContestId;
      }

      if (allStatus[currStatus] === "Unsolved") {
        if (isSolved || isAttempted) {
          return false;
        }
      } else if (allStatus[currStatus] === "Solved") {
        if (!isSolved) {
          return false;
        }
      } else if (allStatus[currStatus] === "Attempted") {
        if (isSolved || !isAttempted) {
          return false;
        }
      }
    }

    let hasSatisfy: boolean =
      problemDifficultyRange[0] <= problemRating &&
      problemRating <= problemDifficultyRange[1];

    hasSatisfy &&=
      problemSolvedRange[0] <= problemSolvedCount &&
      problemSolvedCount <= problemSolvedRange[1];

    hasSatisfy &&=
      problemIndex !== undefined &&
      problem.index[0] >= problemIndexRange[0] &&
      problem.index[0] <= problemIndexRange[1];

    hasSatisfy &&=
      contestType === -1 ||
      (allContestTypes[contestType] === "Educational" &&
        isProblemContestEducational) ||
      problemContestType === allContestTypes[contestType];

    if (allStatus[currStatus] !== "All" && !userProfile) {
      hasSatisfy &&= false;
    }

    if (!hasSatisfy) {
      return false;
    }

    let isIncludeTags: boolean = true;
    if (isTagsExcluded) {
      isIncludeTags = true;
      for (const tag in tagState) {
        if (tagState[tag] && problem?.tags?.includes(tag)) {
          isIncludeTags = false;
          break;
        }
      }
    } else if (isTagsORLogicFiltered) {
      isIncludeTags = false;
      let isAnyTagSelected = false;
      for (const tag in tagState) {
        isAnyTagSelected ||= tagState[tag];
        if (tagState[tag] && problem?.tags?.includes(tag)) {
          isIncludeTags = true;
          break;
        }
      }
      if (!isAnyTagSelected) {
        isIncludeTags = true;
      }
    } else if (!isTagsORLogicFiltered) {
      isIncludeTags = true;
      for (const tag in tagState) {
        if (tagState[tag] && !problem?.tags?.includes(tag)) {
          isIncludeTags = false;
          break;
        }
      }
    }

    hasSatisfy &&= isIncludeTags;

    return hasSatisfy;
  }

  const handleFilter = async (isNewFilter: boolean) => {
    let newProblems: number[] = [];
    const allProblemsCount: number = allProblems?.problems.length || 0;
    const oldProblemsCount: number = 
      isNewFilter ? 0 : (filteredProblems?.length || 0);
    let currIndex: number = isNewFilter ? 0 : problemsSeenCount;
    const sortingType: string = sortingOrdersArr[sortingOrder];

    while (
      currIndex < allProblemsCount &&
      newProblems.length + oldProblemsCount < pageNumber * problemsPerPage
    ) {
      let allProblemsActualIndex: number = currIndex;
      if (sortingType) {
        const newCurrIndex: number =
          sortingType === "ASC" ? currIndex : (allProblemsCount - 1 - currIndex);
        allProblemsActualIndex =
          sortingParam === "Problem ID"
            ? allSortedProblemsByIdAsc[newCurrIndex]
            : sortingParam === "Difficulty"
            ? allSortedProblemsByDifficultyAsc[newCurrIndex]
            : sortingParam === "Score"
            ? allSortedProblemsByScoreAsc[newCurrIndex]
            : allSortedProblemsBySolvedCountAsc[newCurrIndex];
      }

      if (hasSatisfyFilters(allProblemsActualIndex)) {
        newProblems.push(allProblemsActualIndex);
      }
      currIndex++;
    }

    setProblemsSeenCount(currIndex);
    if (isNewFilter) {
      setPageNumber(1);
      setFilteredProblems(newProblems);
    } else {
      const calculatedPageNumber: number = 
        Math.max(1, Math.ceil((filteredProblems.length + newProblems.length) / problemsPerPage));
      if (pageNumber > calculatedPageNumber) {
        setPageNumber(calculatedPageNumber);
      }
      setFilteredProblems([...filteredProblems, ...newProblems]);
    }
  };

  async function handleNewFilter() {
    problemIndexRange[0] =
      problemIndexRange[0].length > 0 ? problemIndexRange[0] : "A";
    problemIndexRange[1] =
      problemIndexRange[1].length > 0 ? problemIndexRange[1] : "Z";

    problemDifficultyRange[0] =
      problemDifficultyRange[0] > 0 ? problemDifficultyRange[0] : 0;
    problemDifficultyRange[1] =
      problemDifficultyRange[1] > 0 ? problemDifficultyRange[1] : 5000;

    problemSolvedRange[0] =
      problemSolvedRange[0] > 0 ? problemSolvedRange[0] : 0;
    problemSolvedRange[1] =
      problemSolvedRange[1] > 0 ? problemSolvedRange[1] : 9999999999;

    await handleFilter(true);
  };

  return {
    handleNewFilter: handleNewFilter,
    handleFilter: handleFilter,
  };
};
