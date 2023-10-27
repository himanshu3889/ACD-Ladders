import { useEffect, useState } from "react";
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const CODEFORCES_API = process.env.NEXT_PUBLIC_CODEFORCES_API;
import FilterSidebar from "../Components/FilterSidebar";
import ProblemsSidebar from "../Components/ProblemsSidebar";
import useProblemsStore from "../store/Problems";
import useUserStore from "../store/User";

const Home = () => {
  const { removeFiltering, fetchAllProblemsAndContest }: any =
    useProblemsStore();

  const { removeUser }: any = useUserStore();

  const [problemsPerPage, setProblemsPerPage] = useState<number>(25);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const [sortingParam, setSortingParam] = useState<string>("");
  const [sortingOrder, setSortingOrder] = useState<number>(0);
  const sortingOrdersArr: [string, string, string] = ["", "ASC", "DSC"];
  const [isShowingFilterSideBar, setIsShowingFilterSideBar] =
    useState<boolean>(true);

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
        <div
          className={`overflow-x-auto flex-auto ${
            isShowingFilterSideBar ? "w-1/2 sm:w-2/3" : "w-full"
          } mr-1 border-2 rounded-md bg-slate-600`}
        >
          <ProblemsSidebar
            problemsPerPage={problemsPerPage}
            setProblemsPerPage={setProblemsPerPage}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            sortingParam={sortingParam}
            setSortingParam={setSortingParam}
            sortingOrder={sortingOrder}
            setSortingOrder={setSortingOrder}
            sortingOrdersArr={sortingOrdersArr}
          />
        </div>

        <div
          className={`flex-auto overflow-x-auto ${
            isShowingFilterSideBar ? "w-1/2 sm:w-1/3" : ""
          } ml-1 border-2 rounded-md bg-slate-600`}
        >
          <FilterSidebar
            problemsPerPage={problemsPerPage}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            sortingParam={sortingParam}
            setSortingParam={setSortingParam}
            sortingOrder={sortingOrder}
            setSortingOrder={setSortingOrder}
            sortingOrdersArr={sortingOrdersArr}
            isShowingFilterSideBar={isShowingFilterSideBar}
          />
          <i
            className={`cursor-pointer opacity-80 hover:opacity-100 text-2xl  fa-solid ${
              isShowingFilterSideBar
                ? "fa-chevron-right bg-white text-gray-900 border-2 border-gray-700 "
                : "fa-chevron-left bg-gray-900 text-white border-2 border-white"
            } absolute top-1/2 transform -translate-y-1/2 right-0 cursor-pointer z-10 rounded-full p-2 w-10 h-10`}
            onClick={() => setIsShowingFilterSideBar(!isShowingFilterSideBar)}
            title={`${!isShowingFilterSideBar ? "Open" : "Close"} Filter`}
          ></i>
        </div>
      </div>
    </div>
  );
};

export default Home;
