import React from "react";
import Sidebars from "../Components/Sidebars";
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const CODEFORCES_API = process.env.NEXT_PUBLIC_CODEFORCES_API;
export const ACD_LADDERS_API = process.env.NEXT_PUBLIC_ACD_LADDERS_API;

const Home = () => {
  return <Sidebars isAcdLaddersPage={false} />;
};

export default Home;
