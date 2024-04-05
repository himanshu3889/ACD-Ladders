export enum SortingOrders {
  None = "",
  ASC = "ASC",
  DSC = "DSC",
}

export const sortingOrders: SortingOrders[] = Object.values(SortingOrders);

export enum CFContestTypes {
  Educational = "Educational",
  Div1 = "Div. 1",
  Div2 = "Div. 2",
  Div1And2 = "Div. 1 + Div. 2",
  Div3 = "Div. 3",
  Div4 = "Div. 4",
}

export const allCFContestTypes: CFContestTypes[] =
  Object.values(CFContestTypes);

export enum StatusOptions {
  All = "All",
  Unsolved = "Unsolved",
  Solved = "Solved",
  Attempted = "Attempted",
}

export const allStatus: StatusOptions[] = Object.values(StatusOptions);

export const initialTagState: Record<string, boolean> = {
  "brute force": false,
  greedy: false,
  sortings: false,
  "two pointers": false,
  dp: false,
  "binary search": false,
  "ternary search": false,
  math: false,
  "number theory": false,
  combinatorics: false,
  "chinese remainder theorem": false,
  graphs: false,
  trees: false,
  "dfs and similar": false,
  dsu: false,
  "divide and conquer": false,
  "data structures": false,
  "constructive algorithms": false,
  implementation: false,
  interactive: false,
  geometry: false,
  strings: false,
  bitmasks: false,
  "shortest paths": false,
  probabilities: false,
  hashing: false,
  games: false,
  flows: false,
  "graph matchings": false,
  special: false,
  matrices: false,
  "string suffix structures": false,
  fft: false,
  "expression parsing": false,
  "meet-in-the-middle": false,
  "2-sat": false,
  schedules: false,
};

export const problemsPerPage: number[] = [15, 25, 50, 75, 100];

export enum SortingParams {
  problemId = "Problem Id",
  Score = "Score",
  SolvedBy = "Solved by",
  Difficulty = "Difficulty",
}

export const sortingParamsList: SortingParams[] = Object.values(SortingParams);
