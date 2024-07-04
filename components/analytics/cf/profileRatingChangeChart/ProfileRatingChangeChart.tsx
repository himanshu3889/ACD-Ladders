"use client";
import React, {FC, useEffect, useState} from "react";
import dynamic from "next/dynamic";
import moment from "moment";
import {IContestResult} from "../../../../types";
import {CODEFORCES_LEVELS} from "../../../../configs/constants";

const DynamicApexCharts = dynamic(() => import("react-apexcharts"), {
  ssr: false, // Ensure ApexCharts is not imported during SSR
});

export const getLevelByRating = (rating: any) => {
  for (const level of CODEFORCES_LEVELS) {
    if (rating >= level.minRating && rating <= level.maxRating) {
      return level.text;
    }
  }
  return ""; // Default value
};

interface IProfileRatingChangeChartProps {}
const ProfileRatingChangeChart: FC<IProfileRatingChangeChartProps> = ({}) => {
  const [ratingChange, setRatingChange] = useState<IContestResult[]>([]);

  const fetchData = async () => {
    try {
      const data =
        await require("../../../data/CF/original/user_himanshu3889_cf.json");
      setRatingChange(data.rating_change.result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getDate = (timestamp: number) => {
    return moment.unix(timestamp).format("DD MMM YYYY");
  };

  // Preprocess data for the chart
  const chartData = ratingChange.map((item: IContestResult) => ({
    date: getDate(item.ratingUpdateTimeSeconds),
    timestamp: item.ratingUpdateTimeSeconds,
    oldRating: item.oldRating,
    newRating: item.newRating,
    rank: item.rank,
    contestName: item.contestName,
    contestId: item.contestId,
  }));

  const generateAnnotations = (
    levels: {
      minRating: number;
      maxRating: number;
      text: string;
      color: string;
    }[]
  ) => {
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

  const annotationsYaxis = generateAnnotations(CODEFORCES_LEVELS);
  const maxRating = Math.max(...chartData.map((item) => item.newRating));
  const minRatingsSet = new Set(
    CODEFORCES_LEVELS.map((level) => level.minRating)
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
      text: `Max Rating ${maxRating}`,
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
      max: Math.ceil((maxRating + 500) / 100) * 100, // Maximum value of the y-axis
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
        const ratingChange = item.newRating - item.oldRating;
        const formattedRatingChange =
          ratingChange > 0 ? `+${ratingChange}` : `${ratingChange}`;
        const round = item.contestName; // Add the round info if available in your data
        const currentLevel = getLevelByRating(item.newRating);
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
        <DynamicApexCharts
          options={options}
          series={series}
          type="line"
          height={450}
        />
      </div>
    </div>
  );
};

export default ProfileRatingChangeChart;
