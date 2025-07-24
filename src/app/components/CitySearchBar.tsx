import useGetCities from "@/api/hooks/useGetCities";
import { City } from "@/api/types";
import { Autocomplete, Button, TextField } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import clsx from "clsx";

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
  const [searchHistory, setSearchHistory] = useState<
    (City & { deleted?: boolean })[]
  >([]);

  const [debouncedSearch] = useDebounce(search, 500);

  const { citiesData, isLoadingCities } = useGetCities({
    search: debouncedSearch,
  });

  const handleAddToSearchHistory = (city: City) => {
    const index = searchHistory.findIndex((c) => c.url === city.url);
    const newSearchHistory = [...searchHistory];
    if (index !== -1) {
      newSearchHistory.splice(index, 1);
    }
    setSearchHistory([{ ...city, deleted: false }, ...newSearchHistory]);
    localStorage.setItem(
      "searchHistory",
      JSON.stringify([{ ...city, deleted: false }, ...newSearchHistory])
    );
  };

  const handleRemoveFromSearchHistory = (city: City) => {
    const newHistory = searchHistory.map((historyCity) =>
      historyCity.id === city.id
        ? { ...historyCity, deleted: !historyCity.deleted }
        : historyCity
    );
    setSearchHistory(newHistory);
    localStorage.setItem("searchHistory", JSON.stringify(newHistory));
  };

  const handleGetForecast = () => {
    if (!selectedCity) return;
    handleAddToSearchHistory(selectedCity);
    onGetForecast();
  };

  useEffect(() => {
    const history: (City & { deleted: boolean })[] = JSON.parse(
      typeof window !== "undefined"
        ? localStorage.getItem("searchHistory") || "[]"
        : "[]"
    );

    const cleanHistory = history.filter((historyCity) => !historyCity.deleted);

    setSearchHistory(cleanHistory);
  }, []);

  return (
    <div className="flex flex-col gap-2 w-full border border-blue-300 bg-gray-300 py-8 px-4 rounded-t-2xl md:w-1/2 md:min-w-[28rem] md:rounded-b-2xl">
      <div className="flex gap-2">
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
          onClick={handleGetForecast}
          data-testid="searchButton"
          variant="outlined"
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
          <SearchIcon className="[&_path]:fill-background" />
        </Button>
      </div>
      <div className="flex gap-2 flex-wrap max-h-22 min-h-10 overflow-auto content-start">
        {searchHistory.map((city) => (
          <Button
            variant="outlined"
            color={city.deleted ? "error" : "primary"}
            key={city.url}
            onClick={() => onSelectCity(city)}
            className="flex gap-1 h-fit"
          >
            <p
              className={clsx("text-background", {
                "line-through": city.deleted,
              })}
            >
              {city.name}
            </p>
            <ClearIcon
              className={clsx(
                "[&_path]:fill-background transition-all duration-500 ease-in-out",
                {
                  "rotate-45": city.deleted,
                }
              )}
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFromSearchHistory(city);
              }}
            />
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CitySearchBar;
