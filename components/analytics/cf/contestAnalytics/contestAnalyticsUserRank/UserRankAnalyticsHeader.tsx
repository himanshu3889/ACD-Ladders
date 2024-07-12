import React, { FC, useEffect, useState } from "react";
import {
  IIndicesSolvedByUsersInSec,
  IUsersHandleRank,
} from "../../../../../utils/analytics/cf/contestAnalytics/processContestAnalyticsData";

export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

type IIndicesOrUserSubmissionOrder = {
  [problemIndex: string]: [string, number][];
};

interface IUserRankAnalyticsHeader {
  problemIndicesSolvedByUsersInSec: IIndicesSolvedByUsersInSec;
  usersHandlesRank: IUsersHandleRank;
}

const UserRankAnalyticsHeader: FC<IUserRankAnalyticsHeader> = ({
  problemIndicesSolvedByUsersInSec,
  usersHandlesRank,
}) => {
  const [indicesSubmissionOrder, setIndicesSubmissionOrder] =
    useState<IIndicesOrUserSubmissionOrder>({});
  const [userSubmissionOrder, setUserSubmissionOrder] =
    useState<IIndicesOrUserSubmissionOrder>({});

  const getIndicesSubmissionOrder = () => {
    console.log({ problemIndicesSolvedByUsersInSec }, "rank header se");

    const indicesSubmissionData = Object.keys(
      problemIndicesSolvedByUsersInSec
    )
      .sort()
      .reduce((acc, problemIndex) => {
        const users = Object.entries(
          problemIndicesSolvedByUsersInSec[problemIndex]
        ).sort(([, timeA], [, timeB]) => timeA - timeB);

        acc[problemIndex] = users;
        return acc;
      }, {} as IIndicesOrUserSubmissionOrder);

    setIndicesSubmissionOrder(indicesSubmissionData);
  };

  const getUserSubmissionOrder = () => {
    const userSubmissionData: { [user: string]: [string, number][] } = {};

    Object.entries(problemIndicesSolvedByUsersInSec)?.forEach(
      ([problemIndex, users]) => {
        Object.entries(users)?.forEach(([user, time]) => {
          if (!userSubmissionData[user]) {
            userSubmissionData[user] = [];
          }
          userSubmissionData[user].push([problemIndex, time]);
        });
      }
    );

    Object.keys(userSubmissionData)?.forEach((user) => {
      userSubmissionData[user]?.sort(([, timeA], [, timeB]) => timeA - timeB);
    });

    setUserSubmissionOrder(userSubmissionData);
  };

  useEffect(() => {
    getIndicesSubmissionOrder();
    getUserSubmissionOrder();
  }, [problemIndicesSolvedByUsersInSec]);

  return (
    <div>
      <div className="mb-4">
        <div className="font-bold text-lg text-blue-600">
          Indices Submissions Order:
        </div>
        <div className="text-gray-700">
          {Object.entries(indicesSubmissionOrder).map(
            ([problemIndex, submissions], index: number) => {
              return (
                <div key={index} className="flex flex-row items-center">
                  <div className="font-semibold mr-4">{problemIndex}:</div>
                  <div className="flex flex-row items-center space-x-2">
                    {submissions.map(
                      ([userHandle, timeInSec], index: number) => (
                        <div key={index} className="flex flex-row items-center">
                          {index > 0 && <div className="mr-2">{`-->`}</div>}
                          <div className="font-semibold">{userHandle}</div>
                          <div>({formatTime(timeInSec)})</div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
      <div className="mb-2">
        <div className="font-bold text-lg text-blue-600">
          User Submissions Order:
        </div>
        <div className="text-gray-700">
          {Object.entries(usersHandlesRank)
            .sort(([, rankA], [, rankB]) => rankA - rankB)
            .map(([userHandle, userHandleRank], index: number) => {
              return (
                <div key={index} className="flex flex-row items-center">
                  <div className="flex flex-row items-center mr-4">
                    <div className="font-semibold mr-1">{userHandle}</div>
                    (Rank {userHandleRank}):
                  </div>
                  <div className="flex flex-row items-center space-x-2">
                    {userSubmissionOrder?.[userHandle]?.map(
                      ([submission, timeInSec], index: number) => (
                        <div key={index} className="flex flex-row items-center">
                          {index > 0 && <div className="mr-2">{`-->`}</div>}
                          <div className="font-semibold">{submission}</div>
                          <div>({formatTime(timeInSec)})</div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default UserRankAnalyticsHeader;
