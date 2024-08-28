import CircularProgress from "@mui/material/CircularProgress";
import React, {FC, useEffect, useState} from "react";
import {IContestStandings} from "../../../../types";
import {
  getHandlesRankInContest,
  getProblemIndicesSolvedByUsersInSec,
  IIndicesSolvedByUsersInSec,
  IUsersHandleRank,
} from "../../../../utils/analytics/cf/contestAnalytics/processContestAnalyticsData";
import ContestAnalyticsProblemIndicesChart from "./contestAnalyticsProblemIndices/ContestAnalyticsProblemIndicesChart";
import ContestAnalyticsUserRankChart from "./contestAnalyticsUserRank/ContestAnalyticsUserRankChart";
import SearchInput from "../../../globals/SearchInput";
import {parseNumber, removeSpaces} from "../../../../utils/stringAlgos";
import {fetchContestStandingsApi} from "../../../../service/codeforces";
import DissmissableLabel from "../../../globals/DissmissableLabel";
import {Alert, AlertTitle} from "@mui/material";
import useSearchParamsCustom from "../../../../hooks/useSearchParamsCustom";
import {
  ERROR_NOTIFICATION,
  notifyService,
} from "../../../../service/notificationService/notifyService";

const contestIdParam = "contest_id";
const contestUserHandlesParam = "contest_handles";

interface IContestAnalyticsProps {}
const ContestAnalytics: FC<IContestAnalyticsProps> = ({}) => {
  const {getSearchParam, updateSearchParams} = useSearchParamsCustom();
  const [contestId, setContestId] = useState<string | null>(null);
  const [contestStandings, setContestStandings] =
    useState<IContestStandings | null>(null);
  const [isLoadingContest, setisLoadingContest] = useState<boolean>(false);

  const [usersHandleRank, setUsersHandleRank] = useState<IUsersHandleRank>({});
  const [
    problemIndicesSolvedByUsersInSec,
    setproblemIndicesSolvedByUsersInSec,
  ] = useState<IIndicesSolvedByUsersInSec>({});

  const [contestUserHandles, setContestUserHandles] = useState<string[]>([]);

  useEffect(() => {
    const contestId_ = getSearchParam(contestIdParam);
    const contestUserHandles_ = getSearchParam(contestUserHandlesParam);
    if (contestId_) {
      setContestId(contestId_);
    }
    if (contestUserHandles_) {
      const contestUserHandlesArr = contestUserHandles_.split(" ");
      setContestUserHandles(contestUserHandlesArr);
    }
  }, []);

  const fetchContestStandings = async () => {
    if (!contestId) {
      return;
    }
    try {
      setisLoadingContest(true);
      const response = await fetchContestStandingsApi(contestId ?? "", 10000);
      const contestStandingsData: IContestStandings = response.result;
      setContestStandings(contestStandingsData);
      setisLoadingContest(false);
      updateSearchParams({[contestIdParam]: contestId});
    } catch (error: any) {
      console.error(error);
      setContestId(null);
      setContestStandings(null);
      setisLoadingContest(false);
      updateSearchParams({[contestIdParam]: null});
      notifyService({
        message: error.response.data.comment,
        type: ERROR_NOTIFICATION,
      });
    }
  };

  useEffect(() => {
    fetchContestStandings();
  }, [contestId]);

  const getUserHandlesContestData = async () => {
    if (!contestStandings) {
      return;
    }
    // get users handles rank
    const usersHandleRankData: IUsersHandleRank = getHandlesRankInContest({
      contestStandings: contestStandings,
      userHandles: contestUserHandles,
    });
    setUsersHandleRank(usersHandleRankData);

    // get time taken in sec by users to solve the problem indices
    const problemIndicesSolvedByUsers = getProblemIndicesSolvedByUsersInSec({
      contestStandings: contestStandings,
      userHandles: contestUserHandles,
    });
    setproblemIndicesSolvedByUsersInSec(problemIndicesSolvedByUsers);
    updateSearchParams({
      [contestUserHandlesParam]: contestUserHandles.join(" "),
    });
  };

  useEffect(() => {
    getUserHandlesContestData();
  }, [contestStandings, contestUserHandles]);

  const handleContestIdInput = (value: string | null | undefined) => {
    const newValue = parseNumber(value ?? "");
    setContestId(newValue);
  };

  const handleAddContestUserHandle = (userHandle: string | null) => {
    if (!userHandle || contestUserHandles.includes(userHandle)) {
      return;
    }
    const newContestUserHandles = [...contestUserHandles, userHandle];
    setContestUserHandles(newContestUserHandles);
    
  };

  const handleRemoveContestId = () => {
    setContestId(null);
    updateSearchParams({[contestIdParam]: null});
  };

  const handleRemoveContestUserHandle = (index: number) => {
    if (index > -1 && index < contestUserHandles.length) {
      let updatedContestUserHandles = [...contestUserHandles];
      updatedContestUserHandles.splice(index, 1);
      setContestUserHandles(updatedContestUserHandles);
    }
  };

  return (
    <div>
      <div className="flex flex-col w-full bg-gray-100 space-y-1">
        <div className="flex flex-row justify-start items-center space-x-2 p-2 w-full rounded">
          <SearchInput
            searchValue={contestId}
            inputMiddleware={parseNumber}
            setSearchValue={handleContestIdInput}
            placeholder="Enter Contest Id"
          />
          {isLoadingContest && <CircularProgress size={30} />}
          {!isLoadingContest && contestId && (
            <DissmissableLabel
              text={contestId}
              onRemove={handleRemoveContestId}
              className="bg-blue-200 py-2 ml-4"
            />
          )}
        </div>
        {!contestId && (
          <Alert severity="info" variant="filled">
            <AlertTitle>
              Enter and search the contest id to view the contest analytics
            </AlertTitle>
          </Alert>
        )}
      </div>
      {contestId && contestStandings && (
        <div>
          <div className="bg-gray-100 rounded my-4 p-4 border border-gray-300">
            <div className="flex flex-row items-center justify-start">
              <SearchInput
                searchValue={""}
                setSearchValue={handleAddContestUserHandle}
                placeholder="Add User Handle"
                resetAfterSearch={true}
                inputMiddleware={removeSpaces}
              />
              {!isLoadingContest && (
                <div className="flex flex-row justify-start items-center">
                  {contestUserHandles.map(
                    (contestUserHandle: string, index: number) => (
                      <DissmissableLabel
                        key={index}
                        text={contestUserHandle}
                        onRemove={() => handleRemoveContestUserHandle(index)}
                        className="bg-blue-200 py-1 ml-4"
                      />
                    )
                  )}
                </div>
              )}
            </div>
            <ContestAnalyticsProblemIndicesChart
              contestId={contestId}
              contestStandings={contestStandings}
              contestUserHandles={contestUserHandles}
              usersHandleRank={usersHandleRank}
              problemIndicesSolvedByUsersInSec={
                problemIndicesSolvedByUsersInSec
              }
            />
          </div>
          <div className="bg-gray-100 rounded my-4 p-4 border border-gray-300">
            <ContestAnalyticsUserRankChart
              contestId={contestId}
              contestStandings={contestStandings}
              usersHandlesRank={usersHandleRank}
              problemIndicesSolvedByUsersInSec={
                problemIndicesSolvedByUsersInSec
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ContestAnalytics;
