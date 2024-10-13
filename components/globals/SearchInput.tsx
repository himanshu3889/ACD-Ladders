import * as React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import {IoSearch} from "react-icons/io5";
import IconButton from "@mui/material/IconButton";

interface ISearchInputProps {
  searchValue: string | null;
  setSearchValue: (value: string) => void;
  inputMiddleware?: (value: string) => string;
  placeholder?: string;
  resetAfterSearch?: boolean;
}

const SearchInput: React.FC<ISearchInputProps> = ({
  searchValue,
  setSearchValue,
  inputMiddleware = (value: string) => value,
  placeholder = "Search",
  resetAfterSearch = false,
}) => {
  const [inputValue, setInputValue] = React.useState<string>(searchValue ?? "");

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = inputMiddleware(event.target.value ?? "");
    setInputValue(newValue);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newValue = inputMiddleware(inputValue ?? "");
    setSearchValue(newValue);
    if (resetAfterSearch) {
      setInputValue("");
    }
  };

  return (
    <Paper
      component="form"
      sx={{p: "2px 4px", display: "flex", alignItems: "center", width: 400}}
      onSubmit={handleSubmit}
    >
      <InputBase
        sx={{ml: 1, flex: 1}}
        placeholder={placeholder}
        inputProps={{"aria-label": placeholder}}
        value={inputValue}
        onChange={handleInputChange}
      />
      <IconButton type="submit" sx={{p: "10px"}} aria-label="search">
        <IoSearch />
      </IconButton>
    </Paper>
  );
};

export default SearchInput;
