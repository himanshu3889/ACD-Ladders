"use client";
import React, {FC, useEffect, useState} from "react";
import dynamic from "next/dynamic";
import {
  UserAnalyticsKeys,
  userAnalyticsKeysArray,
} from "../../../../pages/analytics/cf";
import {mixedSort, titleCase} from "../../../../utils/stringAlgos";
import AxisSelectDropdown from "../submissionAnalyticsChart/AxisSelectDropdown";
const DynamicApexCharts = dynamic(() => import("react-apexcharts"), {
  ssr: false, // Ensure ApexCharts is not imported during SSR
});

interface ISubmissioChartProps {
  userSubmissionAnalytics: any;
}
const SubmissionChart: FC<ISubmissioChartProps> = ({
  userSubmissionAnalytics,
}) => {
  const [analyticsXAxis, setanalyticsXAxis] =
    useState<UserAnalyticsKeys | null>(UserAnalyticsKeys.RATING);
  const [analyticsYAxis, setanalyticsYAxis] =
    useState<UserAnalyticsKeys | null>(UserAnalyticsKeys.STATUS);
  const [xAxisCategories, setXAxisCategories] = useState<any>([]);
  const [series, setSeries] = useState<any>([]);

  const handleChartPrepare = () => {
    // Extract ratings and tags
    if (!analyticsXAxis || !analyticsYAxis) {
      return;
    }
    try {
      if (
        !userSubmissionAnalytics ||
        Object.keys(userSubmissionAnalytics).length === 0 ||
        !userSubmissionAnalytics.rating ||
        Object.keys(userSubmissionAnalytics.rating).length === 0
      ) {
        setXAxisCategories([]);
        setSeries([]);
        return;
      }
      // Extract and sort xCategories
      const xCategories = Object.keys(
        userSubmissionAnalytics?.[analyticsXAxis] || {}
      ).sort(mixedSort);

      // Extract and sort yCategories
      const yCategories = new Set<string>();
      xCategories.forEach((x) => {
        Object.keys(
          userSubmissionAnalytics[analyticsXAxis][x][analyticsYAxis] || {}
        ).forEach((status) => {
          yCategories.add(status);
        });
      });
      const sortedYCategories = Array.from(yCategories).sort(mixedSort);

      // Generate the series from y categories
      const mySeries = sortedYCategories.map((y) => {
        return {
          name: y,
          data: xCategories.map(
            (x) =>
              userSubmissionAnalytics[analyticsXAxis][x][analyticsYAxis][y] || 0
          ),
        };
      });
      setXAxisCategories(xCategories);
      setSeries(mySeries);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleChartPrepare();
  }, [userSubmissionAnalytics, analyticsXAxis, analyticsYAxis]);
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
      categories: xAxisCategories,
      title: {
        text: `${titleCase(analyticsXAxis ?? "")}`,
      },
    },
    yaxis: {
      title: {
        text: `${titleCase(analyticsYAxis ?? "")}`,
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
      text: `${titleCase(analyticsXAxis ?? "")} vs ${titleCase(
        analyticsYAxis ?? ""
      )}`,
      align: "left",
    },
  };

  return (
    <div>
      <div className="m-8">
        <div className="flex flex-row m-4">
          <div className="me-4">
            <div className="font-semibold">X Axis</div>
            <AxisSelectDropdown
              value={analyticsXAxis}
              allValues={userAnalyticsKeysArray}
              setValue={setanalyticsXAxis}
              id="x-axis"
            />
          </div>
          <div className="mx-4">
            <div className="font-semibold">Y Axis</div>
            <AxisSelectDropdown
              value={analyticsYAxis}
              allValues={userAnalyticsKeysArray}
              setValue={setanalyticsYAxis}
              id="y-axis"
            />
          </div>
        </div>
        <div id="chart">
          <DynamicApexCharts
            options={options}
            series={series}
            type="bar"
            height={600}
          />
        </div>
      </div>
    </div>
  );
};

export default SubmissionChart;
