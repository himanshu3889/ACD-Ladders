import React from "react";
import { useEffect, useState, useRef } from "react";
import useProblemsStore from "../store/Problems";
import useUserStore from "../store/User";
import FavoriteFilters from "./FavoriteFilters";
import { problemsFilter } from "../utils/problemsFilter";
type filterSidebarProps = {
  problemsPerPage: number;
  pageNumber: number;
  setPageNumber: React.Dispatch<React.SetStateAction<number>>;
  sortingParam: string;
  setSortingParam: React.Dispatch<React.SetStateAction<string>>;
  sortingOrder: number;
  setSortingOrder: React.Dispatch<React.SetStateAction<number>>;
  sortingOrdersArr: [string, string, string];
  isShowingFilterSideBar: boolean;
};

const FilterSidebar = ({
  problemsPerPage,
  pageNumber,
  setPageNumber,
  sortingParam,
  setSortingParam,
  sortingOrder,
  setSortingOrder,
  sortingOrdersArr,
  isShowingFilterSideBar,
}: filterSidebarProps) => {
  const {hasFetchingProblems}: any = useProblemsStore();
  const { userProfile }: any = useUserStore();

  const [problemDifficultyRange, setProblemDifficultyRange] = useState<[number, number]>([0, 5000]);
  const [problemIndexRange, setProblemsIndexRange] = useState<[string, string]>(["A", "Z"]);
  const [problemSolvedRange, setProblemSolvedRange] = useState<[number, number]>([0, 9999999999]);
  const [tagState, setTagState] = useState<Record<string, boolean>>({
    "brute force": false,
    "greedy": false,
    "sortings": false,
    "two pointers": false,
    "dp": false,
    "binary search": false,
    "ternary search": false,
    "math": false,
    "number theory": false,
    "combinatorics": false,
    "chinese remainder theorem": false,
    "graphs": false,
    "trees": false,
    "dfs and similar": false,
    "dsu": false,
    "divide and conquer": false,
    "data structures": false,
    "constructive algorithms": false,
    "implementation": false,
    "interactive": false,
    "geometry": false,
    "strings": false,
    "bitmasks": false,
    "shortest paths": false,
    "probabilities": false,
    "hashing": false,
    "games": false,
    "flows": false,
    "graph matchings": false,
    "special": false,
    "matrices": false,
    "string suffix structures": false,
    "fft": false,
    "expression parsing": false,
    "meet-in-the-middle": false,
    "2-sat": false,
    "schedules": false,
  });

  const [isTagsORLogicFiltered, setIsTagsORLogicFiltered] = useState<boolean>(false);
  const [isTagsExcluded, setIsTagsExcluded] = useState<boolean>(false);

  const allContestTypes: Array<string> = [
    "Educational",
    "Div. 1",
    "Div. 2",
    "Div. 1 + Div. 2",
    "Div. 3",
    "Div. 4",
  ];
  const [contestType, setContestType] = useState<number>(-1);

  const allStatus: Array<string> = ["All", "Unsolved", "Solved", "Attempted"];
  const [currStatus, setCurrStatus] = useState<number>(0);

  const [problemsSeenCount, setProblemsSeenCount] = useState<number>(0);

  const [isShowingTags, setIsShowingTags] = useState<boolean>(true);

  const myProblemsFilter = problemsFilter({
    problemDifficultyRange,
    problemIndexRange,
    problemSolvedRange,
    tagState,
    isTagsORLogicFiltered,
    isTagsExcluded,
    contestType,
    currStatus,
    allStatus,
    allContestTypes,
    problemsSeenCount,
    sortingOrdersArr,
    sortingOrder,
    pageNumber,
    setPageNumber,
    problemsPerPage,
    sortingParam,
    setProblemsSeenCount,
  });

  const handleIndexInput = (event: any, index: number) => {
    const newIndex = event.target.value.replace(/[^a-z]/gi, "").toUpperCase();
    const newRange = [...problemIndexRange];
    newRange[index] = newIndex;
    setProblemsIndexRange(newRange as [string, string]);
  };

  const handleDifficultyInput = (event: any, index: number) => {
    const newDifficulty = event.target.value.replace(/[^0-9]/g, "");
    const newRange = [...problemDifficultyRange];
    newRange[index] = newDifficulty;
    setProblemDifficultyRange(newRange as [number, number]);
  };

  const handleSolvedInput = (event: any, index: number) => {
    const newSolvedCount = event.target.value.replace(/[^0-9]/g, "");
    const newRange = [...problemSolvedRange];
    newRange[index] = newSolvedCount;
    setProblemSolvedRange(newRange as [number, number]);
  };

  const handleTagToggle = (tag: string) => {
    setTagState((prevTagState) => ({
      ...prevTagState,
      [tag]: !prevTagState[tag],
    }));
  };

  const handleTagsClear = () => {
    const newTagState = { ...tagState };
    for (const tag in newTagState) {
      newTagState[tag] = false;
    }
    setTagState(newTagState);
  };

  const activeTopicStyleTag = `${
    isTagsExcluded
      ? "bg-red-400"
      : isTagsORLogicFiltered
      ? "bg-green-400"
      : "bg-blue-400"
  } font-medium text-white p-1 m-1 border rounded-lg border-black`;

  const activeTopicStyle =
    "bg-blue-500 hover:bg-blue-400 font-medium text-white p-1 m-1 border rounded-lg border-black";
  const topicStyle =
    "bg-gray-300 hover:bg-gray-400 font-medium text-black p-1 m-1 border rounded-lg border-black ";

  const getTagButtons = () => {
    const tagButtons: any = [];
    for (const tag in tagState) {
      tagButtons.push(
        <button
          key={tag}
          type="button"
          className={`text-xs ${
            tagState[tag] ? activeTopicStyleTag : topicStyle
          }`}
          onClick={() => {
            handleTagToggle(tag);
          }}
        >
          {tag}
        </button>
      );
    }
    return tagButtons;
  };

  const getContestButtons = () => {
    const contestButtons: any = [];
    allContestTypes.map((item: string, typeIndex: number) =>
      contestButtons.push(
        <button
          key={typeIndex}
          type="button"
          className={contestType === typeIndex ? activeTopicStyle : topicStyle}
          onClick={() => {
            setContestType(contestType !== typeIndex ? typeIndex : -1);
          }}
        >
          {item}
        </button>
      )
    );
    return contestButtons;
  };

  const getStatusButtons = () => {
    const statusButtons: any = [];
    allStatus.map((item: string, typeIndex: number) =>
      statusButtons.push(
        <button
          key={typeIndex}
          type="button"
          className={currStatus === typeIndex ? activeTopicStyle : topicStyle}
          onClick={() => {
            !hasFetchingProblems &&
              setCurrStatus(currStatus !== typeIndex ? typeIndex : 0);
          }}
        >
          {item}
        </button>
      )
    );
    return statusButtons;
  };

  const isInitialMount1 = useRef(true);
  useEffect(() => {
    if (!isInitialMount1.current) {
      myProblemsFilter.handleNewFilter();
    }
    if (isInitialMount1.current) {
      isInitialMount1.current = false;
    }
  }, [userProfile, sortingOrder, sortingParam]);

  const isInitialMount2 = useRef(true);
  useEffect(() => {
    const fetchData = async () => {
      await myProblemsFilter.handleFilter(false);
    };
    if (!isInitialMount2.current) {
      fetchData();
    }
    if (isInitialMount2.current) {
      isInitialMount2.current = false;
    }
  }, [pageNumber, problemsPerPage]);

  if (isShowingFilterSideBar)
    return (
      <div className="mx-2 lg:text-sm sm:text-xs">
        <FavoriteFilters
          problemDifficultyRange={problemDifficultyRange}
          setProblemDifficultyRange={setProblemDifficultyRange}
          problemIndexRange={problemIndexRange}
          setProblemIndexRange={setProblemsIndexRange}
          problemSolvedRange={problemSolvedRange}
          setProblemSolvedRange={setProblemSolvedRange}
          tagState={tagState}
          setTagState={setTagState}
          isTagsORLogicFiltered={isTagsORLogicFiltered}
          setIsTagsORLogicFiltered={setIsTagsORLogicFiltered}
          isTagsExcluded={isTagsExcluded}
          setIsTagsExcluded={setIsTagsExcluded}
          contestType={contestType}
          setContestType={setContestType}
          currStatus={currStatus}
          setCurrStatus={setCurrStatus}
        />
        <hr className="h-px mt-1 bg-white border-0" />
        <div className="mt-1">
          <p className="text-base text-white font-bold mb-0.5">Difficulty</p>
          <div className="md:flex">
            <input
              type="text"
              className="bg-gray-300 hover:bg-gray-100 focus:bg-white border rounded px-2 py-0.5 mx-2 flex-grow sm:w-auto md:w-1/2 lg:w-1/4 my-1 md:my-2 text-sm md:text-base"
              id="minDifficulty"
              name="minDifficulty"
              title="minimum difficulty"
              value={problemDifficultyRange[0]}
              placeholder="0"
              maxLength={5}
              onChange={(event) => handleDifficultyInput(event, 0)}
            />

            <input
              type="text"
              className="bg-gray-300 hover:bg-gray-100 focus:bg-white border rounded px-2 py-0.5 mx-2 flex-grow sm:w-auto md:w-1/2 lg:w-1/4 my-1 md:my-2 text-sm md:text-base"
              id="maxDifficulty"
              name="maxDifficulty"
              title="maximum difficulty"
              value={problemDifficultyRange[1]}
              placeholder="5000"
              maxLength={5}
              onChange={(event) => handleDifficultyInput(event, 1)}
            />
          </div>
        </div>

        <hr className="h-px mt-1 bg-white border-0" />

        <div className="mt-0.5">
          <p className="text-base text-white font-bold mb-0.5">Index</p>
          <div className="md:flex">
            <input
              type="text"
              className="bg-gray-300 hover:bg-gray-100 focus:bg-white border rounded px-2 py-0.5 mx-2 flex-grow sm:w-auto md:w-1/2 lg:w-1/4 my-1 md:my-2 text-sm md:text-base"
              id="minIndex"
              name="minIndex"
              title="minimum index"
              value={problemIndexRange[0]}
              placeholder="A"
              maxLength={1}
              onChange={(event) => handleIndexInput(event, 0)}
            />

            <input
              type="text"
              className="bg-gray-300 hover:bg-gray-100 focus:bg-white border rounded px-2 py-0.5 mx-2 flex-grow sm:w-auto md:w-1/2 lg:w-1/4 my-1 md:my-2 text-sm md:text-base"
              id="maxIndex"
              name="maxIndex"
              title="maximum index"
              value={problemIndexRange[1]}
              placeholder="Z"
              maxLength={1}
              onChange={(event) => handleIndexInput(event, 1)}
            />
          </div>
        </div>

        <hr className="h-px mt-1 bg-white border-0" />

        <div className="mt-0.5">
          <p className="text-base text-white font-bold mb-0.5">Solved By</p>
          <div className="md:flex">
            <input
              type="text"
              className="bg-gray-300 hover:bg-gray-100 focus:bg-white border rounded px-2 py-0.5 mx-2 flex-grow sm:w-auto md:w-1/2 lg:w-1/4 my-1 md:my-2 text-sm md:text-base"
              id="minSolvedBy"
              name="minSolvedBy"
              title="minimum solvedBy"
              value={problemSolvedRange[0]}
              placeholder="0"
              maxLength={10}
              onChange={(event) => handleSolvedInput(event, 0)}
            />

            <input
              type="text"
              className="bg-gray-300 hover:bg-gray-100 focus:bg-white border rounded px-2 py-0.5 mx-2 flex-grow sm:w-auto md:w-1/2 lg:w-1/4 my-1 md:my-2 text-sm md:text-base"
              id="maxSolvedBy"
              name="maxSolvedBy"
              title="maximum solvedBy"
              value={problemSolvedRange[1]}
              placeholder="9999999999"
              maxLength={10}
              onChange={(event) => handleSolvedInput(event, 1)}
            />
          </div>
        </div>

        <hr className="h-px mt-1 bg-white border-0" />

        <div className="mt-0.5">
          <p className="text-base text-white font-bold mb-0.5">Contest</p>
          <div className="grid grid-cols-2 md:grid-cols-3 text-xs sm:text-sm md:text-xxs lg:text-sm">
            {getContestButtons()}
          </div>
        </div>

        <hr className="h-px mt-1 bg-white border-0" />

        <div className="mt-2">
          <div className="flex flex-col md:flex-row items-center">
            <div className="flex items-center lg:mx-7 md:mx-2 sm:mx-1">
              <span className="text-base  text-white mb-0.5 font-bold mx-2">
                OR
              </span>
              <i
                className={`text-3xl fa-solid cursor-pointer ${
                  isTagsORLogicFiltered
                    ? "text-green-500 fa-toggle-on"
                    : "text-green-600 fa-toggle-off"
                }`}
                onClick={() => {
                  setIsTagsORLogicFiltered(!isTagsORLogicFiltered);
                }}
              ></i>
            </div>

            <div className="flex items-center lg:mx-7 md:mx-2 sm:mx-1">
              <span className="text-base text-white mb-0.5 font-bold mx-2">
                EXCLUDE
              </span>
              <i
                className={`text-3xl cursor-pointer ${
                  isTagsExcluded
                    ? "text-red-500 fa-solid fa-toggle-on"
                    : "text-red-600 fa-solid fa-toggle-off"
                }`}
                onClick={() => {
                  setIsTagsExcluded(!isTagsExcluded);
                }}
              ></i>
            </div>
          </div>

          <div className="mt-1">
            <div className="text-base text-white font-bold mb-0.5 flex items-center justify-between">
              <span>
                Tags{" "}
                <i
                  className={`cursor-pointer ml-4 fa-solid text-lg ${
                    isShowingTags
                      ? "fa-chevron-down text-green-300"
                      : "fa-chevron-right"
                  }`}
                  onClick={() => setIsShowingTags(!isShowingTags)}
                ></i>
              </span>
              <span className="text-base text-white flex items-center mr-4">
                Clear Tags
                <i
                  className="fa-solid fa-xmark mx-2 text-2xl text-red-600 hover:text-red-500 cursor-pointer"
                  onClick={handleTagsClear}
                />
              </span>
            </div>
            {isShowingTags && (
              <div
                role="buttons"
                className="flex flex-wrap items-baseline w-full"
              >
                {getTagButtons()}
              </div>
            )}
          </div>
        </div>

        <hr className="h-px mt-1 bg-white border-0" />

        <div className="mt-0.5">
          <p className="text-base text-white font-bold mb-0.5">Status</p>
          <div className="grid grid-cols-2 md:grid-cols-4 text-xs sm:text-sm md:text-xxs lg:text-sm">
            {getStatusButtons()}
          </div>
        </div>

        <hr className="h-px mt-1 bg-white border-0" />

        <div className="flex items-center justify-center my-6">
          <button
            className="h-8 w-48 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-base font-bold text-white"
            onClick={()=>myProblemsFilter.handleNewFilter()}
          >
            Apply Filters
          </button>
        </div>
      </div>
    );
  return <div></div>;
};

export default FilterSidebar;
