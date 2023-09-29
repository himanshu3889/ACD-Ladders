import React from 'react'
import { useEffect, useState } from 'react';
import useUserStore from "../store/User";
import { CODEFORCES_API } from "../pages/index";
import { ISubmission, IUser } from "../types";
interface IUserInfoResponseData {
  result : IUser[];
}
interface IUserSubmissionsData {
  result : ISubmission[];
}

const UserForm = () => {
  const { setUser, setUserSolvedProblems, setUserAttemptedProblems }: any = useUserStore();
  const [userName, setUserName] = useState<string>("HimanshuRajput") ;
  
  const handleUserForm = async () => {
    const userSubmissionsUrl: string = `${CODEFORCES_API}/user.status?handle=${userName}`;
    const userInfoUrl: string = `${CODEFORCES_API}/user.info?handles=${userName}`;

    try {
      const [submissionsResponse, userInfoResponse] = await Promise.all([
        fetch(userSubmissionsUrl),
        fetch(userInfoUrl),
      ]);

      if (!submissionsResponse.ok) {
        throw new Error(
          "Failed to fetch user submissions data from Codeforces!"
        );
      }

      if (!userInfoResponse.ok) {
        throw new Error("Failed to fetch user data from Codeforces!");
      }

      const submissionsData:IUserSubmissionsData = await submissionsResponse.json();
      const userInfoData:IUserInfoResponseData = await userInfoResponse.json();

      const userSubmissions:ISubmission[] = submissionsData.result;
      const userSolvedProblems = new Map<number, Set<string>>();
      const userAttemptedProblems = new Map<number, Set<string>>();

      userSubmissions.forEach((item: ISubmission) => {
        const contestId: number|undefined = item.problem.contestId;
        const problemIndex: string = item.problem.index;
        const verdict: string|undefined = item.verdict;

        if (contestId !== undefined){
          if (verdict === "OK") {
            if (!userSolvedProblems.has(contestId)) {
              userSolvedProblems.set(contestId, new Set());
            }
            userSolvedProblems.get(contestId)!.add(problemIndex);
          } else {
            if (!userAttemptedProblems.has(contestId)) {
              userAttemptedProblems.set(contestId, new Set());
            }
            userAttemptedProblems.get(contestId)!.add(problemIndex);
          }
        }
        
      });

      const userInfo:IUser = userInfoData.result[0];

      setUser(userInfo);
      setUserSolvedProblems(userSolvedProblems);
      setUserAttemptedProblems(userAttemptedProblems);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  
  useEffect(() => {
    if (userName){
        handleUserForm();
    };
  }, [userName])
  

  return (
    <div>UserForm</div>
  )
}


export default UserForm;
