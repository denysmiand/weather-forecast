import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import useGetForecast from "./useGetForecast";
import { ForecastData } from "../types";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 0,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

process.env.NEXT_PUBLIC_API_KEY = "test_api_key";

describe("useGetForecast", () => {
  beforeEach(() => {
    mockedAxios.get.mockClear();
    queryClient.clear();
  });

  it("should not fetch forecast data initially when no city is set", () => {
    const { result } = renderHook(() => useGetForecast(), { wrapper });

    expect(result.current.forecastData).toBeUndefined();
    expect(result.current.isLoadingForecast).toBe(false);
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });

  it("should fetch forecast data when getForecast is called with a city", async () => {
    const mockForecastData: ForecastData = {
      location: {
        country: "UK",
        lat: 51.5074,
        lon: -0.1278,
        name: "London",
        region: "London",
        tz_id: "Europe/London",
        localtimeEpoch: 1716537600,
        localtime: "2024-05-21 12:00",
      },
      current: {
        temp_c: 25,
        condition: { text: "Clear", icon: "icon", code: 1000 },
        humidity: 50,
        wind_kph: 10,
        temp_f: 77,
        wind_mph: 6.7,
        feelslike_c: 22,
        feelslike_f: 71.6,
      },
      forecast: {
        forecastday: [
          {
            day: {
              maxtemp_c: 30,
              maxtemp_f: 86,
              mintemp_c: 15,
              mintemp_f: 59,
              avgtemp_c: 22,
              avgtemp_f: 71.6,
              condition: { text: "Clear", icon: "icon", code: 1000 },
            },
            hour: [],
          },
        ],
      },
    };

    mockedAxios.get.mockResolvedValueOnce({
      data: mockForecastData,
      status: 200,
    });

    const { result } = renderHook(() => useGetForecast(), { wrapper });

    act(() => {
      result.current.getForecast("London");
    });

    expect(result.current.isLoadingForecast).toBe(true);
    expect(result.current.forecastData).toBeUndefined();

    await waitFor(() => expect(result.current.isLoadingForecast).toBe(false));

    expect(result.current.forecastData).toEqual(mockForecastData);
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      `/api/forecast.json?key=${process.env.NEXT_PUBLIC_API_KEY}&q=London&days=1&aqi=no&alerts=no`
    );
  });

  it("should not fetch if getForecast is called with an empty string", async () => {
    const { result } = renderHook(() => useGetForecast(), { wrapper });

    act(() => {
      result.current.getForecast("");
    });

    expect(result.current.isLoadingForecast).toBe(false);
    expect(result.current.forecastData).toBeUndefined();
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });

  it("should handle API errors", async () => {
    mockedAxios.get.mockRejectedValueOnce(
      new Error("Failed to fetch forecast")
    );

    const { result } = renderHook(() => useGetForecast(), { wrapper });

    act(() => {
      result.current.getForecast("ErrorCity");
    });

    await waitFor(() => expect(result.current.isLoadingForecast).toBe(false));

    expect(result.current.forecastData).toBeUndefined();
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      `/api/forecast.json?key=${process.env.NEXT_PUBLIC_API_KEY}&q=ErrorCity&days=1&aqi=no&alerts=no`
    );
  });

  it("should refetch data when getForecast is called with a new city", async () => {
    const mockForecastLondon: ForecastData = {
      location: {
        country: "UK",
        lat: 51.5074,
        lon: -0.1278,
        name: "London",
        region: "London",
        tz_id: "Europe/London",
        localtimeEpoch: 1716537600,
        localtime: "2024-05-21 12:00",
      },
      current: {
        temp_c: 25,
        condition: { text: "Clear", icon: "icon", code: 1000 },
        humidity: 50,
        wind_kph: 10,
        temp_f: 77,
        wind_mph: 6.7,
        feelslike_c: 22,
        feelslike_f: 71.6,
      },
      forecast: {
        forecastday: [
          {
            day: {
              maxtemp_c: 30,
              maxtemp_f: 86,
              mintemp_c: 15,
              mintemp_f: 59,
              avgtemp_c: 22,
              avgtemp_f: 71.6,
              condition: { text: "Clear", icon: "icon", code: 1000 },
            },
            hour: [],
          },
        ],
      },
    };

    const mockForecastKyiv: ForecastData = {
      location: {
        country: "Ukraine",
        lat: 51.5074,
        lon: -0.1278,
        name: "Kyiv",
        region: "Kyiv",
        tz_id: "Europe/Kyiv",
        localtimeEpoch: 1716537600,
        localtime: "2024-05-21 12:00",
      },
      current: {
        temp_c: 25,
        condition: { text: "Clear", icon: "icon", code: 1000 },
        humidity: 50,
        wind_kph: 10,
        temp_f: 77,
        wind_mph: 6.7,
        feelslike_c: 22,
        feelslike_f: 71.6,
      },
      forecast: {
        forecastday: [
          {
            day: {
              maxtemp_c: 30,
              maxtemp_f: 86,
              mintemp_c: 15,
              mintemp_f: 59,
              avgtemp_c: 22,
              avgtemp_f: 71.6,
              condition: { text: "Clear", icon: "icon", code: 1000 },
            },
            hour: [],
          },
        ],
      },
    };

    mockedAxios.get
      .mockResolvedValueOnce({ data: mockForecastLondon, status: 200 })
      .mockResolvedValueOnce({ data: mockForecastKyiv, status: 200 });

    const { result } = renderHook(() => useGetForecast(), { wrapper });

    act(() => {
      result.current.getForecast("London");
    });

    await waitFor(() => expect(result.current.isLoadingForecast).toBe(false));
    expect(result.current.forecastData).toEqual(mockForecastLondon);
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.getForecast("Kyiv");
    });

    expect(result.current.isLoadingForecast).toBe(true);

    await waitFor(() => expect(result.current.isLoadingForecast).toBe(false));
    expect(result.current.forecastData).toEqual(mockForecastKyiv);
    expect(mockedAxios.get).toHaveBeenCalledTimes(2);
    expect(mockedAxios.get).toHaveBeenLastCalledWith(
      `/api/forecast.json?key=${process.env.NEXT_PUBLIC_API_KEY}&q=Kyiv&days=1&aqi=no&alerts=no`
    );
  });
});
