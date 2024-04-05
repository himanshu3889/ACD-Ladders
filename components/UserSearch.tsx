import React from "react";
import {useState} from "react";
import {
  ERROR_NOTIFICATION,
  notifyService,
  SUCCESS_NOTIFICATION,
} from "../service/notificationService/notifyService";
import {PLATFORMS} from "../configs/constants";
import {ThunkDispatch} from "@reduxjs/toolkit";
import {useDispatch, useSelector} from "react-redux";
import {IUserSlice} from "../features/user/userSlice";
import {
  fetchUserProfile,
  fetchUserSubmissions,
} from "../features/user/userAction";
import {IRootReducerState} from "../app/store";
import {updateFilter} from "../features/filters/filterSlice";

const UserSearch = () => {
  const dispatch: ThunkDispatch<any, any, any> = useDispatch();
  const platform: PLATFORMS | null = useSelector(
    (state: IRootReducerState) => state.problems.platform
  );
  const userState: IUserSlice = useSelector(
    (state: IRootReducerState) => state.user
  );
  const isLoadingUser: boolean =
    userState.isLoadingProfile || userState.isLoadingSubmissions;
  const [userId, setUserId] = useState<string>(userState.profile?.handle || "");

  const handleUserSearch = async () => {
    if (isLoadingUser || userId.length === 0) {
      return;
    }

    dispatch(
      updateFilter({
        problemsSeenCount: 0,
        problemsSeenMaxCount: 0,
      })
    );

    function userSearchNotify(found:boolean) {
      notifyService({
        message: `User ${!found ? "not": ""} Found: ${userId}`,
        type: found ? SUCCESS_NOTIFICATION : ERROR_NOTIFICATION,
        id: userId,
        position: "top-left",
      });
    }

    dispatch(fetchUserSubmissions({platform, userId})).then((response) => {
      if (response.meta.requestStatus === "fulfilled") {
        dispatch(fetchUserProfile({platform, userId})).then((response) => {
          if (response.meta.requestStatus === "fulfilled") {
            userSearchNotify(true)
          } else {
            userSearchNotify(false);
          }
        });
      } else {
        userSearchNotify(false);
      }
    });
  };

  return (
    <div className="p-0.5 pl-2">
      <div className="ml-auto sm:w-max relative">
        <input
          className={`${
            isLoadingUser && "cursor-wait"
          } peer bg-yellow-300 h-10 w-1/2 sm:w-auto md:h-12 p-4 text-lg font-semibold focus:bg-yellow-400 outline-none caret-blue-700`}
          type="text"
          name="userSearch"
          id="userSearch"
          value={userId}
          placeholder="Enter UserID"
          disabled={isLoadingUser}
          onChange={(event) => {
            setUserId(event.target.value.trim());
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleUserSearch();
            }
          }}
        />
        <button
          className={`${
            isLoadingUser && "cursor-progress"
          } bg-blue-700 hover:bg-blue-800 text-white font-semibold text-lg h-10 md:h-12 px-4 sm:px-10`}
          onClick={handleUserSearch}
        >
          <i
            className={`fa-solid  ${
              !isLoadingUser ? "fa-search" : "fa-circle-notch fa-spin"
            }`}
          ></i>
        </button>
      </div>
    </div>
  );
};

export default UserSearch;
