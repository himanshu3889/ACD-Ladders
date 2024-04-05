import {useDispatch, useSelector} from "react-redux";
import {
  IProblemsSlice,
  setFilteredProblems,
  updateMultiOtherContestId,
  updateMultiProblemStatus,
} from "../problems/problemSlice";
import {IProblem} from "../../types";
import {IContestSlice} from "../contests/contestSlice";
import {IFilterSlice, updateFilter} from "../filters/filterSlice";
import {
  CFContestTypes,
  SortingOrders,
  StatusOptions,
  initialTagState,
} from "../filters/filterConstants";
import {IUserSlice} from "../user/userSlice";
import {ThunkDispatch} from "@reduxjs/toolkit";

export const problemsFilter = () => {
  const dispatch: ThunkDispatch<any, any, any> = useDispatch();
  const problemState: IProblemsSlice = useSelector(
    (state: any) => state.problems
  );
  const contestState: IContestSlice = useSelector(
    (state: any) => state.contests
  );

  const filtersState: IFilterSlice = useSelector((state: any) => state.filters);
  const userState: IUserSlice = useSelector((state: any) => state.user);

  function getSameProblemOtherContestId(
    problemContestRound: string,
    problemContestID: number
  ): number {
    const sameRoundContestIds: number[] =
      contestState.similarRoundDiv1Div2Contests[problemContestRound];
    let sameProblemOtherContestId: number = -1;
    if (sameRoundContestIds) {
      // Not using the loop here max length of the sameRoundContestIds is 2
      if (
        sameRoundContestIds.length > 0 &&
        sameRoundContestIds[0] !== problemContestID
      ) {
        sameProblemOtherContestId = sameRoundContestIds[0];
      }
      if (
        sameRoundContestIds.length > 1 &&
        sameRoundContestIds[1] !== problemContestID
      ) {
        sameProblemOtherContestId = sameRoundContestIds[1];
      }
    }
    return sameProblemOtherContestId;
  }

  // Use to update the indices of the array in the redux at once instead update one by one for fast filtering
  const problemStatusPending: Map<number, string> = new Map();
  const otherContestIdPending: Map<number, number> = new Map();

  function getProblemStatuses({
    index,
    problemName,
    problemContestID,
    problemContestRound,
  }: {
    index: number;
    problemName: string;
    problemContestID: number;
    problemContestRound: string;
  }) {
    let isSolved: boolean = false;
    let isAttempted: boolean = false;

    // If there is no user profile no need the status will be unsolved
    if (!userState.profile || problemContestID === -1) {
      problemStatusPending.set(index, StatusOptions.Unsolved);
      return {isSolved, isAttempted};
    }

    // Find the problems solved in other contest id
    const sameProblemOtherContestId: number = getSameProblemOtherContestId(
      problemContestRound,
      problemContestID
    );
    
    let isDidThroughOtherContest: boolean = false;
    if (filtersState.problemsSeenMaxCount >= index) {
      // Problem status is already found out
      isSolved = problemState.problemsStatus[index] === StatusOptions.Solved;
      isAttempted =
        problemState.problemsStatus[index] === StatusOptions.Attempted;
      isDidThroughOtherContest = problemState.otherContestId[index] !== -1;
    } else {
      // Need to found the problems status
      isSolved = !!(
        userState.userSolvedProblems[problemContestID] &&
        userState.userSolvedProblems[problemContestID][problemName]
      );

      if (!isSolved && sameProblemOtherContestId !== -1) {
        isSolved = !!(
          userState.userSolvedProblems[sameProblemOtherContestId] &&
          userState.userSolvedProblems[sameProblemOtherContestId][problemName]
        );
        isDidThroughOtherContest = isSolved;
      }

      isAttempted =
        !isSolved &&
        !!(
          userState.userAttemptedProblems[problemContestID] &&
          userState.userAttemptedProblems[problemContestID][problemName]
        );

      if (!isSolved && !isAttempted && sameProblemOtherContestId !== -1) {
        isAttempted = !!(
          userState.userAttemptedProblems[sameProblemOtherContestId] &&
          userState.userAttemptedProblems[sameProblemOtherContestId][
            problemName
          ]
        );
        isDidThroughOtherContest = isAttempted;
      }
    }
    if (isDidThroughOtherContest) {
      otherContestIdPending.set(index, sameProblemOtherContestId);
    }
    const problemStatus = isSolved
      ? StatusOptions.Solved
      : isAttempted
      ? StatusOptions.Attempted
      : StatusOptions.Unsolved;
    problemStatusPending.set(index, problemStatus);

    return {isSolved, isAttempted};
  }

  function hasSatisfyFilters(index: number): boolean {
    const problem: IProblem = problemState.allProblems?.problems[index];
    const problemIndex: string = problem?.index;
    const problemName: string = problem?.name;
    const problemRating: number = problem?.rating ?? 0;
    const problemContestID: number = problem?.contestId || -1;

    const problemContestType: string =
      contestState.allContests[problemContestID]?.contestType || "";
    const isProblemContestEducational: boolean =
      contestState.allContests[problemContestID]?.isEducationalContest || false;
    const problemContestRound: string =
      contestState.allContests[problemContestID]?.round || "";
    const problemSolvedCount: number =
      problemState.allProblems.problemStatistics[index]?.solvedCount || 0;

    // Find and set the problem status
    const {isSolved, isAttempted} = getProblemStatuses({
      index: index,
      problemName: problemName,
      problemContestID: problemContestID,
      problemContestRound: problemContestRound,
    });

    if (filtersState.currStatus === StatusOptions.Unsolved) {
      if (isSolved || isAttempted) {
        return false;
      }
    } else if (filtersState.currStatus === StatusOptions.Solved) {
      if (!isSolved) {
        return false;
      }
    } else if (filtersState.currStatus === StatusOptions.Attempted) {
      if (isSolved || !isAttempted) {
        return false;
      }
    }

    let hasSatisfy: boolean =
      filtersState.problemDifficultyRange[0] <= problemRating &&
      problemRating <= filtersState.problemDifficultyRange[1];

    hasSatisfy &&=
      filtersState.problemSolvedRange[0] <= problemSolvedCount &&
      problemSolvedCount <= filtersState.problemSolvedRange[1];

    hasSatisfy &&=
      problemIndex !== undefined &&
      problem.index[0] >= filtersState.problemIndexRange[0] &&
      problem.index[0] <= filtersState.problemIndexRange[1];

    hasSatisfy &&=
      filtersState.contestType === "" ||
      (isProblemContestEducational &&
        filtersState.contestType === CFContestTypes.Educational) ||
      problemContestType === filtersState.contestType;

    // If there is no user profile, status can't be solved or unsolved so will not satfisy the filters
    if (!userState.profile && filtersState.currStatus !== StatusOptions.All) {
      hasSatisfy &&= false;
    }

    if (!hasSatisfy) {
      return false;
    }

    let isIncludeTags: boolean = true;
    if (filtersState.isTagsExcluded) {
      isIncludeTags = true;
      for (const tag in initialTagState) {
        if (filtersState.tagState[tag] && problem?.tags?.includes(tag)) {
          isIncludeTags = false;
          break;
        }
      }
    } else if (filtersState.isTagsORLogicFiltered) {
      isIncludeTags = false;
      let isAnyTagSelected = false;
      for (const tag in initialTagState) {
        isAnyTagSelected ||= filtersState.tagState[tag];
        if (filtersState.tagState[tag] && problem?.tags?.includes(tag)) {
          isIncludeTags = true;
          break;
        }
      }
      if (!isAnyTagSelected) {
        isIncludeTags = true;
      }
    } else if (!filtersState.isTagsORLogicFiltered) {
      isIncludeTags = true;
      for (const tag in initialTagState) {
        if (filtersState.tagState[tag] && !problem?.tags?.includes(tag)) {
          isIncludeTags = false;
          break;
        }
      }
    }

    hasSatisfy &&= isIncludeTags;

    return hasSatisfy;
  }

  const handleFilter = async ({isNewFilter}: {isNewFilter: boolean}) => {
    let newProblems: number[] = [];
    const allProblemsCount: number =
      problemState.allProblems?.problems.length || 0;
    const oldProblemsCount: number = isNewFilter
      ? 0
      : problemState.filtered?.length || 0;
    let currIndex: number = isNewFilter ? 0 : filtersState.problemsSeenCount;
    const sortingOrder: string = filtersState.sortingOrder;
    
    while (
      currIndex < allProblemsCount &&
      newProblems.length + oldProblemsCount <
        filtersState.pageNumber * filtersState.problemsPerPage
    ) {
      let allProblemsActualIndex: number = currIndex;
      if (sortingOrder) {
        const newCurrIndex: number =
          sortingOrder === SortingOrders.ASC
            ? currIndex
            : allProblemsCount - 1 - currIndex;
        allProblemsActualIndex =
          filtersState.sortingParam === "Problem ID"
            ? problemState.sortedByIdAscOrder[newCurrIndex]
            : filtersState.sortingParam === "Difficulty"
            ? problemState.sortedByDifficultyAscOrder[newCurrIndex]
            : filtersState.sortingParam === "Score"
            ? problemState.sortedByScoreAscOrder[newCurrIndex]
            : problemState.sortedBySolvedByAscOrder[newCurrIndex];
      }

      if (hasSatisfyFilters(allProblemsActualIndex)) {
        newProblems.push(allProblemsActualIndex);
      }
      currIndex++;
    }
    // Set the problemsSeenCount states
    dispatch(
      updateFilter({
        problemsSeenCount: currIndex,
        problemsSeenMaxCount: userState.profile
          ? Math.max(filtersState.problemsSeenMaxCount, currIndex)
          : 0,
      })
    );
    if (isNewFilter) {
      // Set the page number to 1 after new filter and set filtered problems to the new problems
      dispatch(updateFilter({pageNumber: 1}));
      dispatch(setFilteredProblems(newProblems));
    } else {
      const calculatedPageNumber: number = Math.max(
        1,
        Math.ceil(
          (problemState.filtered.length + newProblems.length) /
            filtersState.problemsPerPage
        )
      );
      // set the calculated page number, useful when click on the last page
      if (filtersState.pageNumber > calculatedPageNumber) {
        dispatch(updateFilter({pageNumber: calculatedPageNumber}));
      }
      // Update the filtered problems
      dispatch(setFilteredProblems([...problemState?.filtered || [], ...newProblems]));
    }
    // Update the pending problems status
    dispatch(updateMultiProblemStatus(problemStatusPending));
    problemStatusPending.clear();
    // Update the peding problems other contest id
    dispatch(updateMultiOtherContestId(otherContestIdPending));
    otherContestIdPending.clear();
  };

  return {handleFilter};
};
