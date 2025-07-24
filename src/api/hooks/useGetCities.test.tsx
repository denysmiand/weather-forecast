import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useGetCities from "../hooks/useGetCities"; // Adjust the path to your hook
import axios from "axios"; // Import axios to mock it

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

describe("useGetCities", () => {
  beforeEach(() => {
    mockedAxios.get.mockClear();
    queryClient.clear();
  });

  it("should return empty data and not be loading when search is empty", () => {
    const { result } = renderHook(() => useGetCities({ search: "" }), {
      wrapper,
    });

    expect(result.current.citiesData).toBeUndefined();
    expect(result.current.isLoadingCities).toBe(false);
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });

  it("should fetch cities when search term is provided successfully", async () => {
    const mockCities = [
      {
        id: 1,
        name: "London",
        region: "City of London, Greater London",
        country: "UK",
        lat: 51.5,
        lon: -0.1,
        url: "london",
      },
      {
        id: 2,
        name: "Londonderry",
        region: "County Londonderry",
        country: "UK",
        lat: 54.9,
        lon: -7.3,
        url: "londonderry",
      },
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: mockCities, status: 200 });

    const { result } = renderHook(() => useGetCities({ search: "London" }), {
      wrapper,
    });

    expect(result.current.citiesData).toBeUndefined();
    expect(result.current.isLoadingCities).toBe(true);

    await waitFor(() => expect(result.current.isLoadingCities).toBe(false));

    expect(result.current.citiesData).toEqual(mockCities);

    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      `/api/search.json?key=${process.env.NEXT_PUBLIC_API_KEY}&q=London`
    );
  });

  it("should refetch cities when searching for another city", async () => {
    const mockCitiesLondon = [
      {
        id: 1,
        name: "London",
        region: "UK",
        country: "UK",
        lat: 0,
        lon: 0,
        url: "london",
      },
    ];
    const mockCitiesKyiv = [
      {
        id: 2,
        name: "Kyiv",
        region: "Ukraine",
        country: "Ukraine",
        lat: 0,
        lon: 0,
        url: "kyiv",
      },
    ];

    mockedAxios.get
      .mockResolvedValueOnce({ data: mockCitiesLondon, status: 200 })
      .mockResolvedValueOnce({ data: mockCitiesKyiv, status: 200 });

    const { result, rerender } = renderHook(
      ({ search }) => useGetCities({ search }),
      { initialProps: { search: "London" }, wrapper }
    );
    expect(result.current.isLoadingCities).toBe(true);

    await waitFor(() => expect(result.current.isLoadingCities).toBe(false));
    expect(result.current.citiesData).toEqual(mockCitiesLondon);
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);

    rerender({ search: "Kyiv" });

    expect(result.current.isLoadingCities).toBe(true);

    await waitFor(() => expect(result.current.isLoadingCities).toBe(false));
    expect(result.current.citiesData).toEqual(mockCitiesKyiv);
    expect(mockedAxios.get).toHaveBeenCalledTimes(2);
    expect(mockedAxios.get).toHaveBeenLastCalledWith(
      `/api/search.json?key=${process.env.NEXT_PUBLIC_API_KEY}&q=Kyiv`
    );
  });

  it("should return empty array if no cities are found", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [], status: 200 });

    const { result } = renderHook(
      () => useGetCities({ search: "NonExistentCity" }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isLoadingCities).toBe(false));

    expect(result.current.citiesData).toEqual([]);
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
  });

  it("should handle API errors", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Network Error"));

    const { result } = renderHook(() => useGetCities({ search: "London" }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isLoadingCities).toBe(false));

    expect(result.current.citiesData).toBeUndefined();
  });
});
