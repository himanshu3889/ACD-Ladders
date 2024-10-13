/* eslint-disable react-refresh/only-export-components */
import {ThunkDispatch} from "@reduxjs/toolkit";
import {useDispatch} from "react-redux";
import {PLATFORMS} from "../../configs/constants";
import {
  ERROR_NOTIFICATION,
  notifyService,
} from "../../service/notificationService/notifyService";
import {fetchAllContests} from "../contests/contestAction";
import {updateFilter} from "../filters/filterSlice";
import {fetchAllProblems, preprocessProblems} from "../problems/problemAction";

interface IPlatformInitProps {
  platform: PLATFORMS;
  dispatch: ThunkDispatch<any, any, any>;
}

export const platformInit = ({platform, dispatch}: IPlatformInitProps) => {
  console.log(`Refresh ${platform}....`);
  dispatch(fetchAllProblems({platform: platform}))
    .then((result) => {
      const {platform, allProblems}: any = result.payload;
      dispatch(preprocessProblems({platform: platform, problems: allProblems}));
    })
    .catch((error) => {
      console.error(error);
      notifyService({
        message: "Unable to fetch the problem data from whatever the platform",
        type: ERROR_NOTIFICATION,
      });
    });

  // Fetch the contests data
  dispatch(fetchAllContests({platform: platform}))
    .then((result) => {})
    .catch((error) => {
      console.error(error);
      notifyService({
        message: "Unable to fetch the contest data from whatever the platform",
        type: ERROR_NOTIFICATION,
      });
    });

  dispatch(updateFilter({problemsSeenCount: 0}));
};
