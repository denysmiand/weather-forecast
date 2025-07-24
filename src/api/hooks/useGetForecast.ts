import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ForecastData } from "../types";
import { useState } from "react";

const useGetForecast = () => {
  const [forecastCity, setForecastCity] = useState<string | null>(null);
  const fetchForecastData = async () => {
    const response = await axios.get<ForecastData>(
      `/api/forecast.json?key=${process.env.NEXT_PUBLIC_API_KEY}&q=${forecastCity}&days=1&aqi=no&alerts=no`
    );
    return response.data;
  };

  const { data: forecastData, isFetching: isLoadingForecast } = useQuery({
    queryKey: ["forecast", forecastCity],
    queryFn: fetchForecastData,
    enabled: !!forecastCity,
  });

  const getForecast = (city: string) => {
    setForecastCity(city);
  };

  return { forecastData, isLoadingForecast, getForecast };
};

export default useGetForecast;
