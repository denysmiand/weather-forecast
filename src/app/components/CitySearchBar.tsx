import useGetCities from "@/api/hooks/useGetCities";
import { City } from "@/api/types";
import { Autocomplete, Button, TextField } from "@mui/material";
import { FC, useState } from "react";
import { useDebounce } from "use-debounce";
import SearchIcon from "@mui/icons-material/Search";

type ICitySearchBarProps = {
  selectedCity: City | null;
  onSelectCity: (city: City | null) => void;
  onGetForecast: () => void;
  isLoadingForecast: boolean;
};

const CitySearchBar: FC<ICitySearchBarProps> = ({
  selectedCity,
  onSelectCity,
  onGetForecast,
  isLoadingForecast,
}) => {
  const [search, setSearch] = useState("");

  const [debouncedSearch] = useDebounce(search, 500);

  const { citiesData, isLoadingCities } = useGetCities({
    search: debouncedSearch,
  });

  return (
    <div className="flex gap-2 w-1/2 bg-green-50 py-8 px-4 rounded-2xl">
      <Autocomplete
        value={selectedCity}
        onChange={(event, newInputValue) => {
          onSelectCity(newInputValue);
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
      />
      <Button
        onClick={onGetForecast}
        sx={{
          borderRadius: "1rem",
          "&:hover": {
            backgroundColor: "var(--hover-color)",
          },
          "&:disabled": {
            backgroundColor: "var(--disabled-color)",
            "& path": { fill: "grey" },
          },
        }}
        disabled={!selectedCity || isLoadingForecast}
      >
        <SearchIcon className="[&_path]:fill-black" />
      </Button>
    </div>
  );
};

export default CitySearchBar;
