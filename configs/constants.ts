export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://acodedaily.com/v2";
export const ACD_LADDERS_API = "https://acodedaily.com/api/v2";
export const CF_API: string = "https://codeforces.com/api";
export const CF_ProblemsUrl: string = `${CF_API}/problemset.problems`;
export const CF_ContestsUrl: string = `${CF_API}/contest.list`;
export const CF_UserInfoUrl: string = `${CF_API}/user.info`;
export const CF_UserSubmissionUrl: string = `${CF_API}/user.status`;
export const CF_UserRatingChangeUrl: string = `${CF_API}/user.rating`;
export const CF_ContestStandingsUrl: string = `${CF_API}/contest.standings`;
export const CF_ContestRatingChangesUrl: string = `${CF_API}/contest.ratingChanges`;
export const ACD_Ladders_ProblemsUrl: string = `${ACD_LADDERS_API}/all`;
export const favFilterStorage: string = "favFilters";

export enum PLATFORMS {
  ACD = "ACD",
  CF = "CF",
}

export type I_CF_RATING_RANK_RELATION = {
  minRating: number;
  maxRating: number;
  rank: string;
  color: string;
};
export const CF_RATING_RANK_RELATION = [
  {minRating: 0, maxRating: 1199, rank: "Newbie", color: "#9E9E9E"}, // Gray
  {minRating: 1200, maxRating: 1399, rank: "Pupil", color: "#32CD32"}, // Green
  {minRating: 1400, maxRating: 1599, rank: "Specialist", color: "#00FFFF"}, // Cyan
  {minRating: 1600, maxRating: 1899, rank: "Expert", color: "#0000FF"}, // Blue
  {
    minRating: 1900,
    maxRating: 2099,
    rank: "Candidate Master",
    color: "#8A2BE2",
  }, // Violet
  {minRating: 2100, maxRating: 2299, rank: "Master", color: "#FFA500"}, // Orange
  {
    minRating: 2300,
    maxRating: 2399,
    rank: "International Master",
    color: "#FF4500",
  }, // Orange
  {minRating: 2400, maxRating: 2599, rank: "Grandmaster", color: "#FF7777"}, // Light Red
  {
    minRating: 2600,
    maxRating: 2999,
    rank: "International Grandmaster",
    color: "#FF3333",
  }, // Medium Red
  {
    minRating: 3000,
    maxRating: 3999,
    rank: "Legendary Grandmaster",
    color: "#CC0000",
  }, // Dark Red
  {
    minRating: 4000,
    maxRating: Infinity,
    rank: "Tourist",
    color: "#CC0000",
  }, // Dark Red
];
