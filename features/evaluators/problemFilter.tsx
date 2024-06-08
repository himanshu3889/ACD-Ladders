import {useDispatch, useSelector} from "react-redux";
import {
  IProblemsSlice,
  setFilteredProblems,
  setSearchedProblems,
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
import {searchMatch} from "rolling-search";
import {ISearchSlice, updateSearch} from "../search/searchSlice";
import {IRootReducerState} from "../../app/store";

interface IHandleSearchWithFilter {
  isNewSearch: boolean;
}

export const problemsFilter = () => {
  const dispatch: ThunkDispatch<any, any, any> = useDispatch();
  const problemState: IProblemsSlice = useSelector(
    (state: IRootReducerState) => state.problems
  );
  const contestState: IContestSlice = useSelector(
    (state: IRootReducerState) => state.contests
  );

  const filtersState: IFilterSlice = useSelector(
    (state: IRootReducerState) => state.filters
  );
  const userState: IUserSlice = useSelector(
    (state: IRootReducerState) => state.user
  );
  const searchState: ISearchSlice = useSelector(
    (state: IRootReducerState) => state.search
  );

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
        userState.userAttemptedProblems[sameProblemOtherContestId][problemName]
      );
      isDidThroughOtherContest = isAttempted;
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

  async function updateProblemsStatus({
    startIndex,
    endIndex,
    reupdate,
  }: {
    startIndex: number;
    endIndex: number;
    reupdate: boolean;
  }) {
    const reqStartIndex = reupdate
      ? startIndex
      : filtersState.problemsSeenMaxCount;
    const reqEndIndex = Math.min(
      problemState.allProblems.problems.length - 1,
      endIndex
    );
    for (let index = reqStartIndex; index <= reqEndIndex; index++) {
      const problem = problemState.allProblems.problems[index];
      const problemContestID: number = problem?.contestId || -1;
      const problemContestRound: string =
        contestState.allContests[problemContestID]?.round || "";
      getProblemStatuses({
        index: index,
        problemName: problem.name,
        problemContestID: problemContestID,
        problemContestRound: problemContestRound,
      });
    }

    // Update the pending problems status
    dispatch(updateMultiProblemStatus(problemStatusPending));
    problemStatusPending.clear();
    // Update the peding problems other contest id
    dispatch(updateMultiOtherContestId(otherContestIdPending));
    otherContestIdPending.clear();
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
    const isSolved =
      problemState.problemsStatus[index] === StatusOptions.Solved;
    const isAttempted =
      problemState.problemsStatus[index] === StatusOptions.Attempted;

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
    // console.log(filtersState.problemDifficultyRange, problemRating)

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
      dispatch(
        setFilteredProblems([...(problemState?.filtered || []), ...newProblems])
      );
    }
  };

  const handleSearchWithFilter = async ({
    isNewSearch,
  }: IHandleSearchWithFilter) => {
    let newFilteredProblems: number[] = [];
    let newSearchedProblems: number[] = [];
    const allProblemsCount: number =
      problemState.allProblems?.problems.length || 0;
    // count the searchedProblems
    const oldSearchedProblemsCount: number = isNewSearch
      ? 0
      : problemState.searched?.length || 0;

    const oldFilteredProblemsCount: number = isNewSearch
      ? 0
      : problemState.filtered.length;

    // check from the filtered problems first
    let filteredIndex = isNewSearch ? 0 : filtersState.filterProblemsSeenCount;

    while (
      filteredIndex < oldFilteredProblemsCount &&
      newSearchedProblems.length + oldSearchedProblemsCount <
        filtersState.pageNumber * filtersState.problemsPerPage
    ) {
      const allProblemsActualIndex = problemState.filtered[filteredIndex];
      const problem = problemState.allProblems.problems[allProblemsActualIndex];
      const problemName = problem.name;
      const problemIndex: string = problem?.index;
      const problemContestID: number = problem?.contestId || -1;
      const problemId: string = problemContestID + problemIndex;
      // check if the problem contiain the pattern or not
      let hasPattern: boolean = await searchMatch({
        text: problemName,
        pattern: searchState.searchPattern,
        hasCaseSensitive: searchState.hasCaseSensitive,
        hasMatchOnlyWords: searchState.hasMatchOnlyWords,
      });
      if (problemContestID !== -1) {
        hasPattern ||= await searchMatch({
          text: problemId,
          pattern: searchState.searchPattern,
          hasCaseSensitive: searchState.hasCaseSensitive,
          hasMatchOnlyWords: searchState.hasMatchOnlyWords,
        });
      }

      if (hasPattern) {
        newSearchedProblems.push(allProblemsActualIndex);
      }
      filteredIndex++;
    }

    // Continue search from all problems
    let currIndex: number = isNewSearch ? 0 : filtersState.problemsSeenCount;
    const sortingOrder: string = filtersState.sortingOrder;
    while (
      currIndex < allProblemsCount &&
      newSearchedProblems.length + oldSearchedProblemsCount <
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
        newFilteredProblems.push(allProblemsActualIndex);
        const problem =
          problemState.allProblems.problems[allProblemsActualIndex];
        const problemName = problem.name;
        const problemIndex: string = problem?.index;
        const problemContestID: number = problem?.contestId || -1;
        const problemId: string = problemContestID + problemIndex;
        let hasPattern: boolean = await searchMatch({
          text: problemName,
          pattern: searchState.searchPattern,
          hasCaseSensitive: searchState.hasCaseSensitive,
          hasMatchOnlyWords: searchState.hasMatchOnlyWords,
        });
        if (problemContestID !== -1) {
          hasPattern ||= await searchMatch({
            text: problemId,
            pattern: searchState.searchPattern,
            hasCaseSensitive: searchState.hasCaseSensitive,
            hasMatchOnlyWords: searchState.hasMatchOnlyWords,
          });
        }
        if (hasPattern) {
          newSearchedProblems.push(allProblemsActualIndex);
        }
      }
      currIndex++;
      filteredIndex++; // mark current as seen
    }
    // Set the problemsSeenCount states
    dispatch(
      updateFilter({
        filterProblemsSeenCount: filteredIndex,
        problemsSeenCount: currIndex,
      })
    );
    if (isNewSearch) {
      // Set the page number to 1 after new filter and set filtered problems to the new problems
      dispatch(updateFilter({pageNumber: 1}));
      dispatch(setSearchedProblems(newSearchedProblems));
    } else {
      const calculatedPageNumber: number = Math.max(
        1,
        Math.ceil(
          (problemState.searched.length + newSearchedProblems.length) /
            filtersState.problemsPerPage
        )
      );
      // set the calculated page number, useful when click on the last page
      if (filtersState.pageNumber > calculatedPageNumber) {
        dispatch(updateFilter({pageNumber: calculatedPageNumber}));
      }
      // Add the searched problems
      dispatch(
        setSearchedProblems([
          ...(problemState?.searched || []),
          ...newSearchedProblems,
        ])
      );
    }
    // Add the filtered problems
    dispatch(
      setFilteredProblems([
        ...(problemState?.filtered || []),
        ...newFilteredProblems,
      ])
    );
  };

  const handleSearchWtihoutFilters = async ({
    isNewSearch,
  }: IHandleSearchWithFilter) => {
    const allProblemsCount: number =
      problemState.allProblems?.problems.length || 0;

    const oldSearchedProblemsCount: number = isNewSearch
      ? 0
      : problemState.searched?.length || 0;
    let currIndex = isNewSearch ? 0 : searchState.problemsSeenCount;
    let newSearchedProblems: number[] | any[] = [];
    while (
      currIndex < allProblemsCount &&
      newSearchedProblems.length + oldSearchedProblemsCount <
        filtersState.pageNumber * filtersState.problemsPerPage
    ) {
      const problem = problemState.allProblems.problems[currIndex];
      const problemName = problem.name;
      const problemIndex: string = problem?.index;
      const problemContestID: number = problem?.contestId || -1;
      const problemId: string = problemContestID + problemIndex;
      let hasPattern: boolean = await searchMatch({
        text: problemName,
        pattern: searchState.searchPattern,
        hasCaseSensitive: searchState.hasCaseSensitive,
        hasMatchOnlyWords: searchState.hasMatchOnlyWords,
      });
      if (problemContestID !== -1) {
        hasPattern ||= await searchMatch({
          text: problemId,
          pattern: searchState.searchPattern,
          hasCaseSensitive: searchState.hasCaseSensitive,
          hasMatchOnlyWords: searchState.hasMatchOnlyWords,
        });
      }
      if (hasPattern) {
        newSearchedProblems.push(currIndex);
      }
      currIndex++;
    }

    dispatch(updateSearch({problemsSeenCount: currIndex}));

    if (isNewSearch) {
      // Reset to the newProblems
      dispatch(setSearchedProblems(newSearchedProblems));
      dispatch(updateFilter({pageNumber: 1}));
    } else {
      const calculatedPageNumber: number = Math.max(
        1,
        Math.ceil(
          (problemState.searched.length + newSearchedProblems.length) /
            filtersState.problemsPerPage
        )
      );
      // set the calculated page number, useful when click on the last page
      if (filtersState.pageNumber > calculatedPageNumber) {
        dispatch(updateFilter({pageNumber: calculatedPageNumber}));
      }
      // Add the searched problems
      dispatch(
        setSearchedProblems([
          ...(problemState?.searched || []),
          ...newSearchedProblems,
        ])
      );
    }
  };

  return {
    handleFilter,
    handleSearchWithFilter,
    handleSearchWtihoutFilters,
    updateProblemsStatus,
  };
};
