import React, {useEffect, useRef} from "react";
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
import {
  IProblemsSlice,
  resetProblemsStatus,
} from "../features/problems/problemSlice";
import {IProblem} from "../types";
import {ISearchSlice} from "../features/search/searchSlice";
import {IFilterSlice, updateFilter} from "../features/filters/filterSlice";
import {problemsFilter} from "../features/evaluators/problemFilter";
import {StatusOptions} from "../features/filters/filterConstants";

const UserSearch = () => {
  const dispatch: ThunkDispatch<any, any, any> = useDispatch();
  const platform: PLATFORMS | null = useSelector(
    (state: IRootReducerState) => state.problems.platform
  );
  const userState: IUserSlice = useSelector(
    (state: IRootReducerState) => state.user
  );
  const problemsState: IProblemsSlice = useSelector(
    (state: IRootReducerState) => state.problems
  );

  const searchState: ISearchSlice = useSelector(
    (state: IRootReducerState) => state.search
  );
  const filterState: IFilterSlice = useSelector(
    (state: IRootReducerState) => state.filters
  );

  const myProblemsFilter = problemsFilter();

  const isLoadingUser: boolean =
    userState.isLoadingProfile || userState.isLoadingSubmissions;
  const [userId, setUserId] = useState<string>(userState.searchedHandle || "");
  const handleUserSearch = async () => {
    if (isLoadingUser || userId.length === 0) {
      return;
    }

    function userSearchNotify(found: boolean) {
      notifyService({
        message: `User ${!found ? "not" : ""} Found: ${userId}`,
        type: found ? SUCCESS_NOTIFICATION : ERROR_NOTIFICATION,
        id: userId,
        position: "top-left",
      });
    }

    try {
      await dispatch(
        fetchUserSubmissions({platform, userId})
      ).unwrap();
      await dispatch(
        fetchUserProfile({platform, userId})
      ).unwrap();
      userSearchNotify(true);
    } catch (error) {
      console.error(error);
      userSearchNotify(false);
    }
  };

  // When problems changed need to refresh the user submissions also
  const isInitialMount = useRef<boolean>(true);
  useEffect(() => {
    if (!isInitialMount.current) {
      handleUserSearch();
    } else {
      isInitialMount.current = false;
    }
  }, [problemsState.allProblems]);

  const searchProblems = async () => {
    if (searchState.searchPattern) {
      console.log("searching...", searchState.searchPattern);
      if (searchState.isSearchOnAllProblems) {
        // search the problems having pattern without filters
        await myProblemsFilter.handleSearchWtihoutFilters({
          isNewSearch: true,
        });
      } else {
        // search the problems having pattern with filters
        await myProblemsFilter.handleSearchWithFilter({isNewSearch: true});
      }
    } else {
      // search the problems normally without pattern
      await myProblemsFilter.handleFilter({isNewFilter: true});
    }
  };

  // user change -> problems status changes -> filter problem status change if the user remove
  useEffect(() => {
    // If status is not set to all problems then we need to go to search the problems again
    // TODO: if we have status of all problems then don't want to search the problems again
    // if (!userState && problemsState.problemsStatus !== )
    searchProblems();
    dispatch(
      updateFilter({
        currStatus: StatusOptions.All,
      })
    );
  }, [problemsState.problemsStatus]);

  useEffect(() => {
    // profile change need to update the problems status
    if (userState.profile) {
      myProblemsFilter.updateProblemsStatus({
        startIndex: 0,
        endIndex: 99999999,
        reupdate: true,
      });
    } else {
      dispatch(resetProblemsStatus());
    }
  }, [userState.profile]);

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
