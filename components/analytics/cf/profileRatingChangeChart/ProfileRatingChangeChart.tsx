"use client";
import React, {FC, useEffect, useState} from "react";
import dynamic from "next/dynamic";
import moment from "moment";
import {IContestResult} from "../../../../types";
import {
  CF_RATING_RANK_RELATION,
  I_CF_RATING_RANK_RELATION,
} from "../../../../configs/constants";
import {getUserRankColorStyle} from "../../../UserDetails";

const DynamicApexCharts = dynamic(() => import("react-apexcharts"), {
  ssr: false, // Ensure ApexCharts is not imported during SSR
});

interface IExtraProfileData {
  currentRating: number;
  currentRank: string;
  maxRating: number;
  maxRank: string;
  maxUp: number;
  maxDown: number;
}

interface IChartData {
  date: string;
  timestamp: number;
  oldRating: number;
  newRating: number;
  rank: number;
  contestName: string;
  contestId: number;
}

export const getRankByRating = (rating: any) => {
  for (const relation of CF_RATING_RANK_RELATION) {
    if (rating >= relation.minRating && rating <= relation.maxRating) {
      return relation.rank;
    }
  }
  return ""; // Default value
};

const getExtraProfileInfo = (
  ratingChange: IContestResult[]
): IExtraProfileData => {
  let currentRating: number = 0;
  let currentRank: string = "";
  let maxRating: number = 0;
  let maxRank: string = "";
  let maxUp: number = 0;
  let maxDown: number = 0;
  ratingChange.forEach((item: IContestResult) => {
    const oldRating: number = item.oldRating;
    const newRating: number = item.newRating;
    const ratingDifference: number = newRating - oldRating;
    currentRating = newRating;
    maxRating = Math.max(maxRating, newRating);
    maxUp = Math.max(maxUp, ratingDifference);
    maxDown = Math.min(maxDown, ratingDifference);
  });

  currentRank = getRankByRating(currentRating);
  maxRank = getRankByRating(maxRating);

  return {currentRating, currentRank, maxRating, maxRank, maxUp, maxDown};
};

const getDate = (timestamp: number) => {
  return moment.unix(timestamp).format("DD MMM YYYY");
};

interface IProfileRatingChangeChartProps {
  handle: string;
}
const ProfileRatingChangeChart: FC<IProfileRatingChangeChartProps> = ({
  handle,
}) => {
  const [ratingChange, setRatingChange] = useState<IContestResult[]>([]);
  const [chartData, setChartData] = useState<IChartData[]>([]);
  const [extraProfileData, setExtraProfileData] =
    useState<IExtraProfileData | null>(null);

  const fetchData = async () => {
    try {
      const data =
        await require("../../../../data/CF/user_himanshu3889_cf.json");
      setRatingChange(data.rating_change.result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const generateChartAndProfileData = () => {
    // Preprocess data for the chart
    const myChartData: IChartData[] = ratingChange.map(
      (item: IContestResult) => ({
        date: getDate(item.ratingUpdateTimeSeconds),
        timestamp: item.ratingUpdateTimeSeconds,
        oldRating: item.oldRating,
        newRating: item.newRating,
        rank: item.rank,
        contestName: item.contestName,
        contestId: item.contestId,
      })
    );

    setChartData(myChartData);
    const myExtraProfileData = getExtraProfileInfo(ratingChange);
    setExtraProfileData(myExtraProfileData);
  };

  useEffect(() => {
    generateChartAndProfileData();
  }, [ratingChange]);

  const generateAnnotations = (levels: I_CF_RATING_RANK_RELATION[]) => {
    return levels.map((level) => ({
      y: level.minRating,
      y2: level.maxRating,
      borderColor: "#000",
      fillColor: level.color,
      opacity: 0.5,
      label: {
        style: {
          color: level.color,
        },
      },
    }));
  };

  const annotationsYaxis = generateAnnotations(CF_RATING_RANK_RELATION);
  const minRatingsSet = new Set(
    CF_RATING_RANK_RELATION.map((level) => level.minRating)
  );

  const points = chartData.map((item) => ({
    x: item.timestamp * 1000,
    y: item.newRating,
    marker: {
      size: 5,
      fillColor: "#FFCC00",
      strokeColor: "#fff",
      radius: 2,
    },
    label: {
      borderColor: "#FF4560",
      style: {
        color: "#fff",
        background: "#FF4560",
      },
    },
  }));

  const options: any = {
    chart: {
      type: "line",
      zoom: {
        enabled: false,
      },
    },
    annotations: {
      yaxis: annotationsYaxis,
      points: points,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
      width: 2, // Set the width of the line
      colors: ["#1F2937"], // Set the color of the line to yellow
    },
    markers: {
      size: 5, // Size of the markers
      shape: "circle", // Shape of the markers
      colors: ["#1F2937"], // Set the color of the markers to yellow
      strokeColors: "#fff", // Set the border color of the markers to white
      strokeWidth: 2, // Set the border width of the markers
    },
    grid: {
      show: true, // Show the grid (set to false to hide all grid lines)
      borderColor: "#e0e0e0", // Border color for the grid
      borderWidth: 1, // Border width for the grid
      padding: {
        right: 30,
        left: 20,
      },
      yaxis: {
        lines: {
          show: false, // Remove horizontal lines
        },
      },
    },
    title: {
      text: `${handle}`,
      align: "left",
    },
    xaxis: {
      type: "datetime",
      axisBorder: {
        show: true,
        color: "#000", // X-axis line color
      },
      axisTicks: {
        show: true,
        borderType: "solid",
        color: "#000", // X-axis tick color
        width: 1, // X-axis tick width
      },
      crosshairs: {
        show: true,
        position: "back", // Position crosshair in the back
        stroke: {
          color: "#d3d3d3", // Light grey color for the vertical lines at the x-axis labels
          width: 1,
          dashArray: 1,
        },
      },
    },
    yaxis: {
      min: 0, // Minimum value of the y-axis
      max: Math.ceil((extraProfileData?.maxRating ?? 0 + 500) / 100) * 100, // Maximum value of the y-axis
      tickPlacement: "on", // Ensure ticks are placed on multiples of 100
      labels: {
        formatter: function (value: number) {
          return minRatingsSet.has(value) ? value.toString() : ""; // Format labels to show only specific values
        },
        style: {
          fontSize: "12px", // Adjust the font size of the y-axis labels
        },
      },
    },
    tooltip: {
      custom: function ({series, seriesIndex, dataPointIndex, w}: any) {
        const item = chartData[dataPointIndex];
        const dateTime = moment(item.timestamp * 1000).format(
          "MMM D, YYYY HH:mm"
        );
        const rating = item.newRating;
        const rank = "Rank: " + item.rank; // Add the rank info if available in your data
        const ratingDiff = item.newRating - item.oldRating;
        const formattedRatingChange =
          ratingDiff > 0 ? `+${ratingDiff}` : `${ratingDiff}`;
        const round = item.contestName; // Add the round info if available in your data
        const currentLevel = getRankByRating(item.newRating);
        const details = `
          <div style="padding: 10px; background: #fff; border-radius: 5px; border: 1px solid #ccc;">
            <div style="font-weight: bold; margin-bottom: 1px;">Rating: ${rating} (${formattedRatingChange}), ${currentLevel}</div>
            <div style="margin-bottom: 1px;">${rank}</div>
            <div style="margin-bottom: 1px;">${round}</div>
            <div>${dateTime}</div>
          </div>
        `;
        return details;
      },
    },
  };

  const series = [
    {
      name: "Rating",
      data: chartData.map((item) => ({
        x: item.timestamp * 1000,
        y: item.newRating,
      })),
    },
  ];

  return (
    <div>
      <div id="profile-chart">
        {extraProfileData && (
          <div className="ml-2">
            <div className="flex flex-row">
              <div>Current Rating :</div>
              <div className="ml-1">{extraProfileData?.currentRating}</div>
              <div
                className={`ml-1 ${getUserRankColorStyle(
                  extraProfileData?.currentRank ?? ""
                )}`}
              >
                ({extraProfileData?.currentRank})
              </div>
            </div>
            <div className="flex flex-row">
              <div>Max Rating :</div>
              <div className="ml-1">{extraProfileData?.maxRating}</div>
              <div
                className={`ml-1 ${getUserRankColorStyle(
                  extraProfileData?.maxRank ?? ""
                )}`}
              >
                ({extraProfileData?.maxRank})
              </div>
            </div>
            <div className="flex flex-row">
              <div>Max Up :</div>
              <div className="ml-1">{extraProfileData?.maxUp ?? "-"}</div>
            </div>
            <div className="flex flex-row">
              <div>Max Down :</div>
              <div className="ml-1">{extraProfileData?.maxDown ?? "-"}</div>
            </div>
            <div className="flex flex-row">
              <div>Contests :</div>
              <div className="ml-1">{ratingChange?.length ?? "-"}</div>
            </div>
          </div>
        )}
        <div className="mt-4">
          <DynamicApexCharts
            options={options}
            series={series}
            type="line"
            height={450}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileRatingChangeChart;
