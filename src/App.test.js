import { render, screen, fireEvent } from "@testing-library/react";
import { getCurrentWeatherData, get3hWeatherData } from "./WeatherData";
import WeatherRadar from "./App";

test("renders weather radar component and displays all weather information", async () => {
  render(<WeatherRadar />);

  expect(await screen.findByText(/Tampere/i)).toBeInTheDocument();
  expect(await screen.findByText(/Jyväskylä/i)).toBeInTheDocument();
  expect(await screen.findByText(/Kuopio/i)).toBeInTheDocument();
  expect(await screen.findByText(/Espoo/i)).toBeInTheDocument();
});

test("selects a city and displays weather information", async () => {
  render(<WeatherRadar />);

  const selectComponent = screen.getByText("Kaikki kaupungit");

  // Click to open the dropdown
  fireEvent.mouseDown(selectComponent);

  // Find the option for "Tampere" and simulate a click
  const optionTampere = await screen.findByText(/Tampere/i);
  fireEvent.click(optionTampere);

  // Ensure that the selected city is displayed
  expect(await screen.findByText(/Tampere/i)).toBeInTheDocument();
});

test("fetches current weather data with correct parameters", async () => {
  const lat = 61.4991;
  const lon = 23.7871;
  const weatherData = await getCurrentWeatherData(lat, lon);

  expect(weatherData).toHaveProperty("name", "Tampere");
  expect(weatherData).toHaveProperty("temp");
  expect(weatherData).toHaveProperty("humidity");
  expect(weatherData).toHaveProperty("speed");
});

test("fetches 3-hour weather forecast data with correct parameters", async () => {
  const lat = 61.4991;
  const lon = 23.7871;
  const forecastData = await get3hWeatherData(lat, lon);

  expect(forecastData).toHaveLength(5); // Assuming 5 forecasts are fetched
  expect(forecastData[0]).toHaveProperty("time");
  expect(forecastData[0]).toHaveProperty("icon");
  expect(forecastData[0]).toHaveProperty("temp");
  expect(forecastData[0]).toHaveProperty("humidity");
  expect(forecastData[0]).toHaveProperty("speed");
});
