import { useEffect, useState } from "react";
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const CODEFORCES_API = process.env.NEXT_PUBLIC_CODEFORCES_API;
import FilterSidebar from "../Components/FilterSidebar";
import ProblemsSidebar from "../Components/ProblemsSidebar";
import useProblemsStore from "../store/Problems";
import useUserStore from "../store/User";


const Home = () => {
  const {
    removeFiltering,
    fetchAllProblemsAndContest,
  }: any = useProblemsStore();

  const { removeUser }: any = useUserStore();

  const problemsPerPage: number = 25; // fixed number of problems on the page
  const [pageNumber, setPageNumber] = useState<number>(1);

  const [sortingParam, setSortingParam] = useState<string>("");
  const [sortingOrder, setSortingOrder] = useState<number>(0);
  const sortingOrdersArr : [string, string, string] = ["", "ASC", "DSC"]
  
  useEffect(() => {
    const fetchData = async () => {
      await removeFiltering();
      await fetchAllProblemsAndContest();
      await removeUser();
    };
    fetchData();
  }, []);
  
  return (
    <div>
      <div className="flex flex-row font-sans bg-gray-200">
        <div className="overflow-x-auto flex-auto w-2/3 mr-1 border-2 rounded-md bg-slate-600">
          <ProblemsSidebar
            problemsPerPage={problemsPerPage}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            sortingParam={sortingParam}
            setSortingParam={setSortingParam}
            sortingOrder={sortingOrder}
            setSortingOrder={setSortingOrder}
            sortingOrdersArr={sortingOrdersArr}
          />
        </div>

        <div className="flex-auto overflow-x-auto w-1/3 ml-1 border-2 rounded-md bg-slate-600">
          <FilterSidebar
            problemsPerPage={problemsPerPage}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            sortingParam={sortingParam}
            setSortingParam={setSortingParam}
            sortingOrder={sortingOrder}
            setSortingOrder={setSortingOrder}
            sortingOrdersArr={sortingOrdersArr}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
