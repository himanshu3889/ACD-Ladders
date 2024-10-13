"use client";
import {FC, useEffect, useState} from "react";
import dynamic from "next/dynamic";
import {IContestStandings} from "../../../../../types";
import {
  getProblemIndicesSubmissionCountByMin,
  IIndicesSolvedByUsersInSec,
  IProblemIndicesSubmissionsArrayRecord,
  IUsersHandleRank,
} from "../../../../../utils/analytics/cf/contestAnalytics/processContestAnalyticsData";
import {lightColors} from "../../../../../styles/colors";
import {IndicesAnalyticsHeader} from "./IndicesAnalyticsHeader";

const DynamicApexCharts = dynamic(() => import("react-apexcharts"), {
  ssr: false, // Ensure ApexCharts is not imported during SSR
});

interface IContestAnalyticsProblemIndicesChartProps {
  contestId: string;
  contestStandings: IContestStandings | null;
  contestUserHandles: string[];
  usersHandleRank: IUsersHandleRank;
  problemIndicesSolvedByUsersInSec: IIndicesSolvedByUsersInSec;
}

const ContestAnalyticsProblemIndicesChart: FC<
  IContestAnalyticsProblemIndicesChartProps
> = ({
  contestId,
  contestStandings,
  contestUserHandles,
  problemIndicesSolvedByUsersInSec,
}) => {
  const [problemIndicesSubmissions, setProblemIndicesSubmissions] =
    useState<IProblemIndicesSubmissionsArrayRecord>({});

  const [xAxisCategories, setXAxisCategories] = useState<any>([]);
  const [series, setSeries] = useState<any>([]);
  const [pointAnnotations, setPointAnnotations] = useState<PointAnnotations[]>(
    []
  );

  const getUsersColorsData = () => {
    return contestUserHandles.reduce((acc, handle, index) => {
      acc[handle] = lightColors[index % lightColors.length];
      return acc;
    }, {} as {[key: string]: string});
  };

  const getUsersDataPointsData = () => {
    return contestUserHandles.reduce((acc, handle) => {
      acc[handle] = true;
      return acc;
    }, {} as {[key: string]: boolean});
  };
  const [userHandlesColors, setUserHandlesColors] = useState<{
    [key: string]: string;
  }>(getUsersColorsData());
  const [showUserHandleDataPoints, setShowUserHandleDataPoints] = useState<{
    [key: string]: boolean;
  }>(getUsersDataPointsData());

  const getUserHandlesData = () => {
    setUserHandlesColors(getUsersColorsData());
    setShowUserHandleDataPoints(getUsersDataPointsData());
  };

  useEffect(() => {
    getUserHandlesData();
  }, [contestUserHandles]);

  const getContestProblemIndicesAnalytics = async () => {
    if (!contestStandings) {
      return;
    }
    const problemIndicesSubmissionsArrayRecord: IProblemIndicesSubmissionsArrayRecord =
      await getProblemIndicesSubmissionCountByMin({
        contestStandings: contestStandings,
      });
    setProblemIndicesSubmissions(problemIndicesSubmissionsArrayRecord);
  };

  useEffect(() => {
    getContestProblemIndicesAnalytics();
  }, [contestStandings]);

  const generateAnnotations = () => {
    const problemIndexSeriesIndex: {[key: string]: number} = {};
    Object.entries(problemIndicesSubmissions).forEach(
      ([problemIndex], index: number) => {
        problemIndexSeriesIndex[problemIndex] = index;
      }
    );

    const newAnnotations: PointAnnotations[] = [];
    for (const [problemIndex, solvedUsers] of Object.entries(
      problemIndicesSolvedByUsersInSec
    )) {
      for (const [userHandle, solvedTimeInSec] of Object.entries(solvedUsers)) {
        const solvedTimeInMin: number = Math.ceil(solvedTimeInSec / 60);
        const yPoint: number =
          problemIndicesSubmissions?.[problemIndex]?.[solvedTimeInMin] ?? -1;
        const seriesIndex: number = problemIndexSeriesIndex[problemIndex];
        const color = userHandlesColors?.[userHandle] || "";
        const isNeedShow = showUserHandleDataPoints?.[userHandle] ?? true;
        if (yPoint >= 0 && isNeedShow) {
          newAnnotations.push({
            x: solvedTimeInMin,
            y: yPoint,
            seriesIndex: seriesIndex,
            marker: {
              size: 4,
              fillColor: "#fff",
              strokeColor: color,
              radius: 2,
              cssClass: "apexcharts-custom-class",
            },
            label: {
              borderColor: color,
              offsetY: 0,
              style: {
                color: "#fff",
                background: color,
              },
              text: `${userHandle} (${problemIndex}: ${solvedTimeInMin} Min)`,
            },
          });
        }
      }
    }
    return newAnnotations;
  };

  const handleChartPrepare = () => {
    if (!problemIndicesSubmissions || !contestId) {
      return;
    }

    const contestDurationInMin: number = Math.ceil(
      (contestStandings?.contest.durationSeconds ?? 0) / 60
    );

    const xCategories = Array.from(
      {length: contestDurationInMin + 1},
      (_, index) => index
    );

    const mySeries = Object.entries(problemIndicesSubmissions).map(
      ([problemIndex, dataPoints]) => ({
        name: problemIndex,
        data: dataPoints,
      })
    );
    const newPointAnnotations = generateAnnotations();

    setSeries(mySeries);
    setXAxisCategories(xCategories);
    setPointAnnotations(newPointAnnotations);
  };

  useEffect(() => {
    handleChartPrepare();
  }, [
    problemIndicesSubmissions,
    problemIndicesSolvedByUsersInSec,
    showUserHandleDataPoints,
  ]);

  const options: ApexCharts.ApexOptions = {
    chart: {
      height: 350,
      group: `contest-${contestId}`,
      type: "line",
      dropShadow: {
        enabled: true,
        color: "#000",
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0,
      },
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "monotoneCubic",
      width: 2,
    },
    title: {
      text: `Contest ${contestId} Problem Indices Submission Chart`,
      align: "left",
    },
    grid: {
      borderColor: "#e7e7e7",
      row: {
        colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
        opacity: 0.5,
      },
    },
    xaxis: {
      categories: xAxisCategories,
      title: {
        text: "Minutes",
      },
    },
    yaxis: {
      title: {
        text: "Solved By",
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      floating: true,
      offsetY: -25,
      offsetX: -5,
    },
    tooltip: {
      x: {
        formatter: (value) => `${value} mins`,
      },
    },
    annotations: {
      points: pointAnnotations,
    },
  };

  return (
    <div id="contest-problem-index-chart">
      <div className="mt-8">
        <IndicesAnalyticsHeader
          userHandlesColors={userHandlesColors}
          showUserHandleDataPoints={showUserHandleDataPoints}
          setShowUserHandleDataPoints={setShowUserHandleDataPoints}
          contestUserHandles={contestUserHandles}
        />
      </div>

      <div className="">
        <DynamicApexCharts
          options={options}
          series={series}
          type="line"
          height={650}
        />
      </div>
    </div>
  );
};

export default ContestAnalyticsProblemIndicesChart;
