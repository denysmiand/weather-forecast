"use client";
import useGetCities from "@/api/hooks/useGetCities";
import { City } from "@/api/types";
import { Autocomplete, Button, TextField } from "@mui/material";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import SearchIcon from "@mui/icons-material/Search";

const CitySearchBar = () => {
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const [debouncedSearch] = useDebounce(search, 500);

  const { citiesData, isLoadingCities } = useGetCities({
    search: debouncedSearch,
  });

  return (
    <div className="flex gap-2 w-1/2 bg-green-50 py-8 px-4 rounded-2xl">
      <Autocomplete
        value={selectedCity}
        onChange={(event, newInputValue) => {
          setSelectedCity(newInputValue);
        }}
        onInputChange={(event, newInputValue) => {
          setSearch(newInputValue);
        }}
        loading={isLoadingCities}
        className="w-full"
        id="city-search"
        options={citiesData || []}
        renderInput={(params) => <TextField {...params} label="City" />}
        getOptionLabel={(option) => option.name}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            <div>
              <div>{option.name}</div>
              <div className="text-xs text-gray-500">{option.country}</div>
            </div>
          </li>
        )}
        slotProps={{
          paper: {
            sx: {
              maxHeight: "10rem",
              overflow: "auto",
            },
          },
        }}
      />
      <Button
        sx={{
          borderRadius: "1rem",
          "&:hover": {
            backgroundColor: "var(--hover-color)",
          },
        }}
      >
        <SearchIcon className="[&_path]:fill-black" />
      </Button>
    </div>
  );
};

export default CitySearchBar;
