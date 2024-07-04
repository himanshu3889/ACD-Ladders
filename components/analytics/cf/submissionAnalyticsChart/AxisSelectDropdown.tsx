import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import React, {FC} from "react";
import {UserAnalyticsKeys} from "../../../../pages/analytics/cf";
import {titleCase} from "../../../../utils/stringAlgos";

interface IAxisSelectDropdown {
  value: UserAnalyticsKeys | null;
  allValues: UserAnalyticsKeys[];
  setValue: React.Dispatch<React.SetStateAction<UserAnalyticsKeys | null>>;
  id: string;
}
const AxisSelectDropdown: FC<IAxisSelectDropdown> = ({
  value,
  allValues,
  setValue,
  id,
}) => {
  const handleChange = (event: any) => {
    const {name, value}: any = event.target;
    setValue(value);
  };

  return (
    <FormControl sx={{marginY: 0.1, minWidth: 160}} size="small">
      <Select
        labelId={id}
        id={id}
        value={value}
        onChange={handleChange}
        size="small"
      >
        {allValues.map((val: string) => (
          <MenuItem key={val} value={val}>
            {titleCase(val)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default AxisSelectDropdown;
