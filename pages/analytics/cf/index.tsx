"use client";
import React, {useEffect, useState} from "react";
import dynamic from "next/dynamic";
import {IContest, ISubmission} from "../../../types";
import userData from "../../../data/CF/user_himanshu3889_cf.json";
import contestOriginalData from "../../../data/CF/contests_cf.json";
import {getUserAnalyticsData} from "../../../components/analytics/cf/generateUserAnalyticsData";
import {titleCase} from "../../../utils/stringAlgos";
import AxisSelectDropdown from "../../../components/analytics/cf/AxisSelectDropdown";
import SubmissionChart from "../../../components/analytics/cf/submissionAnalyticsChart/SubmissionAnalyticsChart";
import SubmissionAnalyticsChart from "../../../components/analytics/cf/submissionAnalyticsChart/SubmissionAnalyticsChart";
import ProfileRatingChangeChart from "./rating_change";

const DynamicApexCharts = dynamic(() => import("react-apexcharts"), {
  ssr: false, // Ensure ApexCharts is not imported during SSR
});

export enum UserAnalyticsKeys {
  RATING = "rating",
  TAG = "tag",
  STATUS = "status",
  CONTEST_TYPE = "contest type",
  INDEX = "index",
  PARTICIPANT_TYPE = "participant type",
}

export const userAnalyticsKeysArray: UserAnalyticsKeys[] =
  Object.values(UserAnalyticsKeys);

export const ANALYTICS_TOTAL: string = "total";

const ApexChart: React.FC = () => {
  const [userSubmissionAnalytics, setUserSubmissionAnalytics] = useState<any>(
    {}
  );
  const [xAxisCategories, setXAxisCategories] = useState<any>([]);
  const [series, setSeries] = useState<any>([]);

  const fetchUserData = async () => {
    try {
      // TODO : NEED TO FETCH THEM FROM API
      const userSubmissions: ISubmission[] = userData.submissions
        .result as ISubmission[];
      const contests: IContest[] = contestOriginalData as IContest[];
      const userFilteredData = await getUserAnalyticsData({
        userSubmissions: userSubmissions,
        contests: contests,
      });
      setUserSubmissionAnalytics(userFilteredData);
    } catch (error) {
      console.error(error);
    }
  };

  // TODO : NEED TO CHANGE BASED ON THE USER profile
  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="p-4">
      <div>
        <ProfileRatingChangeChart />
      </div>
      <div>
        <SubmissionAnalyticsChart
          userSubmissionAnalytics={userSubmissionAnalytics}
        />
      </div>
    </div>
  );
};

export default ApexChart;
