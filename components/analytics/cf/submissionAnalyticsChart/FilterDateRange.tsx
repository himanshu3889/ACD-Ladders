import React, {FC, useState} from "react";
import {DateRangePicker, RangeKeyDict} from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import {Checkbox, FormControlLabel} from "@mui/material";
import {IDateRangeFilter} from "./SubmissionAnalyticsChart";

interface ISelectionRange {
  startDate: Date;
  endDate: Date;
  key: string;
}

interface IFilterDateRangeProps {
  setDateRangeFilters: React.Dispatch<React.SetStateAction<IDateRangeFilter>>;
}

const FilterDateRange: FC<IFilterDateRangeProps> = ({setDateRangeFilters}) => {
  const [filterApplied, setFilterApplied] = useState<boolean>(false);
  const [selectionRange, setSelectionRange] = useState<ISelectionRange>({
    startDate: new Date("2000-01-01"),
    endDate: new Date(),
    key: "selection",
  });

  // Handle date range change
  const handleDateRangeChange = (ranges: RangeKeyDict) => {
    const newSelectionRange = ranges.selection as ISelectionRange;
    setSelectionRange(newSelectionRange); // Update the state with the new date range
    const startDateTimestamp = Math.floor(
      newSelectionRange.startDate.getTime() / 1000
    );
    const endDateTimestamp = Math.floor(
      newSelectionRange.endDate.getTime() / 1000
    );

    setDateRangeFilters([startDateTimestamp, endDateTimestamp]);
  };

  const handleFilterCheckbox = (event: any) => {
    if (filterApplied) {
      setFilterApplied(false);
      setDateRangeFilters([null, null]);
    } else {
      setFilterApplied(true);
    }
  };

  return (
    <div>
      <div className="flex flex-row items-center">
        <div className="font-semibold mr-4">Select Date Range</div>
        <FormControlLabel
          label={undefined}
          key={"date-range-picker"}
          control={<Checkbox onChange={handleFilterCheckbox} />}
          checked={filterApplied}
        />
      </div>

      {filterApplied && (
        <div>
          <DateRangePicker
            ranges={[selectionRange]}
            onChange={handleDateRangeChange}
          />
        </div>
      )}
    </div>
  );
};

export default FilterDateRange;
