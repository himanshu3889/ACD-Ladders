"use client";
import {FC, useEffect, useState} from "react";
import dynamic from "next/dynamic";
import {IContestStandings} from "../../../../../types";
import {getUsersContestRankPerMinute} from "../../../../../utils/analytics/cf/contestAnalytics/processUserContestAnalyticsData";
import {
  IIndicesSolvedByUsersInSec,
  IUsersHandleRank,
} from "../../../../../utils/analytics/cf/contestAnalytics/processContestAnalyticsData";
import UserRankAnalyticsHeader from "./UserRankAnalyticsHeader";

const DynamicApexCharts = dynamic(() => import("react-apexcharts"), {
  ssr: false, // Ensure ApexCharts is not imported during SSR
});

export type IUsersRankArrayMap = Map<string, number[]>;

interface IContestAnalyticsUserRankChartProps {
  contestId: string;
  contestStandings: IContestStandings | null;
  usersHandlesRank: IUsersHandleRank;
  problemIndicesSolvedByUsersInSec: IIndicesSolvedByUsersInSec;
}

const ContestAnalyticsUserRankChart: FC<
  IContestAnalyticsUserRankChartProps
> = ({
  contestId,
  contestStandings,
  usersHandlesRank,
  problemIndicesSolvedByUsersInSec,
}) => {
  console.log({problemIndicesSolvedByUsersInSec}, "user rank chart se")
  const [usersRankArrayMap, setUsersRankArrayMap] =
    useState<IUsersRankArrayMap>(new Map<string, number[]>());
  const [xAxisCategories, setXAxisCategories] = useState<any>([]);
  const [series, setSeries] = useState<any>([]);

  const getUsersRankArrayMap = async () => {
    if (!contestStandings) {
      return;
    }
    const usersRankArrayMapData = getUsersContestRankPerMinute({
      contestStandings: contestStandings,
      usersHandleRank: usersHandlesRank,
    });
    setUsersRankArrayMap(usersRankArrayMapData);
  };

  useEffect(() => {
    getUsersRankArrayMap();
  }, [usersHandlesRank]);

  // TODO: MARK THE USERS INDICES SUBMISSION POINTS
  const handleChartPrepare = () => {
    if (usersRankArrayMap.size === 0) {
      return;
    }

    const contestDurationInMin: number = Math.ceil(
      (contestStandings?.contest.durationSeconds ?? 0) / 60
    );

    const xCategories = Array.from(
      {length: contestDurationInMin + 1},
      (_, index) => index
    );

    const mySeries = Array.from(usersRankArrayMap.entries()).map(
      ([userHandle, dataPoints]) => ({
        name: userHandle,
        data: dataPoints,
      })
    );

    setSeries(mySeries);
    setXAxisCategories(xCategories);
  };

  useEffect(() => {
    handleChartPrepare();
  }, [usersRankArrayMap, contestId]);

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
      text: `Contest ${contestId} User Rank Chart`,
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
        text: "Rank",
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
  };

  return (
    <div>
      <div className="ml-2">
        <UserRankAnalyticsHeader
          problemIndicesSolvedByUsersInSec={problemIndicesSolvedByUsersInSec}
          usersHandlesRank={usersHandlesRank}
        />
      </div>
      <div className="mt-4">
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

export default ContestAnalyticsUserRankChart;
