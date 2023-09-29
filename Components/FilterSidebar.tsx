import React from "react";
import { useEffect, useState } from "react";
import useProblemsStore from "../store/Problems";
import useUserStore from "../store/User";
import { IProblem } from "../types";

const FilterSidebar = () => {
  const {
    allProblems,
    filteredProblems,
    removeFilteredProblems,
    contestIdToName,
    fetchAllProblemsAndContest,
  }: any = useProblemsStore();
  const { userProfile, userSolvedProblems, userAttemptedProblems }: any = useUserStore();

    const difficultyRange: [number, number] = [0, 4000];
    const solvedRange: [number, number] = [0, 99999999];
    const problemIndices: Set<string> = new Set();
    const allContestTypes: Array<string> = [
      "Div. 1 + Div. 2",
      "Div. 1",
      "Div. 2",
      "Div. 3",
      "Div. 4",
      "Educational"
    ];
  let contestType: number = 0;
  const tags: Set<string> = new Set();
  let isTagsTakenByOR: boolean = false;
  let isTagsExcluded: boolean = false;
  const allStatus: Array<string> = ["All", "Unsolved", "Solved", "Attempted"];
  const [status, setStatus] = useState<number>(0);
  const statusCount: Array<number> = [0, 0, 0, 0];
  const problemsPerPage: number = 25;
  const [pageNumber, setPageNumber] = useState<number>(1);


  function hasSatisfyFilters(idx: number): boolean {
    const problem: IProblem = allProblems.problems[idx];
    let problemSolvedCount: number = allProblems.problemStatistics[idx]?.solvedCount;

    if (userProfile && problem.contestId !== undefined) {
      const isSolved: boolean =
        userSolvedProblems[problem?.contestId] &&
        userSolvedProblems[problem?.contestId]?.has(problem.index);
        
      const isAttempted: boolean =
        userAttemptedProblems[problem?.contestId] &&
        userAttemptedProblems[problem?.contestId]?.has(problem.index);

      if (status === 1) {
        if (!isSolved && !isAttempted) {
          return false;
        }
      } else if (status === 2) {
        if (!isSolved) {
          return false;
        }
      } else if (status === 3) {
        if (!isAttempted) {
          return false;
        }
      }
    }

    let hasSatisfy: boolean =
      problem?.rating !== undefined &&
      difficultyRange[0] <= problem?.rating && problem?.rating <= difficultyRange[1];

    hasSatisfy &&=
      solvedRange[0] <= problemSolvedCount && problemSolvedCount <= solvedRange[1];

    hasSatisfy &&=
      problemIndices.size === 0 ||
      (problem?.index !== undefined && problemIndices?.has(problem.index));
    
      hasSatisfy &&=
      contestType === -1 ||
      (problem?.contestId !== undefined &&
        contestIdToName[problem?.contestId]?.includes(allContestTypes[contestType]));

    if (!hasSatisfy) {
      return false;
    }

    let isIncludeTags: boolean = true;
    if (isTagsTakenByOR) {
      isIncludeTags = false;
      for (const tag of problem?.tags) {
        if (tags?.has(tag)) {
          isIncludeTags = true;
          break;
        }
      }
    } else {
      isIncludeTags = true;
      for (const tag of tags) {
        if (!problem?.tags?.includes(tag)) {
          isIncludeTags = false;
          break;
        }
      }
    }

    if (!isTagsExcluded) {
      hasSatisfy &&= isIncludeTags;
    } else {
      hasSatisfy &&= !isIncludeTags;
    }

    return hasSatisfy;
  }


  const handleFilter = async () => {
    const allProblemsCount: number = allProblems.problems.length;
    let problemsDataIdx: number = 0;

    if (!userProfile) {
      while (
        filteredProblems.length < pageNumber * problemsPerPage &&
        problemsDataIdx < allProblemsCount
      ) {
        if (hasSatisfyFilters(problemsDataIdx)) {
          filteredProblems.push(problemsDataIdx);
        }
        problemsDataIdx++;
      }
    } else {
      while (
        statusCount[status] < pageNumber * problemsPerPage &&
        problemsDataIdx < allProblemsCount
      ) {
        if (hasSatisfyFilters(problemsDataIdx)) {
          filteredProblems.push(problemsDataIdx);
          statusCount[status] += 1;
        }
        problemsDataIdx++;
      }
    }
  };


  const handleNewFilter = async () => {
    setPageNumber(1);
    statusCount.fill(0);
    await removeFilteredProblems();
    await handleFilter();
  };


  useEffect(() => {
    const fetchData = async () => {
      await fetchAllProblemsAndContest();
    };
    fetchData();
  }, []);


  useEffect(() => {
    if (userProfile) {
      handleNewFilter();
    }
  }, [userProfile, status]);


  useEffect(() => {
    const fetchData = async () => {
      await handleFilter();
    };
    if (userProfile) {
      fetchData();
    }
  }, [pageNumber]);

  return <div> </div>;
};

export default FilterSidebar;
