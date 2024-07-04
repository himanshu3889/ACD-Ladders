"use client";
import React, {useEffect, useState} from "react";
import dynamic from "next/dynamic";
import {ISubmission} from "../../../types";
import {IContestRenew} from "../../../features/evaluators/processContests";
import {IContestSlice} from "../../../features/contests/contestSlice";
import {IRootReducerState} from "../../../app/store";
import {useSelector} from "react-redux";
import {IUserSlice} from "../../../features/user/userSlice";
import userData from "../../../data/CF/user_himanshu3889_cf.json";

const DynamicApexCharts = dynamic(() => import("react-apexcharts"), {
  ssr: false, // Ensure ApexCharts is not imported during SSR
});

const COUNT: string = "total"

const ApexChart: React.FC = () => {
  const [userStats, setUserStats] = useState<any>({});
  const [categories, setCategories] = useState<any>([]);
  const [series, setSeries] = useState<any>([]);
  const [error, setError] = useState<string | null>(null);

  const userState: IUserSlice = useSelector(
    (state: IRootReducerState) => state.user
  );

  const contestState: IContestSlice = useSelector(
    (state: IRootReducerState) => state.contests
  );

  function getSameProblemOtherContestId(
    problemContestRound: string,
    problemContestID: number
  ): number {
    const sameRoundContestIds: number[] =
      contestState.similarRoundDiv1Div2Contests[problemContestRound];
    let sameProblemOtherContestId: number = -1;
    if (sameRoundContestIds) {
      // Not using the loop here max length of the sameRoundContestIds is 2
      if (
        sameRoundContestIds.length > 0 &&
        sameRoundContestIds[0] !== problemContestID
      ) {
        sameProblemOtherContestId = sameRoundContestIds[0];
      }
      if (
        sameRoundContestIds.length > 1 &&
        sameRoundContestIds[1] !== problemContestID
      ) {
        sameProblemOtherContestId = sameRoundContestIds[1];
      }
    }
    return sameProblemOtherContestId;
  }

  function getProblemStatuses({
    problemName,
    problemContestID,
    problemContestRound,
  }: {
    problemName: string;
    problemContestID: number;
    problemContestRound: string;
  }) {
    let isSolved: boolean = false;
    let isAttempted: boolean = false;

    // If there is no user profile no need the status will be unsolved
    if (!userState.profile || problemContestID === -1) {
      return {isSolved, isAttempted};
    }

    // Find the problems solved in other contest id
    const sameProblemOtherContestId: number = getSameProblemOtherContestId(
      problemContestRound,
      problemContestID
    );

    let isDidThroughOtherContest: boolean = false;

    isSolved = !!(
      userState.userSolvedProblems[problemContestID] &&
      userState.userSolvedProblems[problemContestID][problemName]
    );

    if (!isSolved && sameProblemOtherContestId !== -1) {
      isSolved = !!(
        userState.userSolvedProblems[sameProblemOtherContestId] &&
        userState.userSolvedProblems[sameProblemOtherContestId][problemName]
      );
      isDidThroughOtherContest = isSolved;
    }

    isAttempted =
      !isSolved &&
      !!(
        userState.userAttemptedProblems[problemContestID] &&
        userState.userAttemptedProblems[problemContestID][problemName]
      );

    if (!isSolved && !isAttempted && sameProblemOtherContestId !== -1) {
      isAttempted = !!(
        userState.userAttemptedProblems[sameProblemOtherContestId] &&
        userState.userAttemptedProblems[sameProblemOtherContestId][problemName]
      );
      isDidThroughOtherContest = isAttempted;
    }

    return {isSolved, isAttempted};
  }

  const getUserFilteredData = async ({
    userSubmissions,
    contestData,
  }: {
    userSubmissions: ISubmission[];
    contestData: IContestRenew;
  }) => {
    const userFilteredData: any = {
      rating: {},
      tags: {},
      verdict: {},
      contestType: {},
      index: {},
    };

    const generatePairs = (keys: string[]) => {
      const pairs: [string, string][] = [];
      for (let i = 0; i < keys.length; i++) {
        for (let j = i + 1; j < keys.length; j++) {
          pairs.push([keys[i], keys[j]]);
        }
      }
      return pairs;
    };

    const incrementNestedCount = (
      mainObject: any,
      key1: string,
      key2: string,
      key3: string,
      key4: string
    ) => {
      if (!mainObject[key1]) {
        mainObject[key1] = {};
      }
      if (!mainObject[key1][key2]) {
        mainObject[key1][key2] = {};
      }
      if (!mainObject[key1][key2][key3]) {
        mainObject[key1][key2][key3] = {};
      }
      if (!mainObject[key1][key2][key3][key4]) {
        mainObject[key1][key2][key3][key4] = 0;
      }
      mainObject[key1][key2][key3][key4]++;
      mainObject[key1][key2][COUNT]++;

      if (!mainObject[key1]) {
        mainObject[key1] = {};
      }
      if (!mainObject[key1][key2]) {
        mainObject[key1][key2] = {};
      }
      if (!mainObject[key1][key2][key3]) {
        mainObject[key1][key2][key3] = {};
      }
      if (!mainObject[key1][key2][key3][key4]) {
        mainObject[key1][key2][key3][key4] = 0;
      }
      mainObject[key1][key2][key3][key4]++;

      if (!mainObject[key3]) {
        mainObject[key3] = {};
      }
      if (!mainObject[key3][key4]) {
        mainObject[key3][key4] = {};
      }
      if (!mainObject[key3][key4][key1]) {
        mainObject[key3][key4][key1] = {};
      }
      if (!mainObject[key3][key4][key1][key2]) {
        mainObject[key3][key4][key1][key2] = 0;
      }
      mainObject[key3][key4][key1][key2]++;
      mainObject[key3][key4][COUNT]++;
    };

    const keys = Object.keys(userFilteredData);
    const pairs = generatePairs(keys);

    userSubmissions.forEach(async (submission: ISubmission) => {
      const contestId: number = submission?.contestId ?? -1;
      const problemRating: number = submission.problem?.rating ?? 0;
      if (!problemRating || contestId === -1 || !contestData[contestId]) {
        return; // go to next iteration
      }
      const problemIndex: string = submission.problem.index;
      const problemName: string = submission.problem.name;
      const problemTags: string[] = submission.problem?.tags ?? [];
      const problemVerdict: string = submission?.verdict ?? "";
      const contestType: string = contestData[contestId].contestType;
      const contestRound: string = contestData[contestId].round;
      const {isSolved, isAttempted} = getProblemStatuses({
        problemName: problemName,
        problemContestID: contestId,
        problemContestRound: contestRound,
      });

      if (!isSolved) {
        return;
      }

      //  Update data for each pair
      pairs.forEach(([key1, key2]) => {
        if (key1 === "tags") {
          problemTags.forEach((tag: string) => {
            incrementNestedCount(
              userFilteredData,
              key1,
              tag,
              key2,
              key2 === "rating"
                ? problemRating.toString()
                : key2 === "verdict"
                ? problemVerdict
                : key2 === "contestType"
                ? contestType
                : key2 === "index"
                ? problemIndex
                : ""
            );
          });
        } else if (key2 === "tags") {
          problemTags.forEach((tag: string) => {
            incrementNestedCount(
              userFilteredData,
              key1,
              key1 === "rating"
                ? problemRating.toString()
                : key1 === "verdict"
                ? problemVerdict
                : key1 === "contestType"
                ? contestType
                : key1 === "index"
                ? problemIndex
                : "",
              key2,
              tag
            );
          });
        } else {
          incrementNestedCount(
            userFilteredData,
            key1,
            key1 === "rating"
              ? problemRating.toString()
              : key1 === "verdict"
              ? problemVerdict
              : key1 === "contestType"
              ? contestType
              : key1 === "index"
              ? problemIndex
              : "",
            key2,
            key2 === "rating"
              ? problemRating.toString()
              : key2 === "verdict"
              ? problemVerdict
              : key2 === "contestType"
              ? contestType
              : key2 === "index"
              ? problemIndex
              : ""
          );
        }
      });
    });
    return userFilteredData;
  };

  const fetchData = async () => {
    if (userState.isLoadingSubmissions || !contestState.isPreprocessed) {
      return;
    }
    try {
      const userFilteredData = await getUserFilteredData({
        userSubmissions: userData.submissions.result as ISubmission[],  // TODO: LOAD as store them in the variable
        contestData: contestState.allContests,
      });

      setUserStats(userFilteredData);
      setError(null);
    } catch (error) {
      console.error("Data file not found. Please add the JSON file.");
      setError("Data file not found. Please add the JSON file.");
    }
  };

  useEffect(() => {
    fetchData();
  }, [userState, contestState]);

  useEffect(() => {
    if (!userState.profile) {
      setUserStats({});
    }
  }, [userState.profile]);

  const ratingTagsExtract = () => {
    // Extract ratings and tags
    try {
      if (
        !userStats ||
        Object.keys(userStats).length === 0 ||
        !userStats.rating ||
        Object.keys(userStats.rating).length === 0
      ) {
        setCategories([]);
        setSeries([]);
        return;
      }
      const ratings = Object.keys(userStats?.rating);
      const tags = new Set<string>();
      ratings.forEach((rating) => {
        Object.keys(userStats.rating[rating].tags).forEach((tag) =>
          tags.add(tag)
        );
      });

      // Prepare the series data for each tag
      const mySeries = Array.from(tags).map((tag) => {
        return {
          name: tag,
          data: ratings.map(
            (rating) => userStats.rating[rating].tags[tag] || 0
          ),
        };
      });

      // Prepare categories for the x-axis
      const myCategories = ratings;

      setCategories(myCategories);
      setSeries(mySeries);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    ratingTagsExtract();
  }, [userStats]);

  // Configure the chart options
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      toolbar: {
        show: true,
      },
      zoom: {
        enabled: true,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: "bottom",
            offsetX: -10,
            offsetY: 0,
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        // columnWidth: "90%", // Adjust column width
        dataLabels: {
          total: {
            enabled: true,
            style: {
              fontSize: "13px",
              fontWeight: 900,
            },
          },
        },
      },
    },
    xaxis: {
      categories: categories,
      title: {
        text: "Rating",
      },
    },
    yaxis: {
      title: {
        text: "Tag Count",
      },
    },
    legend: {
      position: "right",
      offsetY: 40,
    },
    fill: {
      opacity: 1,
    },
    title: {
      text: `Rating vs Tags`,
      align: "left",
    },
  };

  if (userState.isLoadingSubmissions || !contestState.isPreprocessed) {
    return <div>Preprocessing</div>;
  }

  return (
    <div>
      <div id="chart">
        <DynamicApexCharts
          options={options}
          series={series}
          type="bar"
          height={600}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default ApexChart;
