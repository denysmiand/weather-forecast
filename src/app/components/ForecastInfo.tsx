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
          <p className="text-3xl">No forecast loaded yet</p>
        </div>
      );

    return (
      <>
        <p className="text-2xl text-center">
          {forecastData.location.name}, {forecastData.location.country}
        </p>
        <div className="flex gap-1 items-center">
          <img
            className="w-10 h-10"
            src={forecastData.current.condition.icon}
            alt={forecastData.current.condition.text}
          />
          <p className="font-bold">{forecastData.current.condition.text}</p>
        </div>
        <div className="flex w-full gap-2 justify-between">
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
    <div className="flex grow flex-col gap-2 items-center pt-2 pb-6 px-6 w-full h-full max-h-fit border border-blue-300 bg-gray-300 rounded-b-2xl text-background md:w-[40%] md:min-w-[24rem] ">
      {generateForecastInfo()}
    </div>
  );
};

export default ForecastInfo;
