import React from "react";
import { useState } from "react";
import useUserStore from "../store/User";
import { CODEFORCES_API } from "../pages/index";
import { ISubmission, IUser } from "../types";
import useProblemsStore from "../store/Problems";
import { toast } from "react-toastify";

interface IUserInfoResponseData {
  result: IUser[];
}
interface IUserSubmissionsData {
  result: ISubmission[];
}

const UserSearch = () => {
  const { allProblems, resetProblemsStatus, hasFetchingProblems }: any = useProblemsStore();
  const {
    setUser,
    removeUser,
    setUserSolvedProblems,
    setUserAttemptedProblems,
  }: any = useUserStore();

  const [userID, setUserID] = useState<string>("");
  const [hasFetchingUser, setHasFetchingUser] = useState<boolean>(false)
  const userErrorNotify = () => {
    const screenWidth = window.innerWidth;
    const width = screenWidth <= 768 ? "70%" : "100%";
    toast.error(`User Not Found : ${userID} `, {
      position: toast.POSITION.TOP_LEFT,
      theme: "colored",
      pauseOnHover: false,
      style: {
        marginTop: width === "70%" ? "56px" : "0px",
        width: width,
      },
      toastId: userID,
    });
  };

  const updateUserErrorNotify = () =>
    toast.update(userID, { type: toast.TYPE.ERROR, autoClose: 1800 });

    const userSuccessNotify = () => {
      const screenWidth = window.innerWidth;
      const width = screenWidth <= 768 ? "70%" : "100%";
      toast.success(`User Found : ${userID}`, {
        position: toast.POSITION.TOP_LEFT,
        theme: "colored",
        pauseOnHover: false,
        style: {
          marginTop: width === "70%" ? "56px" : "0px",
          width: width,
        },
        toastId: userID,
      });
    };

  const handleUserForm = async () => {
    if (hasFetchingUser) {
      return;
    }

    if (userID.length === 0) {
      resetProblemsStatus(allProblems?.length || 0);
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
      userSuccessNotify()
    } catch (error) {
      userErrorNotify();
      updateUserErrorNotify();
      resetProblemsStatus(allProblems?.length || 0);
      removeUser();
      setHasFetchingUser(false);
      console.error("Error fetching user data:", error);
    }

    setHasFetchingUser(false);
  };


  return (
    <div className="p-0.5">
      <div className="-space-x-2 mx-auto sm:w-max relative">
        <input
          className={`${
            hasFetchingUser && "cursor-wait"
          } peer bg-yellow-300 h-10 w-1/2 sm:w-auto md:h-12 p-4 text-lg font-semibold focus:bg-yellow-400 outline-none caret-blue-700`}
          type="text"
          name="userNameSearch"
          id="userNameSearch"
          placeholder="Enter UserID"
          disabled={hasFetchingUser}
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
          } bg-blue-700 hover:bg-blue-800 text-white font-semibold text-lg h-10 md:h-12 px-4 sm:px-10`}
          onClick={handleUserForm}
        >
          <i
            className={`fa-solid  ${
              !hasFetchingUser ? "fa-search" : "fa-circle-notch fa-spin"
            }`}
          ></i>
        </button>
      </div>
    </div>
  );
};

export default UserSearch;
