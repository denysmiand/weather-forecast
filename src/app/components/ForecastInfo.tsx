/* eslint-disable @next/next/no-img-element */
import { ForecastData } from "@/api/types";
import { FC } from "react";

type IForecastInfoProps = {
  forecastData?: ForecastData | null;
};

const ForecastInfo: FC<IForecastInfoProps> = ({ forecastData }) => {
  const generateForecastInfo = () => {
    if (!forecastData)
      return (
        <div className="flex grow items-center justify-center">
          <p className="text-3xl">No forecast loaded yet</p>;
        </div>
      );

    return (
      <>
        <p className="text-2xl">
          {forecastData.location.name}, {forecastData.location.country}
        </p>
        <div className="flex gap-1 items-center">
          <img
            className="w-10 h-10"
            src={forecastData.current.condition.icon}
            alt={forecastData.current.condition.text}
          />
          {forecastData.current.condition.text}
        </div>
        <div className="flex w-full justify-between">
          <div>
            <p className="font-bold">Temperature:</p>
            <p>
              <b>Current: </b>
              {forecastData.current.temp_c}°C / {forecastData.current.temp_f}°F
            </p>
            <p>
              <b>Feels like: </b>
              {forecastData.current.feelslike_c}°C /{" "}
              {forecastData.current.feelslike_f}°F
            </p>
            <p>
              <b>Min: </b>
              {forecastData.forecast.forecastday[0].day.mintemp_c}°C /{" "}
              {forecastData.forecast.forecastday[0].day.mintemp_f}
              °F
            </p>
            <p>
              <b>Max: </b>
              {forecastData.forecast.forecastday[0].day.maxtemp_c}°C /{" "}
              {forecastData.forecast.forecastday[0].day.maxtemp_f}
              °F
            </p>
          </div>
          <div>
            <p>
              <b>Wind: </b>
              {forecastData.current.wind_kph} km/h /{" "}
              {forecastData.current.wind_mph} mph
            </p>
            <p>
              <b>Humidity: </b>
              {forecastData.current.humidity}%
            </p>
          </div>
        </div>
      </>
    );
  };
  return (
    <div className="flex flex-col gap-2 items-center py-2 px-6 w-[40%] min-w-[20rem] h-full max-h-[20rem] bg-green-50 rounded-b-2xl text-background">
      {generateForecastInfo()}
    </div>
  );
};

export default ForecastInfo;
