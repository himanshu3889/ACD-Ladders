import {ThunkDispatch} from "@reduxjs/toolkit";
import React, {FC, useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../app/store";
import {problemsFilter} from "../../features/evaluators/problemFilter";
import {ISearchSlice, updateSearch} from "../../features/search/searchSlice";
import {IUserSlice} from "../../features/user/userSlice";

const TextSearch: FC = () => {
  const searchRef = useRef<HTMLInputElement | null>(null);

  const dispatch: ThunkDispatch<any, any, any> = useDispatch();
  const searchState: ISearchSlice = useSelector(
    (state: IRootReducerState) => state.search
  );
  const userState: IUserSlice = useSelector(
    (state: IRootReducerState) => state.user
  );
  const myProblemsFilter = problemsFilter();

  const handleTextSearch = async () => {
    const trimText = searchRef.current?.value || "";
    dispatch(updateSearch({searchPattern: trimText}));
  };

  const handleAllProblemsFilterButton = async () => {
    dispatch(
      updateSearch({isSearchOnAllProblems: !searchState.isSearchOnAllProblems})
    );
  };

  const handleCaseSensitiveButton = async () => {
    dispatch(updateSearch({hasCaseSensitive: !searchState.hasCaseSensitive}));
  };

  const handleMatchOnlyWordsButton = async () => {
    dispatch(updateSearch({hasMatchOnlyWords: !searchState.hasMatchOnlyWords}));
  };

  const handleSearchChange = (event: any) => {
    const text = event.target.value;
    if (searchRef.current) {
      searchRef.current.value = text;
    }
  };

  const handleRemoveSearch = () => {
    if (searchRef.current) {
      searchRef.current.value = "";
    }
    dispatch(updateSearch({searchPattern: ""}));
  };

  const isInitialMount1 = useRef<boolean>(true);
  useEffect(() => {
    if (!isInitialMount1.current) {
      console.log("Searching pattern...");
      if (searchState.isSearchOnAllProblems) {
        myProblemsFilter.handleSearchWtihoutFilters({isNewSearch: true});
      } else {
        myProblemsFilter.handleSearchWithFilter({isNewSearch: true});
      }
    } else {
      isInitialMount1.current = false;
    }
  }, [
    searchState.searchPattern,
    searchState.hasCaseSensitive,
    searchState.hasMatchOnlyWords,
    searchState.isSearchOnAllProblems,
  ]);


  return (
    <div className="p-0.5 pl-2 flex flex-row">
      <div className="">
        <input
          ref={searchRef}
          key={"patternSearch"}
          className={`bg-gray-100 h-3 w-210 md:h-4 p-4 text-lg font-semibold focus:bg-gray-200 outline-none caret-blue-700`}
          type="text"
          name="patternSearch"
          id="patternSearch"
          placeholder="Search problems"
          onChange={handleSearchChange}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleTextSearch();
            }
          }}
        />
        <button
          className={`$ bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold text-lg h-8 md:h-8 px-4 sm:px-10`}
          onClick={handleTextSearch}
        >
          <i
            className={`fa-solid  ${
              !searchState.isLoading ? "fa-search" : "fa-circle-notch fa-spin"
            }`}
          ></i>
        </button>
      </div>
      <div
        title="All Problems"
        onClick={handleAllProblemsFilterButton}
        className={`flex items-center justify-center px-2 text-white ${
          searchState.isSearchOnAllProblems ? "bg-blue-500" : "bg-gray-400"
        } rounded ml-2 font-bold cursor-pointer`}
      >
        All
      </div>
      <div
        title="Match Case"
        onClick={handleCaseSensitiveButton}
        className={`flex items-center justify-center px-2 text-white ${
          searchState.hasCaseSensitive ? "bg-blue-500" : "bg-gray-400"
        } rounded ml-2 font-bold cursor-pointer`}
      >
        Aa
      </div>
      <div
        title="Match Whole Word"
        onClick={handleMatchOnlyWordsButton}
        className={`flex items-center justify-center px-2 text-white ${
          searchState.hasMatchOnlyWords ? "bg-blue-500" : "bg-gray-400"
        } rounded ml-2 font-bold cursor-pointer`}
      >
        W
      </div>
      {searchState.searchPattern && (
        <div className="flex flex-row items-center justify-center bg-white rounded px-1 ml-8">
          <div className="flex items-center justify-center px-2">
            {searchState.searchPattern}
          </div>
          <div
            className="cursor-pointer px-2 bg-red-200 rounded"
            onClick={handleRemoveSearch}
          >
            <i className="fa-solid fa-xmark "></i>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextSearch;
