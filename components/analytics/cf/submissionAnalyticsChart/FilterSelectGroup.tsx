import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
} from "@mui/material";
import React, {FC} from "react";

interface IFilterSelectGroupProps {
  values: any[];
  options: any[];
  setOptions: React.Dispatch<React.SetStateAction<any[]>>;
  formLabel: string;
  formHelperText: string;
}

const FilterSelectGroup: FC<IFilterSelectGroupProps> = ({
  values,
  options,
  setOptions,
  formLabel,
  formHelperText,
}) => {
  const handleSelectOption = (val: any) => {
    const isSelected = options.includes(val);
    let newSelectedOptions: string[];
    if (isSelected) {
      newSelectedOptions = options.filter((option) => option !== val);
    } else {
      newSelectedOptions = [...options, val];
    }
    setOptions(newSelectedOptions);
  };
  return (
    <div>
      <FormControl component="fieldset" variant="standard">
        <FormLabel component="legend">{formLabel}</FormLabel>
        <FormGroup>
          {values.map((val: any, index: number) => (
            <FormControlLabel
              key={index}
              label={val}
              control={
                <Checkbox onChange={() => handleSelectOption(val)} name={val} />
              }
              checked={options.includes(val)}
            />
          ))}
        </FormGroup>
      </FormControl>
      <FormHelperText>{formHelperText}</FormHelperText>
    </div>
  );
};

export default FilterSelectGroup;
