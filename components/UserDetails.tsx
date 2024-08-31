import React, {FC} from "react";
import Link from "next/link";
import {
  INFO_NOTIFICATION,
  notifyService,
} from "../service/notificationService/notifyService";
import {ThunkDispatch} from "@reduxjs/toolkit";
import {useDispatch, useSelector} from "react-redux";
import {resetUser} from "../features/user/userSlice";
import {IRootReducerState} from "../app/store";
import {IUser} from "../types";

export const getUserRankColorStyle = (rank: string) => {
  const rankLowerCase: string = rank.toLowerCase();
  return rankLowerCase === "pupil"
    ? "text-green-500"
    : rankLowerCase === "specialist"
    ? "text-cyan-500"
    : rankLowerCase === "expert"
    ? "text-blue-500"
    : rankLowerCase === "candidate master"
    ? "text-fuchsia-600"
    : rankLowerCase === "master" || rankLowerCase === "international master"
    ? "text-orange-500"
    : rankLowerCase === "grandmaster" ||
      rankLowerCase === "legendary grandmaster" ||
      rankLowerCase === "international grandmaster" ||
      rankLowerCase === "tourist"
    ? "text-red-500"
    : "text-gray-500";
};

export default function UserDetails() {
  const dispatch: ThunkDispatch<any, any, any> = useDispatch();
  const userProfile: IUser | null = useSelector(
    (state: IRootReducerState) => state.user.profile
  );

  const userID: string = userProfile?.handle || "";
  const rank: string = userProfile?.rank || "";
  const country: string = userProfile?.country || "";
  const displayName: string = userID?.substring(1);
  const rankColorStyle: string = getUserRankColorStyle(rank);
  const userRating: number = userProfile?.rating ?? 0

  // TODO: GO TO THE PAGE 1 if user problem status is not all
  const handleRemoveUser = () => {
    dispatch(resetUser());
    notifyService({
      message: `User Removed Successfully : ${userProfile?.handle} `,
      type: INFO_NOTIFICATION,
      position: "top-left",
    });
  };

  const UserIDColorStyleByRank: FC = () => {
    return (
      <span className="text-sm font-bold ">
        <span
          className={userRating < 3000  ? rankColorStyle : ""}
        >
          {userID?.charAt(0)}
        </span>
        <span className={rankColorStyle}>{displayName}</span>
        {country && (
          <span className="ml-2 font-normal italic text-gray-700">
            ({country})
          </span>
        )}
      </span>
    );
  };

  return (
    <div className="flex flex-row group">
      <div className="each flex rounded shadow w-max md:mr-2 ml-2 bg-gray-50 relative">
        <div className="sec self-center p-0.5 pr-1">
          <Link
            href={`https://codeforces.com/profile/${userID}`}
            legacyBehavior
          >
            <a target="_blank">
              <img
                className="cursor-pointer h-10 w-10 border p-0.5 rounded-full bg-gray-500 hover:border-2 hover:bg-blue-500"
                src={userProfile?.avatar}
                alt=""
              />
            </a>
          </Link>
        </div>
        <div className="sec self-center p-0 w-64 hidden md:inline-block">
          <div className="flex">
            <UserIDColorStyleByRank />
          </div>
          <div className="flex text-xs text-gray-600">
            <span>
              {userProfile?.firstName} {userProfile?.lastName} (
              {userProfile?.rank || ""}){" "}
            </span>
          </div>
          <div className="flex text-xs text-gray-600">
            <span>
              Rating : {userRating} (Max : {userProfile?.maxRating})
            </span>
          </div>
        </div>
        <div className="md:absolute top-0 right-0 cursor-pointer text-red-400 hover:text-red-600 px-1">
          <i
            className="fa-solid fa-xmark text-xl"
            onClick={handleRemoveUser}
          ></i>
        </div>
      </div>
    </div>
  );
}
