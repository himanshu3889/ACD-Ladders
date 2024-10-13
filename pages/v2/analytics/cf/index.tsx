"use client";
import React, {useEffect, useState} from "react";
import {IContest, ISubmission} from "../../../../types";
import SubmissionAnalyticsChart from "../../../../components/analytics/cf/submissionAnalyticsChart/SubmissionAnalyticsChart";
import ProfileRatingChangeChart from "../../../../components/analytics/cf/profileRatingChangeChart/ProfileRatingChangeChart";
import ContestAnalytics from "../../../../components/analytics/cf/contestAnalytics/ContestAnalytics";
import SearchInput from "../../../../components/globals/SearchInput";
import {
  fetchCFContestsApi,
  fetchCFUserSubmissionsApi,
} from "../../../../service/codeforces";
import {removeSpaces} from "../../../../utils/stringAlgos";
import DissmissableLabel from "../../../../components/globals/DissmissableLabel";
import {Alert, AlertTitle, CircularProgress} from "@mui/material";
import useSearchParamsCustom from "../../../../hooks/useSearchParamsCustom";
import {
  ERROR_NOTIFICATION,
  notifyService,
} from "../../../../service/notificationService/notifyService";

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
const userHandleParam = "user_handle";

const ApexChart: React.FC = () => {
  const {getSearchParam, updateSearchParams} = useSearchParamsCustom();
  const [userHandle, setUserHandle] = useState<string | null>(null);
  const [userSubmissions, setUserSubmissions] = useState<ISubmission[]>([]);
  const [contests, setcontests] = useState<IContest[]>([]);
  const [isLoadingSubmissionsAndContests, setisLoadingSubmissionsAndContests] =
    useState<boolean>(false);

  const fetchUserData = async () => {
    if (!userHandle) {
      return;
    }
    try {
      setisLoadingSubmissionsAndContests(true);
      const submissionResponse = await fetchCFUserSubmissionsApi(userHandle);
      const contestsResponse = await fetchCFContestsApi();
      const userSubmissionsData: ISubmission[] = submissionResponse.result;
      const contestsData = contestsResponse.result;
      setUserSubmissions(userSubmissionsData);
      setcontests(contestsData);
      updateSearchParams({[userHandleParam]: userHandle});
      setisLoadingSubmissionsAndContests(false);
    } catch (error: any) {
      console.error(error);
      setUserHandle(null);
      setUserSubmissions([]);
      setcontests([]);
      setisLoadingSubmissionsAndContests(false);
      notifyService({
        message: error.response.data.comment,
        type: ERROR_NOTIFICATION,
      });
      updateSearchParams({[userHandleParam]: null}); 
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userHandle]);

  useEffect(() => {
    const handle = getSearchParam(userHandleParam);
    if (handle) {
      setUserHandle(handle);
    }
  }, []);

  const handleUserHandleInput = (value: string | null) => {
    setUserHandle(value ?? null);
  };

  const handleRemoveUserHandle = () => {
    setUserHandle(null);
    setUserSubmissions([]);
    setcontests([]);
    updateSearchParams({[userHandleParam]: null}); 
  };

  return (
    <div className="px-4 py-4">
      <div className="flex flex-col space-y-1 bg-gray-100 w-full rounded">
        <div className="flex flex-row items-center justify-start p-2 w-full">
          <SearchInput
            searchValue={userHandle}
            setSearchValue={handleUserHandleInput}
            placeholder="Enter User Handle"
            inputMiddleware={removeSpaces}
          />
          {isLoadingSubmissionsAndContests && (
            <CircularProgress className="ml-4" size={30} />
          )}
          {!isLoadingSubmissionsAndContests && userHandle && (
            <DissmissableLabel
              text={userHandle}
              onRemove={handleRemoveUserHandle}
              className="bg-blue-200 py-2 ml-4"
            />
          )}
        </div>
        {!userHandle && (
          <Alert severity="info" variant="filled">
            <AlertTitle>
              Enter and search the user handle to view it's profile rating and
              submission analytics chart
            </AlertTitle>
          </Alert>
        )}
      </div>
      {!isLoadingSubmissionsAndContests && userHandle && (
        <div className="w-full h-full">
          <div className="bg-gray-100 rounded  my-4 p-4 border border-gray-300">
            <ProfileRatingChangeChart
              userHandle={userHandle}
              setUserHandle={setUserHandle}
              isLoadingSubmissionsAndContests={isLoadingSubmissionsAndContests}
            />
          </div>
          <div className="bg-gray-100 rounded my-4 p-4 border border-gray-300">
            <SubmissionAnalyticsChart
              userSubmissions={userSubmissions}
              contests={contests}
            />
          </div>
        </div>
      )}
      <div className="my-4">
        <ContestAnalytics />
      </div>
    </div>
  );
};

export default ApexChart;
