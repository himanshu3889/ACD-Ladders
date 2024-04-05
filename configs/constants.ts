export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const ACD_LADDERS_API = process.env.NEXT_PUBLIC_ACD_LADDERS_API;
export const CF_API: string = "https://codeforces.com/api";
export const CF_ProblemsUrl: string = `${CF_API}/problemset.problems`;
export const CF_ContestsUrl: string = `${CF_API}/contest.list`;
export const CF_UserInfoUrl: string = `${CF_API}/user.info`;
export const CF_UserSubmissionUrl: string = `${CF_API}/user.status`;
export const ACD_Ladders_ProblemsUrl: string = `${ACD_LADDERS_API}/all`;
export const favFilterStorage: string = "favFilters";

export enum PLATFORMS {
  ACD = "ACD",
  CF = "CF",
}
