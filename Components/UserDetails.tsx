import React from "react";
import useUserStore from "../store/User";
import Link from "next/link";
import useProblemsStore from "../store/Problems";
import { toast } from "react-toastify";

export default function UserDetails() {
  const { userProfile, removeUser, userSolvedProblems }: any = useUserStore();
  const { removeFiltering }: any = useProblemsStore();

    const userRemoveInfoNotify = () => {
      const screenWidth = window.innerWidth;
      const width = screenWidth <= 768 ? "70%" : "100%";
      toast.info(`User Removed Successfully : ${userProfile?.handle} `, {
        position: toast.POSITION.TOP_LEFT,
        theme: "colored",
        pauseOnHover: false,
        style: {
          marginTop: "56px",
          width: width,
        },
      });
    };

  const getTextColorStyleByRank = (rank: string) => {
    return rank === "pupil"
      ? "text-green-500"
      : rank === "specialist"
      ? "text-cyan-500"
      : rank === "expert"
      ? "text-blue-500"
      : rank === "candidate master"
      ? "text-fuchsia-600"
      : rank === "master" || rank === "international master" 
      ? "text-orange-500"
      : rank === "grandmaster" || rank === "legendary grandmaster" || rank === "international grandmaster"
      ? "text-red-500"
      : "text-gray-500";
  };

  const userIDColorStyleByRank = () => {
    const userID:string = userProfile?.handle ;
    const rank: string = userProfile?.rank;
    const country:string = userProfile?.country;
    const displayName: string = userID?.substring(1);
    const rankColorStyle: string = getTextColorStyleByRank(rank);
    return (
      <span className="text-sm font-bold ">
        <span
          className={rank !== "legendary grandmaster" ? rankColorStyle : ""}
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
          <Link href={`https://codeforces.com/profile/${userProfile?.handle}`} legacyBehavior>
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
          <div className="flex">{userIDColorStyleByRank()}</div>
          <div className="flex text-xs text-gray-600">
            <span>
              {userProfile?.firstName} {userProfile?.lastName} (
              {userProfile.rank}){" "}
            </span>
          </div>
          <div className="flex text-xs text-gray-600">
            <span>
              Rating : {userProfile?.rating} (Max : {userProfile?.maxRating})
            </span>
          </div>
        </div>
      <div className="md:absolute top-0 right-0 cursor-pointer md:opacity-0 md:group-hover:opacity-100 text-red-400 hover:text-red-600 px-1">
        <i
          className="fa-solid fa-xmark text-xl"
          onClick={() => {
            userRemoveInfoNotify();
            removeFiltering();
            removeUser();
          }}
        ></i>
      </div>
      </div>
    </div>
  );
}
