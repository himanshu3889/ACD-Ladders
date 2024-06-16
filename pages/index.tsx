import {ThunkDispatch} from "@reduxjs/toolkit";
import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import Sidebars from "../components/Sidebars";
import {PLATFORMS} from "../configs/constants";
import {setPlatform} from "../features/problems/problemSlice";
export const ACD_LADDERS_API = process.env.NEXT_PUBLIC_ACD_LADDERS_API;

const Home = () => {
  const dispatch: ThunkDispatch<any, any, any> = useDispatch();
  useEffect(() => {
    // clear all the states and fetch the data again
    dispatch(setPlatform(PLATFORMS.ACD));
  }, []);
  return <Sidebars />;
};

export default Home;
