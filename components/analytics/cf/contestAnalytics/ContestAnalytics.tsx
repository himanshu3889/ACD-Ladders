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

interface IContestAnalyticsProps {}
const ContestAnalytics: FC<IContestAnalyticsProps> = ({}) => {
  const [contestId, setContestId] = useState<string | null>("1839"); // TODO: SET DYNAMICALLY VIA INPUT
  const [contestStandings, setContestStandings] =
    useState<IContestStandings | null>(null);
  const [usersHandleRank, setUsersHandleRank] = useState<IUsersHandleRank>({});
  const [
    problemIndicesSolvedByUsersInSec,
    setproblemIndicesSolvedByUsersInSec,
  ] = useState<IIndicesSolvedByUsersInSec>({});

  const [contestUserHandles, setContestUserHandles] = useState<string[]>([
    "himanshu3889",
    "arvindf734",
    "BadalArya",
    "i_pranavmehta",
  ]);

  const fetchContestStandings = async () => {
    try {
      // TODO: USE API CALLS HERE
      const data: any =
        await require(`../../../../data/CF/contest_${contestId}_cf.json`);
      const contestStandingsData: IContestStandings =
        data.standings as IContestStandings;
      setContestStandings(contestStandingsData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchContestStandings();
  }, []);

  const getUserHandlesContestData = async () => {
    if (!contestStandings) {
      return;
    }
    // get users handles rank
    const usersHandleRankData: IUsersHandleRank = getHandlesRankInContest({
      contestStandings: contestStandings,
      userHandles: contestUserHandles,
    });
    console.log({usersHandleRankData});
    setUsersHandleRank(usersHandleRankData);

    // get time taken in sec by users to solve the problem indices
    const problemIndicesSolvedByUsers = getProblemIndicesSolvedByUsersInSec({
      contestStandings: contestStandings,
      userHandles: contestUserHandles,
    });
    console.log({problemIndicesSolvedByUsers});
    setproblemIndicesSolvedByUsersInSec(problemIndicesSolvedByUsers);
  };

  useEffect(() => {
    getUserHandlesContestData();
  }, [contestStandings, contestUserHandles]);

  // contestStandings change / contestUserHandles change -> usersHandleRank change -> problemIndicesSolvedByUsers change
  // contestStandings change -> problemIndicesSubmissionsArray change
  // both problemIndicesSolvedByUsers & problemIndicesSubmissionsArray changes -> chartData prepare

  return (
    <div>
      <input /> // TODO: USE THIS INPUT TO SET CONTEST ID
      {contestId && (
        <div>
          <div className="bg-gray-100 rounded my-4 p-4 border border-gray-300">
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
            {/* TODO: NEED TO PASS problemIndicesSolvedByUsersInSec to mark the points of each user series */}
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
