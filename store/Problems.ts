import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ACD_LADDERS_API, CODEFORCES_API } from "../pages/index";
import { IProblem, IProblemStatistics,IContest } from "../types";
import { toast } from "react-toastify";
import contestDataRenewal, { IContestRenew } from "../utils/contestDataRenewal";

interface IProblems{
  problems: IProblem[];
  problemStatistics: IProblemStatistics[];
};

interface IProblemsResponseData {
  result: {
    problems: IProblem[];
    problemStatistics: IProblemStatistics[];
  };

  data: IProblem[];
};

interface IContestsResponseData {
  result: IContest[];
}


  const problemFetchErrorNotify = (fetchingAPIName:string) => {
    const screenWidth = window.innerWidth;
    const width = screenWidth <= 768 ? "70%" : "100%";
    toast.error(`Unable to fetch problems from ${fetchingAPIName} !`, {
      position: toast.POSITION.TOP_LEFT,
      pauseOnHover: false,
      style: {
        marginTop: width === "70%" ? "56px" : "0px",
        width: width,
      },
      theme: "colored",
    });
  };


  const problemFetchSuccessNotify = (fetchingAPIName:string) => {
    const screenWidth = window.innerWidth;
    const width = screenWidth <= 768 ? "70%" : "100%";
    toast.success(`Problems fetched Successfully from ${fetchingAPIName}`, {
      position: toast.POSITION.TOP_LEFT,
      pauseOnHover: false,
      style: {
        marginTop: width === "70%" ? "56px" : "0px",
        width: width,
      },
      theme: "colored",
    });
  };



const problemsStore = (set: any) => ({
  allProblems: null,
  filteredProblems: [],
  problemsStatusSpacedOtherContestId: [], // 0:unsolved, 1:attempted , 2: solved
  allSortedProblemsByIdAsc: null,
  allSortedProblemsByDifficultyAsc: null,
  allSortedProblemsBySolvedCountAsc: null,
  allSortedProblemsByScoreAsc: null,
  contestData: null,
  similarRoundDiv1Div2Contests: null,
  hasFetchingProblems: false,

  setAllProblems: (problems: IProblems) => set({ allProblems: problems }),
  setFilteredProblems: (problems: number[]) =>
    set({ filteredProblems: problems }),
  removeFiltering: async () =>
    set({
      filteredProblems: [],
      problemsStatusSpacedOtherContestId: [],
    }),
  resetProblemsStatus: (length: number) =>
    set({ problemsStatusSpacedOtherContestId: Array(length).fill("Unsolved") }),

  fetchAllProblemsAndContest: async (
    isACDLaddersProblemsRequest: boolean = true
  ) => {
    const cfProblemsUrl: string = `${CODEFORCES_API}/problemset.problems`;
    const acdLaddersProblemsUrl: string = `${ACD_LADDERS_API}/all`;
    const contestUrl: string = `${CODEFORCES_API}/contest.list`;
    const fetchingAPIName: string = isACDLaddersProblemsRequest
      ? "ACD Ladders"
      : "Codeforces";

    set({ hasFetchingProblems: true });
    try {
      const [problemsResponse, contestResponse] = await Promise.all([
        isACDLaddersProblemsRequest
          ? fetch(acdLaddersProblemsUrl)
          : fetch(cfProblemsUrl),
        fetch(contestUrl),
      ]);

      if (!problemsResponse.ok) {
        throw new Error(
          `{Failed to fetch problems data from ${fetchingAPIName}!}`
        );
      }

      if (!contestResponse.ok) {
        throw new Error("Failed to fetch contests data from Codeforces!");
      }

      const problemsData: IProblemsResponseData = await problemsResponse.json();
      const problemsResult: IProblems = problemsData.result;

      const problemsCount: number = problemsResult.problems.length;
      const problemsStatusSpacedOtherContestId: string[] = new Array(
        problemsCount
      );
      const problemsSortedIndicesByIdAsc: number[] = new Array(problemsCount);
      const problemsSortedIndicesByDifficultyAsc: number[] = new Array(
        problemsCount
      );
      const problemsSortedIndicesBySolvedByAsc: number[] = new Array(
        problemsCount
      );
      const problemsSortedIndicesByScoreAsc: number[] = new Array(
        problemsCount
      );
      for (let i = 0; i < problemsCount; i++) {
        problemsSortedIndicesByIdAsc[i] = i;
        problemsSortedIndicesByDifficultyAsc[i] = i;
        problemsSortedIndicesBySolvedByAsc[i] = i;
        problemsSortedIndicesByScoreAsc[i] = i;
        problemsStatusSpacedOtherContestId[i] = "Unsolved";
      }

      // Extract the Contest Information
      const contestData: Record<number, IContestRenew> = {};
      const similarRoundDiv1Div2Contests: Record<string, number[]> = {};
      const contestsDataResult: IContestsResponseData =
        await contestResponse.json();

      contestsDataResult.result.forEach((item: IContest) => {
        const contestID: number = item.id;
        const contestRenewData: IContestRenew = contestDataRenewal(item);
        const contestRound: string = contestRenewData.round;
        const contestType: string = contestRenewData.contestType;
        const isEducationalContest: boolean =
          contestRenewData.isEducationalContest;
        contestData[contestID] = contestRenewData;
        if (
          !isEducationalContest &&
          ["Div. 1", "Div. 2"].includes(contestType)
        ) {
          const currentIDs = similarRoundDiv1Div2Contests[contestRound] || [];
          currentIDs.push(contestID);
          similarRoundDiv1Div2Contests[contestRound] = currentIDs;
        }
      });

      set({
        allProblems: problemsResult,
        contestData: contestData,
        similarRoundDiv1Div2Contests: similarRoundDiv1Div2Contests,
        problemsStatusSpacedOtherContestId: problemsStatusSpacedOtherContestId,
      });

      //  ---- Pre Sorting the Data ----

      problemsSortedIndicesByIdAsc.sort((a, b) => {
        const contestIdA = problemsResult?.problems[a]?.contestId || 0;
        const indexA = problemsResult.problems[a]?.index || "";

        const contestIdB = problemsResult?.problems[b]?.contestId || 0;
        const indexB = problemsResult.problems[b]?.index || "";

        if (contestIdA !== contestIdB) {
          return contestIdB - contestIdA;
        }

        return indexB.localeCompare(indexA);
      });

      problemsSortedIndicesByDifficultyAsc.sort((a, b) => {
        const ratingA = problemsResult.problems[a]?.rating ?? 0;
        const ratingB = problemsResult.problems[b]?.rating ?? 0;
        return ratingA - ratingB;
      });

      if (isACDLaddersProblemsRequest) {
        problemsSortedIndicesByScoreAsc.sort((a, b) => {
          const solvedByA = problemsResult.problems[a]?.frequency || 0;
          const solvedByB = problemsResult.problems[b]?.frequency || 0;
          return solvedByA - solvedByB;
        });
      } else
        problemsSortedIndicesBySolvedByAsc.sort((a, b) => {
          const solvedByA =
            problemsResult.problemStatistics[a]?.solvedCount || 0;
          const solvedByB =
            problemsResult.problemStatistics[b]?.solvedCount || 0;
          return solvedByA - solvedByB;
        });

      set({
        allSortedProblemsByIdAsc: problemsSortedIndicesByIdAsc,
        allSortedProblemsByDifficultyAsc: problemsSortedIndicesByDifficultyAsc,
        allSortedProblemsBySolvedCountAsc: problemsSortedIndicesBySolvedByAsc,
        allSortedProblemsByScoreAsc: problemsSortedIndicesByScoreAsc,
      });
      problemFetchSuccessNotify(fetchingAPIName);
    } catch (error) {
      problemFetchErrorNotify(fetchingAPIName);
      set({ hasFetchingProblems: false });
      console.error(
        `Error fetching problems tempData from ${fetchingAPIName}!:`,
        error
      );
    }

    set({ hasFetchingProblems: false });
    set({ hasFetchingProblems: false });

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
              "filteredProblems",
              "problemsStatusSpacedOtherContestId",
            ].includes(key)
        )
      )
  })
);

export default useProblemsStore;
