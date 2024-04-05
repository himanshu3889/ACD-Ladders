import {useState, useEffect, useRef} from "react";
import {
  getLocalStorage,
  setLocalStorage,
} from "../../service/storageService/localStorage";
import {
  notifyService,
  SUCCESS_NOTIFICATION,
} from "../../service/notificationService/notifyService";
import {favFilterStorage} from "../../configs/constants";
import useClickAway from "../../hooks/useClickAway";
import {IRootReducerState} from "../../app/store";
import {
  IFilterSlice,
  IFiltersState,
  resetFiltersState,
  updateFilter,
} from "../../features/filters/filterSlice";
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "@reduxjs/toolkit";

const FavoriteFilters = () => {
  const dispatch: ThunkDispatch<any, any, any> = useDispatch();

  const filtersState: IFilterSlice = useSelector(
    (state: IRootReducerState) => state.filters
  );
  const [favFilters, setFavFilters] = useState<Array<any>>([
    {filterName: "filter 1"},
    {filterName: "filter 2"},
    {filterName: "filter 3"},
    {filterName: "filter 4"},
    {filterName: "filter 5"},
  ]);

  const [isShowingFilters, setIsShowingFilters] = useState<boolean>(false);
  const [selectedFavFilterIndex, setSelectedFavFilterIndex] =
    useState<number>(-1);
  const [renameFavFilterIndex, setRenameFavFilterIndex] = useState<number>(-1);
  const [favFilterNewName, setFavFilterNewName] = useState<string>("");
  // const [resetFilter, setResetFilter] = useState<any>({});
  const filtersContainerRef = useRef(null);

  interface ICurrentFilterState {
    filterName?: string;
    state?: IFilterSlice | IFiltersState;
  }
  function currentFilterStates({
    filterName = "Filter Reset",
    state = filtersState,
  }: ICurrentFilterState) {
    const currFiltersState = {
      filterName: filterName,
      problemDifficultyRange: state.problemDifficultyRange,
      problemIndexRange: state.problemIndexRange,
      problemSolvedRange: state.problemSolvedRange,
      tagState: state.tagState,
      isTagsORLogicFiltered: state.isTagsORLogicFiltered,
      isTagsExcluded: state.isTagsExcluded,
      contestType: state.contestType,
      currStatus: state.currStatus,
    };
    return currFiltersState;
  }
  const resetFilter = currentFilterStates({state: resetFiltersState});

  useEffect(() => {
    const favFiltersData = getLocalStorage(favFilterStorage);
    if (favFiltersData) {
      setFavFilters(favFiltersData);
    } else {
      setLocalStorage(favFilterStorage, favFilters);
    }
  }, []);

  function handleChangeFilterStates({
    favFilterIndex,
    filterNewData,
  }: {
    favFilterIndex: number;
    filterNewData: Record<string, any>;
  }) {
    const newSavedStates = [...favFilters];
    newSavedStates[favFilterIndex] = filterNewData;
    setFavFilters(newSavedStates);
    setLocalStorage(favFilterStorage, newSavedStates);
  }

  const handleSaveFilter = (event: any, favFilterIndex: number) => {
    event.stopPropagation();
    const result = window.confirm(
      `Are you sure you want to save filtering to filter No. ${
        favFilterIndex + 1
      } ?`
    );
    if (result === false) {
      return;
    }
    const favFilterNewName: string =
      favFilters[favFilterIndex]?.filterName || `filter ${favFilterIndex + 1}`;
    const filterNewStates = currentFilterStates({
      filterName: favFilterNewName,
    });
    const newSavedStates = [...favFilters];
    newSavedStates[favFilterIndex] = filterNewStates;
    setFavFilters(newSavedStates);
    setLocalStorage(favFilterStorage, newSavedStates);
    notifyService({
      message: `Filtering Saved Successfully to Filter No.${
        favFilterIndex + 1
      }`,
      type: SUCCESS_NOTIFICATION,
      position: "top-left",
    });
  };

  const handleDeleteFilter = (event: any, favFilterIndex: number) => {
    event.stopPropagation();
    const result = window.confirm(
      `Are you sure you want to delete filter No. ${favFilterIndex + 1} ?`
    );
    if (result === false) {
      return;
    }
    const favFilterNewName: string =
      favFilters[favFilterIndex]?.favFilterNewName ||
      `filter ${favFilterIndex + 1}`;
    const filterNewData = {
      filterName: favFilterNewName,
    };
    handleChangeFilterStates({
      favFilterIndex: favFilterIndex,
      filterNewData: filterNewData,
    });
    notifyService({
      message: `Filter No.${favFilterIndex + 1} Delete Successfully`,
      type: SUCCESS_NOTIFICATION,
      position: "top-left",
    });
  };

  const handleFilterRename = (event: any, favFilterIndex: number) => {
    event.stopPropagation();
    const result = window.confirm(
      `Are you sure you want to rename filter No. ${favFilterIndex + 1} ?`
    );
    if (result === true) {
      const filterNewData = getLocalStorage(favFilterStorage)[favFilterIndex];
      filterNewData.filterName =
        favFilterNewName.length > 0
          ? favFilterNewName
          : `filter ${renameFavFilterIndex + 1}`;
      handleChangeFilterStates({
        favFilterIndex: favFilterIndex,
        filterNewData: filterNewData,
      });
      notifyService({
        message: `Filter No.${favFilterIndex + 1} Edit Successfully`,
        type: SUCCESS_NOTIFICATION,
        position: "top-left",
      });
    }
    setRenameFavFilterIndex(-1);
  };

  const handleFilterEditButton = (event: any, favFilterIndex: number) => {
    event.stopPropagation();
    if (favFilterIndex !== -1 && renameFavFilterIndex !== favFilterIndex) {
      setRenameFavFilterIndex(favFilterIndex);
      setFavFilterNewName(favFilters[favFilterIndex]?.filterName);
    }
  };

  const handleFilterNameInput = (event: any) => {
    event.stopPropagation();
    setFavFilterNewName(event.target.value);
  };

  const handleApplyFilterStates = (currFiltersState: any) => {
    dispatch(
      updateFilter({
        problemDifficultyRange: currFiltersState.problemDifficultyRange,
        problemIndexRange: currFiltersState.problemIndexRange,
        problemSolvedRange: currFiltersState.problemSolvedRange,
        tagState: currFiltersState.tagState,
        isTagsORLogicFiltered: currFiltersState.isTagsORLogicFiltered,
        isTagsExcluded: currFiltersState.isTagsExcluded,
        contestType: currFiltersState.contestType,
        currStatus: currFiltersState.currStatus,
      })
    );
    setIsShowingFilters(false);
  };

  const handleRemoveSelectedFavFilter = () => {
    setSelectedFavFilterIndex(-1);
    handleApplyFilterStates(resetFilter);
  };

  const handleSelectFavFilter = (favFilterIndex: number) => {
    let filterStatesToShow: any = resetFilter;
    if (
      favFilterIndex !== selectedFavFilterIndex &&
      favFilters[favFilterIndex]?.problemDifficultyRange
    ) {
      filterStatesToShow = favFilters[favFilterIndex];
    }
    handleApplyFilterStates(filterStatesToShow);
    if (favFilterIndex === selectedFavFilterIndex) {
      setSelectedFavFilterIndex(-1);
    } else {
      setSelectedFavFilterIndex(favFilterIndex);
    }
  };

  const handleClickAwayFilters = () => {
    setTimeout(() => {
      setIsShowingFilters(false);
      setRenameFavFilterIndex(-1);
      setFavFilterNewName("");
    }, 0);
  };

  // If click outside then filter container then filter container will not be shown
  useClickAway(filtersContainerRef, handleClickAwayFilters);

  return (
    <div className="w-40 md:w-64 text-xs md:text-sm">
      <div className="relative mt-1">
        <button
          type="button"
          className={`w-full flex items-center justify-between cursor-default py-0.5 pl-3 pr-auto text-left rounded-md shadow-lg sm:text-sm ${
            selectedFavFilterIndex === -1 ? "bg-gray-200" : "bg-blue-200"
          }`}
        >
          <div className="flex items-center w-2/3">
            <i className="fa-solid fa-star text-yellow-500 mr-2"></i>
            <span className="cursor-text truncate">
              {selectedFavFilterIndex !== -1
                ? selectedFavFilterIndex +
                  1 +
                  ". " +
                  favFilters[selectedFavFilterIndex]?.filterName
                : "Saved Filters"}
            </span>
          </div>
          <div className="flex items-center ml-2 mr-1">
            {selectedFavFilterIndex !== -1 && (
              <i
                className="fa-solid fa-xmark mx-2 cursor-pointer text-red-500 hover:text-red-600"
                onClick={handleRemoveSelectedFavFilter}
              ></i>
            )}
            <div
              className="cursor-pointer"
              onClick={() => setIsShowingFilters(!isShowingFilters)}
            >
              <svg
                className="w-5 h-5 text-gray-500 hover:text-gray-700"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          </div>
        </button>
        {isShowingFilters && (
          <div
            className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg"
            ref={filtersContainerRef}
          >
            <ul
              role="listbox"
              aria-labelledby="listbox-label"
              aria-activedescendant="listbox-favFilterNewName-3"
              className="overflow-auto border-4 rounded-lg border-gray-400 max-h-56"
            >
              {favFilters.map((item: any, favFilterIndex: number) => (
                <li
                  key={favFilterIndex}
                  id={`fav-${favFilterIndex + 1}`}
                  className="w-full"
                  role="option"
                  onClick={() => handleSelectFavFilter(favFilterIndex)}
                >
                  <div
                    className={`flex items-center justify-between py-1.5 pl-1.5 text-gray-900 hover:text-white border border-gray-400 cursor-pointer ${
                      selectedFavFilterIndex === favFilterIndex
                        ? "bg-blue-500 hover:bg-blue-600"
                        : "bg-gray-100 hover:bg-gray-500"
                    }`}
                  >
                    <div className="flex items-center w-1/2 md:w-2/3 ">
                      <span>{favFilterIndex + 1}.</span>
                      {renameFavFilterIndex !== favFilterIndex ? (
                        <span
                          className="w-4/5 ml-1 font-normal truncate"
                          title={
                            item?.filterName ||
                            favFilters[favFilterIndex]?.filterName
                          }
                        >
                          {item?.filterName ||
                            favFilters[favFilterIndex]?.filterName}
                        </span>
                      ) : (
                        <input
                          className="w-4/5 mx-1 px-1.5 text-black font-normal border-2 rounded-md border-yellow-500"
                          value={favFilterNewName}
                          maxLength={40}
                          onChange={(event) => handleFilterNameInput(event)}
                          onClick={(event) => event.stopPropagation()}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              handleFilterRename(event, favFilterIndex);
                            }
                          }}
                        ></input>
                      )}
                    </div>
                    <div className="flex items-center pr-2 ">
                      {renameFavFilterIndex === favFilterIndex ? (
                        <i
                          className="mx-1.5 fa-solid cursor-pointer fa-circle-check text-yellow-400 hover:text-green-400"
                          title="Selected Filter"
                          onClick={(event) =>
                            handleFilterRename(event, favFilterIndex)
                          }
                        ></i>
                      ) : (
                        <i
                          className="mx-1.5 fa-solid cursor-pointer fa-pen-to-square text-gray-300 hover:text-yellow-400"
                          title="Edit Filter"
                          onClick={(event) =>
                            handleFilterEditButton(event, favFilterIndex)
                          }
                        ></i>
                      )}
                      <i
                        className="mx-1 fa-solid fa-trash text-gray-300 hover:text-red-400 cursor-pointer"
                        title="Delete Filter"
                        onClick={(event) =>
                          handleDeleteFilter(event, favFilterIndex)
                        }
                      ></i>
                      <i
                        className="ml-1.5 fa-solid fa-circle-plus text-gray-300 hover:text-green-400 cursor-pointer"
                        title="Save New Filter"
                        onClick={(event) =>
                          handleSaveFilter(event, favFilterIndex)
                        }
                      ></i>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoriteFilters;
