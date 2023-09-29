import axios from "axios";
import useProblemsStore from "../store/Problems";
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const CODEFORCES_API = process.env.NEXT_PUBLIC_CODEFORCES_API;


const Home = () => {


  return (
    <h1 className="text-3xl font-bold bg-red-400">Hello world! index.ts se</h1>
  );
};



export default Home;
