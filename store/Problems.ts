import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CODEFORCES_API } from "../pages/index";
import { IProblem, IProblemStatistics,IContest } from "../types";
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



const problemsStore = (set: any) => ({
  allProblems: null,
  filteredProblems: [],
  contestIdToName: {},

  setAllProblems: (problems: any) => set({ allProblems: problems }),
  removeAllProblems: () => set({ allProblems: null }),
  setFilteredProblems: (problems: any) => set({ filteredProblems: problems }),
  removeFilteredProblems: () => set({ filteredProblems: [] }),

  fetchAllProblemsAndContest: async () => {
    const problemsUrl:string = `${CODEFORCES_API}/problemset.problems`;
    const contestUrl:string = `${CODEFORCES_API}/contest.list`;

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

      const contestDataById: { [key: number]: string } = {};
      const contestData:IContestsResponseData = await contestResponse.json();
      contestData.result.forEach((item: IContest) => {
        const id:number = item.id;
        contestDataById[id] = item.name;
      });

      set({
        allProblems: problemsResult,
        contestIdToName: contestDataById,
      });
    } catch (error) {
      console.error("Error fetching problems data from Codeforces!:", error);
    }
  },
});

const useProblemsStore = create(
  persist(problemsStore, {
    name: "problems",
  })
);

export default useProblemsStore;
