import {ThunkDispatch} from "@reduxjs/toolkit";
import React, {FC, useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../app/store";
import { problemsFilter } from "../../features/evaluators/problemFilter";
import {IFilterSlice, updateFilter} from "../../features/filters/filterSlice";

const ProblemTableFooter: FC = () => {
  const dispatch: ThunkDispatch<any, any, any> = useDispatch();
  const filtersState: IFilterSlice = useSelector(
    (state: IRootReducerState) => state.filters
  );
  const isLoadingProblems: boolean = useSelector(
    (state: IRootReducerState) => state.problems.isLoading
  );
  const myProblemsFilter = problemsFilter();

  const [pageInputValue, setPageInputValue] = useState<number>(1);

  const handleChangePageInput = (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const newPageNumber = Math.max(1, pageInputValue);
      dispatch(updateFilter({pageNumber: newPageNumber}));
    }
  };

  const handleSetPageInputValue = (event: any) => {
    if (isLoadingProblems) {
      return;
    }
    const newPageNumber = event.target.value.replace(/[^0-9]/g, "");
    setPageInputValue(newPageNumber);
  };

  const isInitialMount = useRef(true);
  useEffect(() => {
    setPageInputValue(filtersState.pageNumber);
    const filterProblems = async () => {
      await myProblemsFilter.handleFilter({isNewFilter: false});
    };
    if (!isInitialMount.current) {
      filterProblems();
    }
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
  }, [filtersState.pageNumber, filtersState.problemsPerPage]);

  return (
    <div className="mx-auto p-1 ">
      <span className="font-bold mr-8">
        Page{" - "}
        <input
          type="text"
          className="bg-gray-200 border rounded p-0.5 text-black w-12"
          name="pageNumber"
          id="pageNumber"
          value={pageInputValue}
          placeholder="1"
          maxLength={4}
          onChange={handleSetPageInputValue}
          onKeyDown={(event) => handleChangePageInput(event)}
        ></input>
      </span>
      <i
        title="First Page"
        className="fa-solid fa-angles-left m-3 font-bold cursor-pointer"
        onClick={() => {
          dispatch(updateFilter({pageNumber: 1}));
        }}
      ></i>
      <i
        title="Previous Page"
        className="fa-solid fa-chevron-left m-3 font-bold cursor-pointer"
        onClick={() => {
          dispatch(
            updateFilter({pageNumber: Math.max(1, filtersState.pageNumber - 1)})
          );
        }}
      ></i>
      <i
        title="Next Page"
        className="fa-solid fa-chevron-right m-3 font-bold cursor-pointer"
        onClick={() => {
          dispatch(updateFilter({pageNumber: filtersState.pageNumber + 1}));
        }}
      ></i>
      <i
        title="Last Page"
        className="fa-solid fa-angles-right m-3 font-bold cursor-pointer"
        onClick={() => {
          dispatch(updateFilter({pageNumber: 10000}));
        }}
      ></i>
    </div>
  );
};

export default ProblemTableFooter;
