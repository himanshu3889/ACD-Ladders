import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import useProblemsStore from "../store/Problems";
import UserForm from "./UserForm";
import UserDetails from "./UserDetails";
import useUserStore from "../store/User";
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const CODEFORCES_API = process.env.NEXT_PUBLIC_CODEFORCES_API;

const ProblemsSidebar = ({
  problemsPerPage,
  pageNumber,
  setPageNumber,
  sortingParam,
  setSortingParam,
  sortingOrder,
  setSortingOrder,
  sortingOrdersArr,
}: {
  problemsPerPage: number;
  pageNumber: number;
  setPageNumber: (value: number) => void;
  sortingParam: string;
  setSortingParam: (value: string) => void;
  sortingOrder: number;
  setSortingOrder: (value: number) => void;
  sortingOrdersArr: [string, string, string];
}) => {
  const {
    allProblems,
    problemsStatusSpacedOtherContestId,
    hasProblemsFiltered,
    filteredProblems,
    hasFetchingProblems
  }: any = useProblemsStore();

    const {userProfile, userSolvedProblems, userAttemptedProblems}: any = useUserStore();

  const [pageInputNumber, setPageInputValue] = useState<number>(1);
  const handlePageInput = (event: any) => {
    const newPageNumber = event.target.value.replace(/[^0-9]/g, "");
    setPageInputValue(newPageNumber);
  };

  const handleSorting = (param: string) => {
    if (hasFetchingProblems){
      return ;
    }

    if (param === "No." || param === "Problem ID") {
      if (sortingParam !== "") {
        setSortingParam("");
        setSortingOrder(0);
      }
      return;
    }

    let newSortingParam: string = sortingParam;
    let newSortingOrder: number = sortingOrder;
    if (sortingParam === param) {
      newSortingOrder = (sortingOrder + 1) % 3;
      if (newSortingOrder === 0) {
        newSortingParam = "";
      }
    } else {
      newSortingOrder = 1;
      newSortingParam = param;
    }

    setSortingParam(newSortingParam);
    setSortingOrder(newSortingOrder);
  };

  const isInitialMount = useRef(true);
  useEffect(() => {
    if (!isInitialMount.current){
      setPageInputValue(pageNumber);
    }
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
  }, [pageNumber]);

  const getSingleProblemComponent = (index: number, problemNumber: number) => {
    const contestID: number = allProblems?.problems[index]?.contestId;
    const problemIndex: string = allProblems?.problems[index]?.index;
    const problemID: string = `${contestID}${problemIndex}`;
    const problemName: string = allProblems?.problems[index]?.name;
    const problemSolvedCount: number =
      allProblems?.problemStatistics[index]?.solvedCount !== undefined
        ? allProblems?.problemStatistics[index]?.solvedCount
        : 0;

    const problemDifficulty: number =
      allProblems?.problems[index]?.rating !== undefined
        ? allProblems?.problems[index]?.rating
        : 0;

    // ProblemStatus : Unsolved / Attempted / Solved;
    const problemStatusAndOtherContestId: string = problemsStatusSpacedOtherContestId[index] || "";
    const [problemStatus = "Unsolved", sameProblemOtherContestId = ""] =
      problemStatusAndOtherContestId.split(" ");
    let sameProblemOtherContestIndex: string = "";

    if (problemStatus === "Solved") {
      sameProblemOtherContestIndex = userSolvedProblems
        ?.get(parseInt(sameProblemOtherContestId, 10))
        ?.get(problemName);
    } else if (problemStatus === "Attempted") {
      sameProblemOtherContestIndex = userAttemptedProblems
        ?.get(parseInt(sameProblemOtherContestId, 10))
        ?.get(problemName);
    }

    const problemBgColorStyle =
      problemStatus === "Attempted" 
        ? `${
            problemNumber % 2 === 1 ? "bg-red-200" : "bg-red-300"
          } hover:bg-red-400 `
        : problemStatus === "Solved" 
        ? `${
            problemNumber % 2 === 1 ? "bg-green-200" : "bg-green-300"
          } hover:bg-green-400 `
        : // Unsolved
          `${
            problemNumber % 2 === 1 ? "bg-gray-200" : "bg-gray-300"
          } hover:bg-gray-400`;

    return (
      <tr
        className={`border-1.5 border-gray-400 hover:border-2 hover:border-gray-500 hover:text-gray-800 hover:font-bold
        ${problemBgColorStyle}`}
        key={problemNumber}
      >
        <td className="lg:py-0.5 py-1 px-2 text-left">
          <div className="flex items-center">
            <span className="">{problemNumber}</span>
          </div>
        </td>
        <td className="lg:py-0.5 py-1 px-2 text-left">
          <div className="flex items-center justify-between text-blue-600 hover:text-blue-800">
            <Link
              href={`https://codeforces.com/contest/${contestID}/problem/${problemIndex}`}
            >
              <a target="_blank">
                {contestID}
                <span className="font-bold italic">{problemIndex}</span>
              </a>
            </Link>
            {problemStatus !== "Unsolved" && sameProblemOtherContestId && (
              <Link
                href={`https://codeforces.com/contest/${sameProblemOtherContestId}/problem/${sameProblemOtherContestIndex}`}
              >
                <a target="_blank">
                  <i
                    className="mr-6 fa-solid fa-circle-exclamation text-sm text-yellow-500 hover:text-yellow-600"
                    title={`Tried in ${sameProblemOtherContestId}${sameProblemOtherContestIndex}`}
                  />
                </a>
              </Link>
            )}
          </div>
        </td>

        <td className="lg:py-0.5 py-1 px-2  text-left">
          <div className="flex flex-wrap">
            <span>{problemName}</span>
          </div>
        </td>

        <td className="lg:py-0.5 py-1 px-2 text-left">
          <div className="flex items-center">
            <span>{problemSolvedCount}</span>
          </div>
        </td>
        <td className="lg:py-0.5 py-1 px-2 text-left">
          <div className="flex items-center">
            <span>{problemDifficulty}</span>
          </div>
        </td>
      </tr>
    );
  };

  const getProblemComponents = () => {
    const currentProblems = [];
    let startIndex = (pageNumber - 1) * problemsPerPage;
    startIndex = Math.max(0, startIndex);
    let endIndex = startIndex + problemsPerPage;
    if (hasProblemsFiltered) {
      for (
        let currIndex = startIndex;
        currIndex < Math.min(endIndex, filteredProblems?.length);
        currIndex++
      ) {
        currentProblems.push(
          getSingleProblemComponent(filteredProblems[currIndex], currIndex + 1)
        );
      }
    } else {
      for (
        let currIndex = startIndex;
        currIndex < Math.min(endIndex, allProblems?.problems?.length);
        currIndex++
      ) {
        currentProblems.push(getSingleProblemComponent(currIndex, currIndex + 1));
      }
    }

    return currentProblems;
  };

  const problemsTableColumns: string[] = [
    "No.",
    "Problem ID",
    "Name",
    "Solved By",
    "Difficulty",
  ];

  return (
    <div className="min-w-max min-h-screen bg-gray flex mx-2">
      <div className="w-full">
        <div className="text-white bg-gray-700 shadow-md rounded my-2">
          <table className="min-w-full table-fixed border border-gray-400">
            <thead>
              <tr className="uppercase text-sm leading-normal border-b-[1px]">
                {problemsTableColumns.map((item: string, index: number) => (
                  <th
                    key={index}
                    className="lg:py-2 py-1 px-2 text-left"
                    style={{
                      width:
                        item === "No."
                          ? "10%"
                          : item === "Problem ID" ||
                            item === "Solved By" ||
                            item === "Difficulty"
                          ? "15%"
                          : `calc(${100 - 10 - 15 * 3}%)`,
                    }}
                  >
                    <div
                      className={`flex items-center group ${
                        index >= 2
                          ? hasFetchingProblems
                            ? "cursor-wait"
                            : "cursor-pointer"
                          : "cursor-default"
                      }`}
                      onClick={() => {
                        handleSorting(item);
                      }}
                    >
                      <span>{item}</span>
                      {index >= 2 && (
                        <div className="font-bold ml-1">
                          <i
                            className={`cursor-pointer ${
                              sortingParam !== item
                                ? "fa-solid fa-up-long opacity-0 group-hover:opacity-100 group-hover:text-gray-300"
                                : sortingOrdersArr[sortingOrder] === "ASC"
                                ? "text-yellow-200 fa-solid fa-up-long fa-beat"
                                : sortingOrdersArr[sortingOrder] === "DSC"
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
              {!isInitialMount.current && getProblemComponents()}
            </tbody>
          </table>
          <div className="flex shadow-inner border border-gray-400 bg-gray-700">
            <div className="mx-4 sm:ml-auto p-1 ">
              <span className="font-bold mr-8">
                Page{" - "}
                <input
                  type="text"
                  className="bg-gray-200 border rounded p-1 text-black w-12"
                  name="pageNumber"
                  id="pageNumber"
                  value={pageInputNumber}
                  placeholder="1"
                  maxLength={4}
                  onChange={handlePageInput}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      const newPageNumber = Math.max(1, pageInputNumber);
                      setPageNumber(newPageNumber);
                    }
                  }}
                ></input>
              </span>
              <i
                title="First Page"
                className="fa-solid fa-angles-left m-3 font-bold cursor-pointer"
                onClick={() => {
                  setPageNumber(1);
                }}
              ></i>
              <i
                title="Previous Page"
                className="fa-solid fa-chevron-left m-3 font-bold cursor-pointer"
                onClick={() => {
                  setPageNumber(Math.max(1, pageNumber - 1));
                }}
              ></i>
              <i
                title="Next Page"
                className="fa-solid fa-chevron-right m-3 font-bold cursor-pointer"
                onClick={() => {
                  setPageNumber(pageNumber + 1);
                }}
              ></i>
              <i
                title="Last Page"
                className="fa-solid fa-angles-right m-3 font-bold cursor-pointer"
                onClick={() => {
                  setPageNumber(1000);
                }}
              ></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemsSidebar;
