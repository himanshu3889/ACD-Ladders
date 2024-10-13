import React, {FC} from "react";
import {useEffect, useState, useRef} from "react";
import FavoriteFilters from "./FavoriteFilters";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../app/store";
import {
  IFilterSlice,
  updateFilter,
  toggleTag,
  resetFiltersState,
} from "../../features/filters/filterSlice";
import {ThunkDispatch} from "@reduxjs/toolkit";
import {
  allCFContestTypes,
  allStatus,
  CFContestTypes,
  initialTagState,
  StatusOptions,
} from "../../features/filters/filterConstants";
import {problemsFilter} from "../../features/evaluators/problemFilter";
import {IUser} from "../../types";
import {IUserSlice} from "../../features/user/userSlice";
import {PLATFORMS} from "../../configs/constants";
import {updateSearch} from "../../features/search/searchSlice";
interface IFilterSidebarProps {
  isShowingFilterSideBar: boolean;
}

const FilterSidebar: React.FC<IFilterSidebarProps> = ({
  isShowingFilterSideBar,
}) => {
  const dispatch: ThunkDispatch<any, any, any> = useDispatch();

  const isLoadingProblems: boolean = useSelector(
    (state: IRootReducerState) => state.problems.isLoading
  );
  const isProblemsPreprocessed: boolean = useSelector(
    (state: IRootReducerState) => state.problems.isPreprocessed
  );
  const isLoadingContests: boolean = useSelector(
    (state: IRootReducerState) => state.contests.isLoading
  );
  const filtersState: IFilterSlice = useSelector(
    (state: IRootReducerState) => state.filters
  );

  const userProfile: IUser | null = useSelector(
    (state: IRootReducerState) => state.user.profile
  );
  const platform: PLATFORMS = useSelector(
    (state: IRootReducerState) => state.problems.platform
  );
  const [isShowingTags, setIsShowingTags] = useState<boolean>(true);

  const myProblemsFilter = problemsFilter();

  const handleIndexInput = (event: any, index: number) => {
    let newIndex: string = event.target.value
      .replace(/[^a-z]/gi, "")
      .toUpperCase();
    const range: [string, string] = [...filtersState.problemIndexRange];
    range[index] = newIndex;
    dispatch(
      updateFilter({
        problemIndexRange: range,
      })
    );
  };

  const handleDifficultyInput = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    let newDifficulty: string = event.target.value.replace(/[^0-9]/g, "");
    if (newDifficulty === "") {
      newDifficulty = "0";
    }
    const range: [number, number] = [...filtersState.problemDifficultyRange];
    range[index] = parseInt(newDifficulty, 10);

    dispatch(
      updateFilter({
        problemDifficultyRange: range,
      })
    );
  };

  const handleSolvedInput = (event: any, index: number) => {
    let newSolvedCount: string = event.target.value.replace(/[^0-9]/g, "");
    if (newSolvedCount === "") {
      newSolvedCount = "0";
    }
    const range: [number, number] = [...filtersState.problemSolvedRange];
    range[index] = parseInt(newSolvedCount);
    dispatch(
      updateFilter({
        problemSolvedRange: range,
      })
    );
  };

  const handleTagToggle = (tag: string) => {
    dispatch(toggleTag(tag));
  };

  const handleTagsClear = () => {
    dispatch(updateFilter({tagState: initialTagState}));
  };

  const activeTagTopicStyle = `${
    filtersState.isTagsExcluded
      ? "bg-red-400"
      : filtersState.isTagsORLogicFiltered
      ? "bg-green-400"
      : "bg-blue-400"
  } font-medium text-white p-1 m-1 border rounded-lg border-black`;

  const activeTopicStyle =
    "bg-blue-500 hover:bg-blue-400 font-medium text-white p-1 m-1 border rounded-lg border-black";
  const topicStyle =
    "bg-gray-300 hover:bg-gray-400 font-medium text-black p-1 m-1 border rounded-lg border-black ";

  const TagButtons: FC = () => {
    return (
      <>
        {Object.keys(filtersState.tagState).map((tag) => (
          <button
            key={tag}
            type="button"
            className={`text-xs ${
              filtersState.tagState[tag] ? activeTagTopicStyle : topicStyle
            }`}
            onClick={() => {
              handleTagToggle(tag);
            }}
          >
            {tag}
          </button>
        ))}
      </>
    );
  };

  const ContestButtons: FC = () => {
    return (
      <>
        {allCFContestTypes.map(
          (contestType: CFContestTypes, typeIndex: number) => (
            <button
              key={typeIndex}
              type="button"
              className={
                filtersState.contestType === contestType
                  ? activeTopicStyle
                  : topicStyle
              }
              onClick={() => {
                const contestType_ =
                  filtersState.contestType === contestType ? "" : contestType;
                dispatch(updateFilter({contestType: contestType_}));
              }}
            >
              {contestType}
            </button>
          )
        )}
      </>
    );
  };

  const StatusButtons: FC = () => {
    return (
      <>
        {allStatus.map((status: StatusOptions, typeIndex: number) => (
          <button
            key={typeIndex}
            type="button"
            title={`${
              !userProfile && status !== StatusOptions.All
                ? "Select the user first !"
                : ""
            }`}
            disabled={!userProfile && status !== StatusOptions.All}
            className={
              filtersState.currStatus === status ? activeTopicStyle : topicStyle
            }
            onClick={() => {
              !isLoadingProblems &&
                dispatch(updateFilter({currStatus: status}));
            }}
          >
            {status}
          </button>
        ))}
      </>
    );
  };

  // No filtering : if problems / contests are loading
  const isLoading: boolean = isLoadingProblems || isLoadingContests;

  const isInitialMount = useRef(true);
  useEffect(() => {
    const filterProblems = async () => {
      await myProblemsFilter.handleFilter({isNewFilter: true});
    };
    if (!isInitialMount.current && !isLoading && isProblemsPreprocessed) {
      filterProblems();
    }
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
  }, [
    filtersState.sortingOrder,
    filtersState.sortingParam,
    isLoading, // after loading complete set the new filter
    isProblemsPreprocessed,
  ]);

  const handleResetFilter = () => {
    // reset the filters state only not resetting the problems
    dispatch(updateFilter(resetFiltersState));
  };

  const handleApplyFilter = () => {
    dispatch(
      updateFilter({
        problemIndexRange: [
          filtersState.problemIndexRange[0] || "A",
          filtersState.problemIndexRange[1] || "Z",
        ],
        problemDifficultyRange: [
          filtersState.problemDifficultyRange[0] || 0,
          filtersState.problemDifficultyRange[1] || 5000,
        ],
        problemSolvedRange: [
          filtersState.problemSolvedRange[0] || 0,
          filtersState.problemSolvedRange[1] || 9999999999,
        ],
      })
    );
    dispatch(updateSearch({searchPattern: ""})); // don't want the search when filter is apply
    myProblemsFilter.handleFilter({isNewFilter: true});
  };

  if (isShowingFilterSideBar)
    return (
      <div className="mx-2 lg:text-sm sm:text-xs">
        <FavoriteFilters />
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
              value={filtersState.problemDifficultyRange[0]}
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
              value={filtersState.problemDifficultyRange[1]}
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
              value={filtersState.problemIndexRange[0]}
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
              value={filtersState.problemIndexRange[1]}
              placeholder="Z"
              maxLength={1}
              onChange={(event) => handleIndexInput(event, 1)}
            />
          </div>
        </div>

        <hr className="h-px mt-1 bg-white border-0" />

        {!(platform === PLATFORMS.ACD) && (
          <div className="mt-0.5">
            <p className="text-base text-white font-bold mb-0.5">Solved By</p>
            <div className="md:flex">
              <input
                type="text"
                className="bg-gray-300 hover:bg-gray-100 focus:bg-white border rounded px-2 py-0.5 mx-2 flex-grow sm:w-auto md:w-1/2 lg:w-1/4 my-1 md:my-2 text-sm md:text-base"
                id="minSolvedBy"
                name="minSolvedBy"
                title="minimum solvedBy"
                value={filtersState.problemSolvedRange[0]}
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
                value={filtersState.problemSolvedRange[1]}
                placeholder="9999999999"
                maxLength={10}
                onChange={(event) => handleSolvedInput(event, 1)}
              />
            </div>
          </div>
        )}
        {!(platform === PLATFORMS.ACD) && (
          <hr className="h-px mt-1 bg-white border-0" />
        )}

        <div className="mt-0.5">
          <p className="text-base text-white font-bold mb-0.5">Contest</p>
          <div className="grid grid-cols-2 md:grid-cols-3 text-xs sm:text-sm md:text-xxs lg:text-sm">
            <ContestButtons />
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
                  filtersState.isTagsORLogicFiltered
                    ? "text-green-500 fa-toggle-on"
                    : "text-green-600 fa-toggle-off"
                }`}
                onClick={() => {
                  dispatch(
                    updateFilter({
                      isTagsORLogicFiltered:
                        !filtersState.isTagsORLogicFiltered,
                    })
                  );
                }}
              ></i>
            </div>

            <div className="flex items-center lg:mx-7 md:mx-2 sm:mx-1">
              <span className="text-base text-white mb-0.5 font-bold mx-2">
                EXCLUDE
              </span>
              <i
                className={`text-3xl cursor-pointer ${
                  filtersState.isTagsExcluded
                    ? "text-red-500 fa-solid fa-toggle-on"
                    : "text-red-600 fa-solid fa-toggle-off"
                }`}
                onClick={() => {
                  dispatch(
                    updateFilter({
                      isTagsExcluded: !filtersState.isTagsExcluded,
                    })
                  );
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
                <TagButtons />
              </div>
            )}
          </div>
        </div>

        <hr className="h-px mt-1 bg-white border-0" />

        <div className="mt-0.5">
          <p className="text-base text-white font-bold mb-0.5">Status</p>
          <div className="grid grid-cols-2 md:grid-cols-4 text-xs sm:text-sm md:text-xxs lg:text-sm">
            <StatusButtons />
          </div>
        </div>

        <hr className="h-px mt-1 bg-white border-0" />

        <div className="my-6">
          <div className="flex items-center justify-center">
            <button
              className="h-8 w-32 rounded-xl bg-red-500 hover:bg-red-600 text-base font-bold text-white"
              onClick={handleResetFilter}
            >
              Reset Filters
            </button>
          </div>

          <div className="flex items-center justify-center mt-4">
            <button
              className="h-8 w-60 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-base font-bold text-white"
              onClick={handleApplyFilter}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    );
  return <div></div>;
};

export default FilterSidebar;
