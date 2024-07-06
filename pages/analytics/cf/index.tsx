"use client";
import React, {useEffect, useState} from "react";
import {IContest, ISubmission} from "../../../types";
import userData from "../../../data/CF/user_himanshu3889_cf.json";
import contestOriginalData from "../../../data/CF/contests_cf.json";
import SubmissionAnalyticsChart from "../../../components/analytics/cf/submissionAnalyticsChart/SubmissionAnalyticsChart";
import ProfileRatingChangeChart from "../../../components/analytics/cf/profileRatingChangeChart/ProfileRatingChangeChart";

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
  const [userSubmissions, setUserSubmissions] = useState<ISubmission[]>([]);
  const [contests, setcontests] = useState<IContest[]>([]);

  const fetchUserData = async () => {
    try {
      // TODO : NEED TO FETCH THEM FROM API
      const userSubmissionsData: ISubmission[] = userData.submissions
        .result as ISubmission[];
      const contestsData: IContest[] = contestOriginalData as IContest[];
      setUserSubmissions(userSubmissionsData);
      setcontests(contestsData);
    } catch (error) {
      console.error(error);
    }
  };

  // TODO : NEED TO CHANGE BASED ON THE USER profile
  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="px-8 py-4">
      <div className="bg-gray-100 rounded p-4 border border-gray-300">
        <ProfileRatingChangeChart handle={"himanshu3889"} />   // TODO HANDLE DYNAMICALLY
      </div>
      <div className="bg-gray-100 rounded my-4 p-4 border border-gray-300">
        <SubmissionAnalyticsChart
          userSubmissions={userSubmissions}
          contests={contests}
        />
      </div>
      <div>

      </div>
    </div>
  );
};

export default ApexChart;
