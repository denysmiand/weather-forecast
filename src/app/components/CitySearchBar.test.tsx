import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CitySearchBar from "./CitySearchBar";

jest.mock("@/api/hooks/useGetCities", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    citiesData: [
      {
        id: 1,
        name: "London",
        region: "London",
        country: "UK",
        lat: 0,
        lon: 0,
        url: "london",
      },
    ],
    isLoadingCities: false,
  })),
}));

const localStorageMock = (function () {
  let store: { [key: string]: string } = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

const mockOnSelectCity = jest.fn();
const mockOnGetForecast = jest.fn();

const defaultProps = {
  selectedCity: null,
  onSelectCity: mockOnSelectCity,
  onGetForecast: mockOnGetForecast,
  isLoadingForecast: false,
};

describe("CitySearchBar", () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  it("renders input and search button", () => {
    render(<CitySearchBar {...defaultProps} />);
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    expect(screen.getByTestId("searchButton")).toBeInTheDocument();
  });

  it("calls onSelectCity when a city is selected", async () => {
    render(<CitySearchBar {...defaultProps} />);
    const input = screen.getByLabelText(/city/i);
    fireEvent.change(input, { target: { value: "London" } });
    await waitFor(() => {
      fireEvent.click(screen.getByText("London"));
    });
    expect(mockOnSelectCity).toHaveBeenCalledWith(
      expect.objectContaining({ name: "London" })
    );
  });

  it("calls onGetForecast when search button is clicked", () => {
    render(
      <CitySearchBar
        {...defaultProps}
        selectedCity={{
          id: 1,
          name: "London",
          region: "London",
          country: "UK",
          lat: 0,
          lon: 0,
          url: "london",
        }}
      />
    );
    fireEvent.click(screen.getByTestId("searchButton"));
    expect(mockOnGetForecast).toHaveBeenCalled();
  });

  it("renders search history and allows removing a city", async () => {
    localStorage.setItem(
      "searchHistory",
      JSON.stringify([
        {
          id: 1,
          name: "London",
          region: "London",
          country: "UK",
          lat: 0,
          lon: 0,
          url: "london",
        },
      ])
    );

    render(<CitySearchBar {...defaultProps} />);

    expect(screen.getByText("London")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("ClearIcon"));

    await waitFor(() => {
      const searchHistoryJson = localStorage.getItem("searchHistory");

      expect(searchHistoryJson).not.toBeNull();

      if (!searchHistoryJson) return;

      const updatedSearchHistory = JSON.parse(searchHistoryJson);

      expect(updatedSearchHistory).toEqual([
        {
          id: 1,
          name: "London",
          region: "London",
          country: "UK",
          lat: 0,
          lon: 0,
          url: "london",
          deleted: true,
        },
      ]);
    });
  });
});
