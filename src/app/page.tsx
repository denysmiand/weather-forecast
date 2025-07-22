"use client";
import useGetForecast from "@/api/hooks/useGetForecast";
import CitySearchBar from "./components/CitySearchBar";
import { useState } from "react";
import { City } from "@/api/types";
import ForecastInfo from "./components/ForecastInfo";
import { weatherBackgrounds } from "@/constants/weatherTypes";

export default function Home() {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const { forecastData, isLoadingForecast, getForecast } = useGetForecast();

  const handleGetForecast = () => {
    if (!selectedCity) return;
    getForecast(selectedCity.url);
    setSelectedCity(null);
  };

  const forecastBg = weatherBackgrounds.find(
    (weather) => weather.code === forecastData?.current.condition.code
  )?.backgroundColor;

  return (
    <div
      className="flex flex-col h-full items-center justify-center p-4"
      style={{ backgroundColor: forecastBg }}
    >
      <CitySearchBar
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
        onGetForecast={handleGetForecast}
        isLoadingForecast={isLoadingForecast}
      />
      <ForecastInfo forecastData={forecastData} />
    </div>
  );
}
