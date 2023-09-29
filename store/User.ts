import {create} from "zustand";
import { persist } from "zustand/middleware";

const userStore = (set: any) => ({
  userProfile: null,
  userSolvedProblems: null,
  userAttemptedProblems: null,

  setUser: (user: any) => set({ userProfile: user }),
  removeUser: () => set({ userProfile: null }),
  setUserSolvedProblems: (problems: any) =>  set({ userSolvedProblems: problems }),
  removeUserSolvedProblems: () => set({ userSolvedProblems: null }),
  setUserAttemptedProblems: (problems: any) => set({ userAttemptedProblems: problems }),
  removeUserAttemptedProblems: () => set({ userAttemptedProblems: null }),
});

const useUserStore = create(
  persist(userStore, {
    name: "auth",
  })
);

export default useUserStore;
