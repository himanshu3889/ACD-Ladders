import {
  CF_ContestsUrl,
  CF_ProblemsUrl,
  CF_UserInfoUrl,
  CF_UserSubmissionUrl,
} from "../configs/constants";

export const fetchCFProblemsApi = async () => {
  try {
    const response: any = await fetch(CF_ProblemsUrl);
    const responseData: any = await response.json();
    return responseData;
  } catch (error) {
    throw error;
  }
};

export const fetchCFContestsApi = async () => {
  try {
    const response: any = await fetch(CF_ContestsUrl);
    const responseData: any = await response.json();
    return responseData;
  } catch (error) {
    throw error;
  }
};

export const fetchCFUserProfileApi = async (userId: string) => {
  if (!userId) {
    throw new Error("User Id is not provided");
  }
  const userInfoUrl = `${CF_UserInfoUrl}?handles=${userId}`;
  try {
    const response: any = await fetch(userInfoUrl);
    const responseData: any = await response.json();
    return responseData;
  } catch (error) {
    throw error;
  }
};

export const fetchCFUserSubmissionsApi = async (userId: string) => {
  if (!userId) {
    throw new Error("User Id is not provided");
  }
  const userContestUrl = `${CF_UserSubmissionUrl}?handle=${userId}`;
  try {
    const response: any = await fetch(userContestUrl);
    const responseData: any = await response.json();
    return responseData;
  } catch (error) {
    throw error;
  }
};
