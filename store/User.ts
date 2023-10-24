import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IUser } from "../types";

const userStore = (set: any) => ({
  userProfile: null,
  userSolvedProblems: null,
  userAttemptedProblems: null,

  setUser: (user: IUser) => set({ userProfile: user }),
  removeUser: () =>
    set({
      userProfile: null,
      userSolvedProblems: null,
      userAttemptedProblems: null,
    }),
  setUserSolvedProblems: (problems: Map<number, Set<string>>) =>
    set({ userSolvedProblems: problems }),
  removeUserSolvedProblems: () => set({ userSolvedProblems: null }),
  setUserAttemptedProblems: (problems: Map<number, Set<string>>) =>
    set({ userAttemptedProblems: problems }),
  removeUserAttemptedProblems: () => set({ userAttemptedProblems: null }),
});

const useUserStore = create(
  persist(userStore, {
    name: "auth",
  })
);

export default useUserStore;
