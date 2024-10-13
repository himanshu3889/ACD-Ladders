import ProblemTableRow from "./ProblemTableRow";
import ProblemTableFooter from "./ProblemTableFooter";
import {IProblemsSlice} from "../../features/problems/problemSlice";
import {IUserSlice} from "../../features/user/userSlice";
import {useDispatch, useSelector} from "react-redux";
import {IFilterSlice, updateFilter} from "../../features/filters/filterSlice";
import {IRootReducerState} from "../../app/store";
import {
  problemsPerPage,
  SortingOrders,
  SortingParams,
  sortingParamsList,
  StatusOptions,
} from "../../features/filters/filterConstants";
import {ThunkDispatch} from "@reduxjs/toolkit";
import {PLATFORMS} from "../../configs/constants";
import TextSearch from "../textSearch/TextSearch";
import {ISearchSlice} from "../../features/search/searchSlice";

const ProblemsSidebar = () => {
  const dispatch: ThunkDispatch<any, any, any> = useDispatch();

  const problemsState: IProblemsSlice = useSelector(
    (state: IRootReducerState) => state.problems
  );
  const filtersState: IFilterSlice = useSelector(
    (state: IRootReducerState) => state.filters
  );
  const userState: IUserSlice = useSelector(
    (state: IRootReducerState) => state.user
  );
  const searchState: ISearchSlice = useSelector(
    (state: IRootReducerState) => state.search
  );

  const platform: PLATFORMS = problemsState.platform;
  const handleSorting = (param: string) => {
    if (problemsState.isLoading) {
      return;
    }

    // If click on other than sorting parameters
    if (!sortingParamsList.includes(param as SortingParams)) {
      if (filtersState.sortingParam !== "") {
        dispatch(
          updateFilter({sortingParam: "", sortingOrder: SortingOrders.None})
        );
      }
      return;
    }

    if (filtersState.sortingParam === param) {
      if (filtersState.sortingOrder === SortingOrders.None) {
        dispatch(updateFilter({sortingOrder: SortingOrders.DSC}));
      } else if (filtersState.sortingOrder === SortingOrders.DSC) {
        dispatch(updateFilter({sortingOrder: SortingOrders.ASC}));
      } else {
        dispatch(updateFilter({sortingOrder: SortingOrders.None}));
      }
    } else {
      dispatch(
        updateFilter({sortingParam: param, sortingOrder: SortingOrders.DSC})
      );
    }
  };

  const problemTableRows = () => {
    const currentProblems = [];
    let startIndex = Math.max(
      0,
      (filtersState.pageNumber - 1) * filtersState.problemsPerPage
    );
    let endIndex = startIndex + filtersState.problemsPerPage;

    for (
      let currIndex = startIndex;
      currIndex <
      Math.min(
        endIndex,
        (searchState.searchPattern
          ? problemsState.searched
          : problemsState.filtered
        )?.length
      );
      currIndex++
    ) {
      const allProblemIndex = searchState.searchPattern
        ? problemsState.searched[currIndex]
        : problemsState.filtered[currIndex];
      const problemStatus = problemsState.problemsStatus[allProblemIndex];
      const sameProblemOtherContestId =
        problemsState.otherContestId[allProblemIndex];
      const problemName =
        problemsState.allProblems.problems[allProblemIndex].name;
      let sameProblemOtherContestIndex: string = "";
      if (problemStatus === StatusOptions.Solved) {
        sameProblemOtherContestIndex =
          userState.userSolvedProblems?.[sameProblemOtherContestId]?.[
            problemName
          ];
      } else if (problemStatus === StatusOptions.Attempted) {
        sameProblemOtherContestIndex =
          userState.userAttemptedProblems?.[sameProblemOtherContestId]?.[
            problemName
          ];
      }
      currentProblems.push(
        ProblemTableRow({
          problem: problemsState.allProblems.problems[allProblemIndex],
          problemStatistics:
            problemsState.allProblems.problemStatistics[allProblemIndex],
          tableProblemNumber: currIndex + 1,
          platform: platform,
          problemStatus: problemStatus,
          sameProblemOtherContestId: sameProblemOtherContestId,
          sameProblemOtherContestIndex: sameProblemOtherContestIndex,
        })
      );
    }

    return currentProblems;
  };

  const problemsTableColumns: string[] = [
    "No.",
    SortingParams.problemId,
    "Name",
    platform === PLATFORMS.ACD ? SortingParams.Score : SortingParams.SolvedBy,
    SortingParams.Difficulty,
  ];

  console.log(filtersState.sortingParam, filtersState.sortingOrder);

  return (
    <div className="min-w-max min-h-screen bg-gray flex mx-2">
      <div className="w-full">
        <div className="flex justify-start my-2">
          <TextSearch />
        </div>
        <div className="text-white bg-gray-700 shadow-md rounded my-2">
          <table className="min-w-full table-fixed border border-gray-400">
            <thead>
              <tr className="uppercase text-sm leading-normal border-b-[1px]">
                {problemsTableColumns.map((item: string, index: number) => (
                  <th
                    key={index}
                    className="py-2 px-2 text-left whitespace-nowrap"
                    style={{
                      width:
                        item === "No."
                          ? "10%"
                          : item === SortingParams.problemId ||
                            item === SortingParams.Score ||
                            item === SortingParams.SolvedBy ||
                            item === SortingParams.Difficulty
                          ? "15%"
                          : `calc(${100 - 10 - 15 * 3}%)`,
                    }}
                  >
                    <div
                      className={`flex items-center group ${
                        item === SortingParams.problemId ||
                        item === SortingParams.SolvedBy ||
                        item === SortingParams.Score ||
                        item === SortingParams.Difficulty
                          ? problemsState.isLoading
                            ? "cursor-wait"
                            : "cursor-pointer"
                          : "cursor-default"
                      }`}
                      onClick={() => {
                        handleSorting(item);
                      }}
                    >
                      <span>{item}</span>
                      {(item === SortingParams.problemId ||
                        item === SortingParams.SolvedBy ||
                        item === SortingParams.Score ||
                        item === SortingParams.Difficulty) && (
                        <div className="font-bold ml-1">
                          <i
                            className={`cursor-pointer ${
                              filtersState.sortingParam !== item ||
                              !filtersState.sortingOrder
                                ? "fa-solid fa-up-long opacity-30 md:group-hover:opacity-100 group-hover:text-gray-300"
                                : filtersState.sortingOrder ===
                                  SortingOrders.ASC
                                ? "text-yellow-200 fa-solid fa-up-long fa-beat"
                                : filtersState.sortingOrder ===
                                  SortingOrders.DSC
                                ? "text-yellow-200 fa-solid fa-down-long fa-beat"
                                : ""
                            }`}
                          />
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-700 lg:text-sm sm:text-xs font-medium">
              {problemTableRows()}
            </tbody>
          </table>
          <div className="flex flex-row-reverse sm:flex-row items-center  shadow-inner border border-gray-400 bg-gray-700">
            <div className="p-1 mx-auto">
              <div className="font-bold mr-8">
                <label htmlFor="pageSize">PPP{" - "}</label>
                <select
                  id="pageSize"
                  value={filtersState.problemsPerPage}
                  title="problems per page"
                  className="bg-gray-200 border rounded text-black w-14"
                  onChange={(event) => {
                    dispatch(
                      updateFilter({
                        problemsPerPage: parseInt(event.target.value),
                      })
                    );
                  }}
                >
                  {problemsPerPage.map((problemsCnt) => (
                    <option key={problemsCnt} value={problemsCnt}>
                      {problemsCnt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <ProblemTableFooter />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemsSidebar;
