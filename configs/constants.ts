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

export const CODEFORCES_LEVELS = [
  {minRating: 0, maxRating: 1199, text: "Newbie", color: "#9E9E9E"}, // Gray
  {minRating: 1200, maxRating: 1399, text: "Pupil", color: "#32CD32"}, // Green
  {minRating: 1400, maxRating: 1599, text: "Specialist", color: "#00FFFF"}, // Cyan
  {minRating: 1600, maxRating: 1899, text: "Expert", color: "#0000FF"}, // Blue
  {
    minRating: 1900,
    maxRating: 2199,
    text: "Candidate Master",
    color: "#8A2BE2",
  }, // Violet
  {minRating: 2200, maxRating: 2299, text: "Master", color: "#FFA500"}, // Orange
  {
    minRating: 2300,
    maxRating: 2599,
    text: "International Master",
    color: "#FF4500",
  }, // Orange
  {minRating: 2600, maxRating: 2899, text: "Grandmaster", color: "#FF0000"}, // Red
  {
    minRating: 2900,
    maxRating: 2999,
    text: "International Grandmaster",
    color: "#DC143C",
  }, // Red
  {
    minRating: 3000,
    maxRating: Infinity,
    text: "Legendary Grandmaster",
    color: "#000000",
  }, // Black
];
