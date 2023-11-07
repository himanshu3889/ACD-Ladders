import { useState, useEffect, useRef } from "react";
import useClickAway from "../utils/hooks/useClickAway";
import { toast } from "react-toastify";

type favoriteFilterProps = {
  problemDifficultyRange: [number, number];
  setProblemDifficultyRange: React.Dispatch<
    React.SetStateAction<[number, number]>
  >;
  problemIndexRange: [string, string];
  setProblemIndexRange: React.Dispatch<React.SetStateAction<[string, string]>>;
  problemSolvedRange: [number, number];
  setProblemSolvedRange: React.Dispatch<React.SetStateAction<[number, number]>>;
  tagState: Record<string, boolean>;
  setTagState: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  isTagsORLogicFiltered: boolean;
  setIsTagsORLogicFiltered: React.Dispatch<React.SetStateAction<boolean>>;
  isTagsExcluded: boolean;
  setIsTagsExcluded: React.Dispatch<React.SetStateAction<boolean>>;
  contestType: number;
  setContestType: React.Dispatch<React.SetStateAction<number>>;
  currStatus: number;
  setCurrStatus: React.Dispatch<React.SetStateAction<number>>;
};

const FavoriteFilters = (props: favoriteFilterProps) => {
  const {
    problemDifficultyRange,
    setProblemDifficultyRange,
    problemIndexRange,
    setProblemIndexRange,
    problemSolvedRange,
    setProblemSolvedRange,
    tagState,
    setTagState,
    isTagsORLogicFiltered,
    setIsTagsORLogicFiltered,
    isTagsExcluded,
    setIsTagsExcluded,
    contestType,
    setContestType,
    currStatus,
    setCurrStatus,
  } = props;
  const [currentfavFilters, setCurrentFavFilters] = useState<Array<any>>([
    { filterName: "filter 1" },
    { filterName: "filter 2" },
    { filterName: "filter 3" },
    { filterName: "filter 4" },
    { filterName: "filter 5" },
  ]);

  const [isShowingFilters, setIsShowingFilters] = useState<boolean>(false);
  const [selectedFavFilterIndex, setSelectedFavFilterIndex] =
    useState<number>(-1);
  const [renameFavFilterIndex, setRenameFavFilterIndex] = useState<number>(-1);
  const [favFilterNewName, setFavFilterNewName] = useState<string>("");
  const [resetFilter, setResetFilter] = useState<any>({});
  const filtersDivRef = useRef(null);

  useEffect(() => {
    const savedStatesJSON = localStorage.getItem("currentfavFilters");
    if (savedStatesJSON) {
      setCurrentFavFilters(JSON.parse(savedStatesJSON));
    }
    const stateToSave = {
      filterName: "Filter Reset",
      problemDifficultyRange,
      problemIndexRange,
      problemSolvedRange,
      tagState,
      isTagsORLogicFiltered,
      isTagsExcluded,
      contestType,
      currStatus,
    };
    setResetFilter(stateToSave);
  }, []);

  const filterEditSuccessNotify = (favFilterIndex: number) => {
    const screenWidth = window.innerWidth;
    const width = screenWidth <= 768 ? "70%" : "100%";
    toast.success(`Filter No.${favFilterIndex + 1} Edit Successfully`, {
      position: toast.POSITION.TOP_LEFT,
      theme: "colored",
      pauseOnHover: false,
      style: {
        marginTop: "56px",
        width: width,
      },
    });
  };

  const filterDeleteSuccessNotify = (favFilterIndex: number) => {
    const screenWidth = window.innerWidth;
    const width = screenWidth <= 768 ? "70%" : "100%";
    toast.success(`Filter No.${favFilterIndex + 1} Delete Successfully`, {
      position: toast.POSITION.TOP_LEFT,
      theme: "colored",
      pauseOnHover: false,
      style: {
        marginTop: "56px",
        width: width,
      },
    });
  };

  const filterSaveSuccessNotify = (favFilterIndex: number) => {
    const screenWidth = window.innerWidth;
    const width = screenWidth <= 768 ? "70%" : "100%";
    toast.success(
      `Filtering Saved Successfully to Filter No.${favFilterIndex + 1}`,
      {
        position: toast.POSITION.TOP_LEFT,
        theme: "colored",
        pauseOnHover: false,
        style: {
          marginTop: "56px",
          width: width,
        },
      }
    );
  };

  const filterSelectSuccessNotify = (favFilterIndex: number) => {
    const screenWidth = window.innerWidth;
    const width = screenWidth <= 768 ? "70%" : "100%";
    toast.success(`Filter No.${favFilterIndex + 1} Selected Successfully`, {
      position: toast.POSITION.TOP_LEFT,
      theme: "colored",
      pauseOnHover: false,
      style: {
        marginTop: "56px",
        width: width,
      },
    });
  };

  const handleSaveFilter = (event: any, favFilterIndex: number) => {
    event.stopPropagation();
    const result = window.confirm(
      `Are you sure you want to save filtering to filter No. ${
        favFilterIndex + 1
      } ?`
    );
    if (result === false) {
      return
    }
    const favFilterNewName: string =
      currentfavFilters[favFilterIndex]?.filterName ||
      `filter ${favFilterIndex + 1}`;
    const stateToSave = {
      filterName: favFilterNewName,
      problemDifficultyRange,
      problemIndexRange,
      problemSolvedRange,
      tagState,
      isTagsORLogicFiltered,
      isTagsExcluded,
      contestType,
      currStatus,
    };

    const newSavedStates = [...currentfavFilters];
    newSavedStates[favFilterIndex] = stateToSave;
    setCurrentFavFilters(newSavedStates);
    localStorage.setItem("currentfavFilters", JSON.stringify(newSavedStates));
    filterSaveSuccessNotify(favFilterIndex);
  };

  const handleDeleteFilter = (event: any, favFilterIndex: number) => {
    event.stopPropagation();
    const result = window.confirm(
      `Are you sure you want to delete filter No. ${favFilterIndex + 1} ?`
    );
    if (result === false) {
      return
    }
    const favFilterNewName: string =
      currentfavFilters[favFilterIndex]?.favFilterNewName ||
      `filter ${favFilterIndex + 1}`;
    const stateToSave = {
      filterName: favFilterNewName,
    };
    const newSavedStates = [...currentfavFilters];
    newSavedStates[favFilterIndex] = stateToSave;
    setCurrentFavFilters(newSavedStates);
    localStorage.setItem("currentfavFilters", JSON.stringify(newSavedStates));
    filterDeleteSuccessNotify(favFilterIndex);
  };

  const handleFilterRename = (event: any, favFilterIndex: number) => {
    event.stopPropagation();
    const result = window.confirm(
      `Are you sure you want to rename filter No. ${favFilterIndex + 1} ?`
    );
    if (result === true) {
      if (renameFavFilterIndex === favFilterIndex) {
        const newSavedStates = [...currentfavFilters];
        newSavedStates[renameFavFilterIndex].filterName =
          favFilterNewName.length > 0
            ? favFilterNewName
            : `filter ${renameFavFilterIndex + 1}`;
        setCurrentFavFilters(newSavedStates);
        localStorage.setItem(
          "currentfavFilters",
          JSON.stringify(newSavedStates)
        );
      }
      setRenameFavFilterIndex(-1);
      filterEditSuccessNotify(favFilterIndex);
    } else {
      setRenameFavFilterIndex(-1);
    }
  };

  const handleFilterEditButton = (event: any, favFilterIndex: number) => {
    event.stopPropagation();
    if (favFilterIndex !== -1 && renameFavFilterIndex !== favFilterIndex) {
      setRenameFavFilterIndex(favFilterIndex);
      setFavFilterNewName(currentfavFilters[favFilterIndex]?.filterName);
    }
  };

  const handleFilterInput = (event: any) => {
    setFavFilterNewName(event.target.value);
  };

  const handleRemoveSelectedFavFilter = () => {
    setSelectedFavFilterIndex(-1);
  };

  const handleSelectFavFilter = (favFilterIndex: number) => {
    setSelectedFavFilterIndex(
      favFilterIndex === selectedFavFilterIndex ? -1 : favFilterIndex
    );
    let statesToShow: any = resetFilter;
    if (
      favFilterIndex !== selectedFavFilterIndex &&
      currentfavFilters[favFilterIndex]?.problemDifficultyRange
    ) {
      statesToShow = currentfavFilters[favFilterIndex];
    }

    setProblemDifficultyRange(statesToShow.problemDifficultyRange);
    setProblemIndexRange(statesToShow.problemIndexRange);
    setProblemSolvedRange(statesToShow.problemSolvedRange);
    setTagState(statesToShow.tagState);
    setIsTagsORLogicFiltered(statesToShow.isTagsORLogicFiltered);
    setIsTagsExcluded(statesToShow.isTagsExcluded);
    setContestType(statesToShow.contestType);
    setCurrStatus(statesToShow.currStatus);
    setIsShowingFilters(false);
    filterSelectSuccessNotify(favFilterIndex);
  };

  const handleClickAwayFilters = () => {
    setTimeout(() => {
      setIsShowingFilters(false);
      setRenameFavFilterIndex(-1);
      setFavFilterNewName("");
    }, 0);
  };

  useClickAway(filtersDivRef, handleClickAwayFilters);

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
                  currentfavFilters[selectedFavFilterIndex]?.filterName
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
            ref={filtersDivRef}
          >
            <ul
              tabIndex={-1}
              role="listbox"
              aria-labelledby="listbox-label"
              aria-activedescendant="listbox-favFilterNewName-3"
              className="overflow-auto border-4 rounded-lg border-gray-400 max-h-56"
            >
              {currentfavFilters.map((item: any, favFilterIndex: number) => (
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
                            currentfavFilters[favFilterIndex]?.filterName
                          }
                        >
                          {item?.filterName ||
                            currentfavFilters[favFilterIndex]?.filterName}
                        </span>
                      ) : (
                        <input
                          className="w-4/5 mx-1 px-1.5 text-black font-normal border-2 rounded-md border-yellow-500"
                          value={favFilterNewName}
                          maxLength={40}
                          onChange={(event) => handleFilterInput(event)}
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
