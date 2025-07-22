export type City = {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  url: string;
};

export type Condition = {
  text: string;
  icon: string;
  code: number;
};

export type Location = Omit<City, "url" | "id"> & {
  tz_id: string;
  localtimeEpoch: number;
  localtime: string;
};

export type Current = {
  temp_c: number;
  temp_f: number;
  condition: Condition;
  wind_mph: number;
  wind_kph: number;
  humidity: number;
  feelslike_c: number;
  feelslike_f: number;
};

export type Day = {
  maxtemp_c: number;
  maxtemp_f: number;
  mintemp_c: number;
  mintemp_f: number;
  avgtemp_c: number;
  avgtemp_f: number;
  condition: Condition;
};

export type Hour = {
  time_epoch: number;
  time: string;
  temp_c: number;
  temp_f: number;
  condition: Condition;
  wind_mph: number;
  wind_kph: number;
  feelslike_c: number;
  feelslike_f: number;
};

export type ForecastDay = {
  day: Day;
  hour: Hour[];
};

export type Forecast = {
  forecastday: ForecastDay[];
};

export type ForecastData = {
  location: Location;
  current: Current;
  forecast: Forecast;
};
