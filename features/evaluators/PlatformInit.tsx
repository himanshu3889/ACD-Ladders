/* eslint-disable react-refresh/only-export-components */
import {ThunkDispatch} from "@reduxjs/toolkit";
import {FC, PropsWithChildren, useEffect, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../app/store";
import {PLATFORMS} from "../../configs/constants";
import {
  ERROR_NOTIFICATION,
  notifyService,
} from "../../service/notificationService/notifyService";
import {fetchAllContests} from "../contests/contestAction";
import {updateFilter} from "../filters/filterSlice";
import {fetchAllProblems, preprocessProblems} from "../problems/problemAction";
import {fetchUserProfile, fetchUserSubmissions} from "../user/userAction";

const PlatformInit: FC<PropsWithChildren> = ({children}) => {
  const dispatch: ThunkDispatch<any, any, any> = useDispatch();
  const platform: PLATFORMS = useSelector(
    (state: IRootReducerState) => state.problems.platform
  );
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      console.log(`Refresh ${platform}....`);
      dispatch(fetchAllProblems({platform: platform}))
        .then((result) => {
          const {platform, allProblems}: any = result.payload;
          dispatch(
            preprocessProblems({platform: platform, problems: allProblems})
          );
        })
        .catch((error) => {
          console.error(error);
          notifyService({
            message:
              "Unable to fetch the problem data from whatever the platform",
            type: ERROR_NOTIFICATION,
          });
        });

      // Fetch the contests data
      dispatch(fetchAllContests({platform: platform}))
        .then((result) => {})
        .catch((error) => {
          console.error(error);
          notifyService({
            message:
              "Unable to fetch the contest data from whatever the platform",
            type: ERROR_NOTIFICATION,
          });
        });

      dispatch(updateFilter({problemsSeenMaxCount: 0, problemsSeenCount: 0}));
    }
  }, [platform]);
  return <>{children}</>;
};

export {PlatformInit};

