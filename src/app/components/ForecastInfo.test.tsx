import { render, screen } from "@testing-library/react";
import ForecastInfo from "./ForecastInfo";
import { ForecastData } from "@/api/types";

describe("ForecastInfo", () => {
  it("renders 'No forecast loaded yet' when no data is provided", () => {
    render(<ForecastInfo />);
    expect(screen.getByText(/No forecast loaded yet/i)).toBeInTheDocument();
  });

  it("renders all forecast details when valid data is provided", () => {
    const mockForecast: ForecastData = {
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
    render(<ForecastInfo forecastData={mockForecast} />);
    expect(screen.getByText(/London, UK/)).toBeInTheDocument();
    expect(screen.getByText(/Clear/)).toBeInTheDocument();
    expect(screen.getByText(/25°C \/ 77°F/)).toBeInTheDocument();
    expect(screen.getByText(/22°C \/ 71.6°F/)).toBeInTheDocument();
    expect(screen.getByText(/15°C \/ 59°F/)).toBeInTheDocument();
    expect(screen.getByText(/30°C \/ 86°F/)).toBeInTheDocument();
    expect(screen.getByText(/10 km\/h \/ 6.7 mph/)).toBeInTheDocument();
    expect(screen.getByText(/50%/)).toBeInTheDocument();
  });
});
