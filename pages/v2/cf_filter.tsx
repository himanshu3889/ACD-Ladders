import {ThunkDispatch} from "@reduxjs/toolkit";
import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import Sidebars from "../../components/Sidebars";
import {PLATFORMS} from "../../configs/constants";
import {platformInit} from "../../features/evaluators/PlatformInit";
import {setPlatform} from "../../features/problems/problemSlice";

const CodeforcesHome = () => {
  const dispatch: ThunkDispatch<any, any, any> = useDispatch();
  const platform = PLATFORMS.CF;
  useEffect(() => {
    // clear all the states and fetch the data again
    dispatch(setPlatform(platform));
    platformInit({platform: platform, dispatch: dispatch});
  }, []);

  return <Sidebars />;
};

export default CodeforcesHome;
