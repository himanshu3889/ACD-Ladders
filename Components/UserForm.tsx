import React from "react";
import { useState } from "react";
import useUserStore from "../store/User";
import { CODEFORCES_API } from "../pages/index";
import { ISubmission, IUser } from "../types";
import useProblemsStore from "../store/Problems";
interface IUserInfoResponseData {
  result: IUser[];
}
interface IUserSubmissionsData {
  result: ISubmission[];
}

const UserForm = () => {
  const { allProblems, resetProblemsStatus, hasFetchingProblems }: any = useProblemsStore();
  const {
    setUser,
    removeUser,
    setUserSolvedProblems,
    setUserAttemptedProblems,
  }: any = useUserStore();

  const [userID, setUserID] = useState<string>("");
  const [hasFetchingUser, setHasFetchingUser] = useState<boolean>(false)

  const handleUserForm = async () => {
    if (hasFetchingProblems || hasFetchingUser){
      return ;
    }

    if (userID.length === 0) {
      resetProblemsStatus(allProblems.length);
      removeUser();
      return;
    }

    const userSubmissionsUrl: string = `${CODEFORCES_API}/user.status?handle=${userID}`;
    const userInfoUrl: string = `${CODEFORCES_API}/user.info?handles=${userID}`;
    
    setHasFetchingUser(true);
    try {
      const [submissionsResponse, userInfoResponse] = await Promise.all([
        fetch(userSubmissionsUrl),
        fetch(userInfoUrl),
      ]);

      if (!userInfoResponse.ok) {
        throw new Error("Failed to fetch user data from Codeforces!");
      }

      if (!submissionsResponse.ok) {
        throw new Error(
          "Failed to fetch user submissions data from Codeforces!"
        );
      }

      const submissionsData: IUserSubmissionsData =
        await submissionsResponse.json();
      const userInfoData: IUserInfoResponseData = await userInfoResponse.json();

      const userSubmissions: ISubmission[] = submissionsData.result;
      const userSolvedProblems = new Map<number, Map<string, string>>();
      const userAttemptedProblems = new Map<number, Map<string, string>>();

      userSubmissions.forEach((item: ISubmission) => {
        const contestId: number | undefined = item.problem.contestId;
        const problemIndex: string = item.problem.index;
        const problemName: string = item.problem.name;
        const verdict: string | undefined = item.verdict;

        if (contestId !== undefined) {
          if (verdict === "OK") {
            if (!userSolvedProblems.has(contestId)) {
              userSolvedProblems.set(contestId, new Map());
            }
            userSolvedProblems.get(contestId)!.set(problemName, problemIndex);
          } else {
            if (!userAttemptedProblems.has(contestId)) {
              userAttemptedProblems.set(contestId, new Map());
            }
            userAttemptedProblems.get(contestId)!.set(problemName, problemIndex);
          }
        }
      });

      const userInfo: IUser = userInfoData.result[0];

      setUserSolvedProblems(userSolvedProblems);
      setUserAttemptedProblems(userAttemptedProblems);
      setUser(userInfo);
    } catch (error) {
      resetProblemsStatus(allProblems.length);
      removeUser();
      setHasFetchingUser(false);
      console.error("Error fetching user data:", error);
    }

    setHasFetchingUser(false);
  };


  return (
    <div className="p-4">
      <div className="-space-x-2 mx-auto w-max relative">
        <input
          className={`${
            hasFetchingProblems && "cursor-wait"
          } peer bg-yellow-300 h-10 md:h-12 pl-4 text-lg font-semibold focus:bg-yellow-400 outline-none caret-blue-700`}
          type="text"
          name="userNameSearch"
          id="userNameSearch"
          placeholder="Enter UserID"
          disabled={hasFetchingProblems}
          onChange={(event) => {
            setUserID(event.target.value.trim());
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleUserForm();
            }
          }}
        />
        <button
          className={`${
            hasFetchingUser && "cursor-progress"
          } bg-blue-700 hover:bg-blue-800 text-white font-semibold text-lg h-10 md:h-12 px-10`}
          onClick={handleUserForm}
        >
          <i
            className={`fa-solid  ${
              !hasFetchingProblems
                ? !hasFetchingUser
                  ? "fa-search"
                  : "fa-search fa-beat-fade"
                : "fa-circle-notch fa-spin"
            }`}
          ></i>
        </button>
      </div>
    </div>
  );
};

export default UserForm;
