export interface IProblem {
  contestId?: number;
  index: string;
  name: string;
  tags: string[];
  type: "PROGRAMMING" | "QUESTION";
  problemsetName?: string;
  points?: number;
  rating?: number;
  frequency?: number;
}

export interface IProblemStatistics {
  contestId?: number;
  index?: string;
  solvedCount?: number;
}

export interface IProblems {
  problems: IProblem[];
  problemStatistics: IProblemStatistics[];
}

export interface IContest {
  id: number;
  name: string;
  type: "CF" | "IOI" | "ICPC";
  phase:
    | "BEFORE"
    | "CODING"
    | "PENDING_SYSTEM_TEST"
    | "SYSTEM_TEST"
    | "FINISHED";
  frozen: boolean;
  durationSeconds: number;
  startTimeSeconds?: number;
  relativeTimeSeconds?: number;
  preparedBy?: string;
  websiteUrl?: string;
  description?: string;
  difficulty?: number;
  kind?: string;
  icpcRegion?: string;
  country?: string;
  city?: string;
  season?: string;
}

export interface IUser {
  handle: string;
  email?: string;
  vkId?: string;
  openId?: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  city?: string;
  organization?: string;
  contribution: number;
  rank: string;
  rating: number;
  maxRank: string;
  maxRating: number;
  lastOnlineTimeSeconds: number;
  registrationTimeSeconds: number;
  friendOfCount: number;
  avatar: string;
  titlePhoto: string;
}

export interface IMember {
  handle: string;
}

export interface IParty {
  contestId?: number;
  members: Member[];
  participantType:
    | "CONTESTANT"
    | "PRACTICE"
    | "VIRTUAL"
    | "MANAGER"
    | "OUT_OF_COMPETITION";
  teamId?: number;
  teamName?: string;
  ghost: boolean;
  room?: number;
  startTimeSeconds?: number;
}

export interface ISubmission {
  id: number;
  contestId?: number;
  creationTimeSeconds: number;
  relativeTimeSeconds: number;
  problem: IProblem;
  author: IParty;
  programmingLanguage: string;
  verdict?:
    | "FAILED"
    | "OK"
    | "PARTIAL"
    | "COMPILATION_ERROR"
    | "RUNTIME_ERROR"
    | "WRONG_ANSWER"
    | "PRESENTATION_ERROR"
    | "TIME_LIMIT_EXCEEDED"
    | "MEMORY_LIMIT_EXCEEDED"
    | "IDLENESS_LIMIT_EXCEEDED"
    | "SECURITY_VIOLATED"
    | "CRASHED"
    | "INPUT_PREPARATION_CRASHED"
    | "CHALLENGED"
    | "SKIPPED"
    | "TESTING"
    | "REJECTED";
  testset?:
    | "SAMPLES"
    | "PRETESTS"
    | "TESTS"
    | "CHALLENGES"
    | "TESTS1"
    | "TESTS2"
    | "TESTS3"
    | "TESTS4"
    | "TESTS5"
    | "TESTS6"
    | "TESTS7"
    | "TESTS8"
    | "TESTS9"
    | "TESTS10";
  passedTestCount: number;
  timeConsumedMillis: number;
  memoryConsumedBytes: number;
  points?: number;
}

export interface IContestResult {
  contestId: number;
  contestName: string;
  handle: string;
  rank: number;
  ratingUpdateTimeSeconds: number;
  oldRating: number;
  newRating: number;
}
