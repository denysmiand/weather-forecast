"use client";
import useGetForecast from "@/api/hooks/useGetForecast";
import CitySearchBar from "./components/CitySearchBar";
import { useState } from "react";
import { City } from "@/api/types";
import ForecastInfo from "./components/ForecastInfo";

export default function Home() {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const { forecastData, isLoadingForecast, getForecast } = useGetForecast();

  const handleGetForecast = () => {
    if (!selectedCity) return;
    getForecast(selectedCity.url);
    setSelectedCity(null);
  };

  return (
    <div className="p-4 flex flex-col h-full items-center justify-center">
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
