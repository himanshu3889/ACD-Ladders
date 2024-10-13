import axios from "axios";
import {
  CF_ContestRatingChangesUrl,
  CF_ContestStandingsUrl,
  CF_ContestsUrl,
  CF_ProblemsUrl,
  CF_UserInfoUrl,
  CF_UserRatingChangeUrl,
  CF_UserSubmissionUrl,
} from "../configs/constants";

export const fetchCFProblemsApi = async () => {
  try {
    const response = await axios.get(CF_ProblemsUrl);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchCFContestsApi = async () => {
  try {
    const response = await axios.get(CF_ContestsUrl);
    return response.data;
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
    const response = await axios.get(userInfoUrl);
    return response.data;
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
    const response = await axios.get(userContestUrl);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchCFUserRatingChangeApi = async (userId: string) => {
  if (!userId) {
    throw new Error("User Id is not provided");
  }
  const userRatingChangeUrl = `${CF_UserRatingChangeUrl}?handle=${userId}`;
  try {
    const response = await axios.get(userRatingChangeUrl);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchContestStandingsApi = async (
  contestId: string,
  count: number = 15000,
  from = 1
) => {
  if (!contestId) {
    throw new Error("Contest Id is not provided");
  }
  const contestStandingsUrl = `${CF_ContestStandingsUrl}?contestId=${contestId}&count=${count}&from=${from}`;
  try {
    const response = await axios.get(contestStandingsUrl);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchContestRatingChangesApi = async (
  contestId: string,
  count: number = 15000
) => {
  if (!contestId) {
    throw new Error("Contest Id is not provided");
  }
  const contestRatingChangesUrl = `${CF_ContestRatingChangesUrl}?contestId=${contestId}&count=${count}`;
  try {
    const response = await axios.get(contestRatingChangesUrl);
    return response.data;
  } catch (error) {
    throw error;
  }
};
