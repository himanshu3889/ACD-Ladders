import React, {useState} from "react";
import {
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
  styled,
} from "@mui/material";
import {useRouter} from "next/router";
import {routeTitles} from "../../../pages/_app";

const CustomSelect = styled(Select)(({theme}) => ({
  backgroundColor: theme.palette.primary.main, // Set the background color to blue
  color: theme.palette.common.white, // Set the text color to white
  borderRadius: theme.shape.borderRadius, // Apply rounded corners
  "& .MuiSelect-icon": {
    color: theme.palette.common.white, // Set the dropdown icon color to white
  },
  "& .MuiMenuItem-root": {
    color: theme.palette.common.white, // Set menu item text color to white
  },
  "& .MuiInputLabel-root": {
    color: theme.palette.common.white, // Set label text color to white
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none", // Remove the border that makes it look like an input
  },
  "&:hover": {
    backgroundColor: theme.palette.primary.dark, // Change background color on hover
  },
  "& .MuiMenuItem-root:hover": {
    backgroundColor: theme.palette.primary.light, // Change background color of menu items on hover
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "none", // Remove border on focus
  },
  "&.Mui-focused": {
    backgroundColor: theme.palette.primary.dark, // Change background color on focus
  },
}));

const NavbarFeaturesDropdown: React.FC = () => {
  const router = useRouter();
  const [selectedPath, setSelectedPath] = useState<string>(router.pathname);

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    const newPath = event.target.value as string;
    setSelectedPath(newPath);
    router.push(newPath); // Navigate to the selected route
  };

  return (
    <FormControl sx={{minWidth: 120, padding: "8px 16px"}}>
      <CustomSelect
        value={selectedPath}
        onChange={handleChange}
        displayEmpty
        size="small"
      >
        {Object.entries(routeTitles).map(([path, title]) => (
          <MenuItem key={path} value={path}>
            {title}
          </MenuItem>
        ))}
      </CustomSelect>
    </FormControl>
  );
};

export default NavbarFeaturesDropdown;
