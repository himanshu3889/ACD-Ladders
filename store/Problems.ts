import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CODEFORCES_API } from "../pages/index";
import { IProblem, IProblemStatistics,IContest } from "../types";
import { toast } from "react-toastify";

interface IProblems{
  problems: IProblem[];
  problemStatistics: IProblemStatistics[];
};

interface IProblemsResponseData {
  result: {
    problems: IProblem[];
    problemStatistics: IProblemStatistics[];
  };
};

interface IContestsResponseData {
  result: IContest[];
}

interface IContestRenew {
  contestName: string,
  round: string;
  contestType: string;
  isEducationalContest: boolean;
};

  const problemFetchErrorNotify = () => {
    const screenWidth = window.innerWidth;
    const width = screenWidth <= 768 ? "70%" : "100%";
    toast.error("Unable to fetch problems !", {
      position: toast.POSITION.TOP_LEFT,
      pauseOnHover: false,
      style: {
        marginTop: "56px",
        width: width,
      },
      theme: "colored",
    });
  };


  const problemFetchSuccessNotify = () => {
    const screenWidth = window.innerWidth;
    const width = screenWidth <= 768 ? "70%" : "100%";
    toast.success("Problems fetched Successfully", {
      position: toast.POSITION.TOP_LEFT,
      pauseOnHover: false,
      style: {
        marginTop: "56px",
        width: width,
      },
      theme: "colored",
    });
  };


const getContestRenewData = (item: IContest): IContestRenew => {
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

      if (wordsIdx + 4 < wordsCount 
        && words[wordsIdx + 2] === "+" 
        && words[wordsIdx + 3] === "Div.") {
        contest.contestType += " + Div. " + words[wordsIdx + 4];
      }
    }
  }
  return contest;
};



const problemsStore = (set: any) => ({
  allProblems: null,
  hasProblemsFiltered: false,
  filteredProblems: [],
  problemsStatusSpacedOtherContestId: [], // 0:unsolved, 1:attempted , 2: solved
  allSortedProblemsByNameAsc: null,
  allSortedProblemsByDifficultyAsc: null,
  allSortedProblemsBySolvedCountAsc: null,
  contestData: null,
  similarRoundDiv1Div2Contests: null,
  hasFetchingProblems: false,

  setAllProblems: (problems: IProblems) => set({ allProblems: problems }),
  setHasProblemsFiltered: (value: boolean) =>
    set({ hasProblemsFiltered: value }),
  setFilteredProblems: (problems: number[]) =>
    set({ hasProblemsFiltered: true, filteredProblems: problems }),
  removeFiltering: async () =>
    set({
      hasProblemsFiltered: false,
      filteredProblems: [],
      problemsStatusSpacedOtherContestId: [],
    }),
  resetProblemsStatus: (length: number) =>
    set({ problemsStatusSpacedOtherContestId: Array(length).fill("Unsolved") }),

  fetchAllProblemsAndContest: async () => {
    const problemsUrl: string = `${CODEFORCES_API}/problemset.problems`;
    const contestUrl: string = `${CODEFORCES_API}/contest.list`;

    set({hasFetchingProblems:true})
    try {
      const [problemsResponse, contestResponse] = await Promise.all([
        fetch(problemsUrl),
        fetch(contestUrl),
      ]);

      if (!problemsResponse.ok) {
        throw new Error("Failed to fetch problems data from Codeforces!");
      }

      if (!contestResponse.ok) {
        throw new Error("Failed to fetch contests data from Codeforces!");
      }

      const problemsData: IProblemsResponseData = await problemsResponse.json();
      const problemsResult: IProblems = problemsData.result;

      const problemsCount: number = problemsResult.problems.length;
      const problemsStatusSpacedOtherContestId: string[] = new Array(problemsCount);
      const problemsSortedIndicesByNameAsc: number[] = new Array(problemsCount);
      const problemsSortedIndicesByDifficultyAsc: number[] = new Array(
        problemsCount
      );
      const problemsSortedIndicesBySolvedByAsc: number[] = new Array(
        problemsCount
      );
      for (let i = 0; i < problemsCount; i++) {
        problemsSortedIndicesByNameAsc[i] = i;
        problemsSortedIndicesByDifficultyAsc[i] = i;
        problemsSortedIndicesBySolvedByAsc[i] = i;
        problemsStatusSpacedOtherContestId[i] = "Unsolved";
      }

      // Extract the Contest Information
      const contestData: Record<number, IContestRenew> = {};
      const similarRoundDiv1Div2Contests: Record<string, number[]> = {};
      const contestsDataResult: IContestsResponseData =
        await contestResponse.json();

      contestsDataResult.result.forEach((item: IContest) => {
        const contestID: number = item.id;
        const contestRenewData:IContestRenew = getContestRenewData(item);
        const contestRound: string = contestRenewData.round;
        const contestType: string = contestRenewData.contestType;
        const isEducationalContest:boolean = contestRenewData.isEducationalContest
        contestData[contestID] = contestRenewData ;
        if (!isEducationalContest && ["Div. 1", "Div. 2"].includes(contestType)) {
            const currentIDs = similarRoundDiv1Div2Contests[contestRound] || [];
            currentIDs.push(contestID)
            similarRoundDiv1Div2Contests[contestRound] = currentIDs;
          }
      });


      set({
        allProblems: problemsResult,
        contestData: contestData,
        similarRoundDiv1Div2Contests:similarRoundDiv1Div2Contests,
        problemsStatusSpacedOtherContestId: problemsStatusSpacedOtherContestId
      });

      //  ---- Pre Sorting the Data ----
      
      problemsSortedIndicesByNameAsc.sort((a, b) => {
        const nameA = problemsResult.problems[a]?.name ?? "";
        const nameB = problemsResult.problems[b]?.name ?? "";
        return nameA.localeCompare(nameB);
      });
      
      problemsSortedIndicesByDifficultyAsc.sort((a, b) => {
        const ratingA = problemsResult.problems[a]?.rating ?? 0;
        const ratingB = problemsResult.problems[b]?.rating ?? 0;
        return ratingA - ratingB;
      });
      
      problemsSortedIndicesBySolvedByAsc.sort((a, b) => {
        const solvedByA = problemsResult.problemStatistics[a]?.solvedCount || 0;
        const solvedByB = problemsResult.problemStatistics[b]?.solvedCount || 0;
        return solvedByA - solvedByB;
      });
      
          
          set({
            allSortedProblemsByNameAsc: problemsSortedIndicesByNameAsc,
            allSortedProblemsByDifficultyAsc: problemsSortedIndicesByDifficultyAsc,
            allSortedProblemsBySolvedCountAsc: problemsSortedIndicesBySolvedByAsc,
          });
        problemFetchSuccessNotify();
        
        } catch (error) {
          problemFetchErrorNotify();
          set({ hasFetchingProblems: false });
          console.error(
            "Error fetching problems tempData from Codeforces!:",
            error
            );
          }

      set({ hasFetchingProblems: false });

        },
      });
      
const useProblemsStore = create(
  persist(problemsStore, {
    name: "problems",
    partialize: (state) =>
      Object.fromEntries(
        Object.entries(state).filter(
          ([key]) =>
            ![
              "hasProblemsFiltered",
              "filteredProblems",
              "problemsStatusSpacedOtherContestId",
            ].includes(key)
        )
      )
  })
);

export default useProblemsStore;
