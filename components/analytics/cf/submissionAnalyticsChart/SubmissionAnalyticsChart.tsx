"use client";
import React, {FC, useEffect, useState} from "react";
import dynamic from "next/dynamic";
import {
  UserAnalyticsKeys,
  userAnalyticsKeysArray,
} from "../../../../pages/v2/analytics/cf";
import {mixedSort, titleCase} from "../../../../utils/stringAlgos";
import AxisSelectDropdown from "./AxisSelectDropdown";
import FilterSelectGroup from "./FilterSelectGroup";
import {StatusOptions} from "../../../../features/filters/filterConstants";
import {processSubmissionAnalyticsData} from "../../../../utils/analytics/cf/submissionAnalytics/processSubmissionAnalyticsData";
import {IContest, ISubmission} from "../../../../types";
const DynamicApexCharts = dynamic(() => import("react-apexcharts"), {
  ssr: false, // Ensure ApexCharts is not imported during SSR
});
import FilterDateRange from "./FilterDateRange";

const statusGroup: StatusOptions[] = [
  StatusOptions.Solved,
  StatusOptions.Attempted,
];
const participantType: string[] = ["PRACTICE", "CONTESTANT", "VIRTUAL"];
// TODO: MAKE THE QUERY PARAMS FOR THESE
// X Axis : submission_analytics_x
// Y Axis : submission_analytics_y
// Status : submission_analytics_statuses
// Participant : submission_analytics_particpants
// DateRange: submission_analytics_date_left, submission_analytics_date_right
export type IDateRangeFilter = [number | null, number | null];
interface ISubmissionAnalyticsChartProps {
  userSubmissions: ISubmission[];
  contests: IContest[];
}
const SubmissionAnalyticsChart: FC<ISubmissionAnalyticsChartProps> = ({
  userSubmissions,
  contests,
}) => {
  const [userSubmissionAnalytics, setUserSubmissionAnalytics] = useState<any>(
    {}
  );
  const [analyticsXAxis, setanalyticsXAxis] =
    useState<UserAnalyticsKeys | null>(UserAnalyticsKeys.RATING);
  const [analyticsYAxis, setanalyticsYAxis] =
    useState<UserAnalyticsKeys | null>(UserAnalyticsKeys.STATUS);
  const [statusFilters, setStatusFilters] = useState<StatusOptions[]>([]);
  const [participantTypeFilters, setparticipantTypeFilters] = useState<
    string[]
  >([]);
  const [dateRangeFilters, setDateRangeFilters] = useState<IDateRangeFilter>([
    null,
    null,
  ]);

  const [xAxisCategories, setXAxisCategories] = useState<any>([]);
  const [series, setSeries] = useState<any>([]);

  const generateUserAnalyticsData = async () => {
    try {
      const userAnalyticsData = await processSubmissionAnalyticsData({
        userSubmissions: userSubmissions,
        contests: contests,
        statusFilters: statusFilters,
        participantTypeFilters: participantTypeFilters,
        dateRangeFilters: dateRangeFilters,
      });
      setUserSubmissionAnalytics(userAnalyticsData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    generateUserAnalyticsData();
  }, [
    contests,
    userSubmissions,
    statusFilters,
    participantTypeFilters,
    dateRangeFilters,
  ]);

  const handleChartPrepare = () => {
    if (!analyticsXAxis || !analyticsYAxis) {
      console.error("You need to choose both x and y axis");
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
      const xCategories =
        Object.keys(userSubmissionAnalytics?.[analyticsXAxis] || {}).sort(
          mixedSort
        ) ?? [];

      // Extract and sort yCategories
      const yCategories = new Set<string>();
      xCategories?.forEach((x) => {
        Object.keys(
          userSubmissionAnalytics?.[analyticsXAxis]?.[x]?.[analyticsYAxis] ?? {}
        )?.forEach((status) => {
          yCategories.add(status);
        });
      });
      const sortedYCategories = Array.from(yCategories).sort(mixedSort);

      // Generate the series from y categories
      const mySeries =
        sortedYCategories?.map((y) => {
          return {
            name: y,
            data: xCategories?.map(
              (x) =>
                userSubmissionAnalytics?.[analyticsXAxis]?.[x]?.[
                  analyticsYAxis
                ]?.[y] ?? 0
            ),
          };
        }) ?? {};
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
      <div className="flex flex-row m-4">
        <div className="">
          <div className="font-semibold">X Axis</div>
          <AxisSelectDropdown
            value={analyticsXAxis}
            allValues={userAnalyticsKeysArray}
            setValue={setanalyticsXAxis}
            id="x-axis"
          />
        </div>
        <div className="ml-4">
          <div className="font-semibold">Y Axis</div>
          <AxisSelectDropdown
            value={analyticsYAxis}
            allValues={userAnalyticsKeysArray}
            setValue={setanalyticsYAxis}
            id="y-axis"
          />
        </div>
        <div className="ml-8">
          <FilterSelectGroup
            values={statusGroup}
            options={statusFilters}
            setOptions={setStatusFilters}
            formLabel="Status"
            formHelperText="default is All if nothing selected"
          />
        </div>
        <div className="ml-4">
          <FilterSelectGroup
            values={participantType}
            options={participantTypeFilters}
            setOptions={setparticipantTypeFilters}
            formLabel="Participant"
            formHelperText="default is All if nothing selected"
          />
        </div>
      </div>
      <div className="">
        <FilterDateRange setDateRangeFilters={setDateRangeFilters} />
      </div>
      <div id="submission-chart" className="mt-12">
        <DynamicApexCharts
          options={options}
          series={series}
          type="bar"
          height={600}
        />
      </div>
    </div>
  );
};

export default SubmissionAnalyticsChart;
