import "./App.css";
import React, { useEffect, useState } from "react";
import { Divider, Paper } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { get3hWeatherData, getCurrentWeatherData } from "./WeatherData.js";
import getCurrentTimeAndDate from "./CurrentTimeAndDate.js";

// Function to fetch weather data for different cities and display it
function WeatherRadar() {
  const [selectedCity, setSelectedCity] = useState("Kaikki kaupungit");
  const [weatherDataReady, setWeatherDataReady] = useState(false);
  const [currentWeather, setCurrentWeather] = useState([]);
  const [weatherForecasts, setWeatherForecasts] = useState([]);
  const { time, date } = getCurrentTimeAndDate();

  const cities = [
    { name: "Kaikki kaupungit", lat: "", lon: "" },
    { name: "Tampere", lat: "61.4991", lon: "23.7871" },
    { name: "Jyväskylä", lat: "62.2415", lon: "25.7209" },
    { name: "Kuopio", lat: "62.8924", lon: "27.677" },
    { name: "Espoo", lat: "60.25", lon: "24.667" },
  ];

  // Function to fetch weather data based on city
  const fetchWeatherData = async (name, lat, lon) => {
    setWeatherDataReady(false);
    if (name === "Kaikki kaupungit") {
      const currentPromises = cities.slice(1).map(async (city) => {
        const currentWeatherData = await getCurrentWeatherData(
          city.lat,
          city.lon
        );
        return currentWeatherData;
      });

      const forecastPromises = cities.slice(1).map(async (city) => {
        const forecastData = await get3hWeatherData(city.lat, city.lon);
        return forecastData;
      });

      setCurrentWeather(await Promise.all(currentPromises));
      setWeatherForecasts(await Promise.all(forecastPromises));
    } else {
      const currentWeatherData = await getCurrentWeatherData(lat, lon);
      const forecastData = await get3hWeatherData(lat, lon);
      setCurrentWeather([currentWeatherData]);
      setWeatherForecasts([forecastData]);
    }
    setWeatherDataReady(true);
  };

  const handleChange = (name, lat, lon) => async () => {
    setSelectedCity(name);
    fetchWeatherData(name, lat, lon);
  };

  useEffect(() => {
    fetchWeatherData("Kaikki kaupungit");
  }, []);

  return (
    <div className="app">
      <div>
        <div className="header">Säätutka</div>
        <Divider />
      </div>
      <div className="appWrapper">
        <div className="selectContainer">
          <Select
            data-testid="select"
            value={selectedCity}
            onChange={handleChange}
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                borderStyle: "none",
              },
              border: "1px solid lightgray",
              maxWidth: "450px",
              width: "100%",
              marginTop: "20px",
              boxShadow: 1,
              background: "#FFFFFF",
              textAlign: "left",
            }}
          >
            {cities.map((city, key) => (
              <MenuItem
                key={key}
                value={city.name}
                onClick={handleChange(city.name, city.lat, city.lon)}
              >
                {city.name}
              </MenuItem>
            ))}
          </Select>
        </div>
        {weatherDataReady ? (
          <>
            {currentWeather.map((weather, key) => (
              <>
                <div key={key} className="centeredContainer">
                  <Paper className="paper">
                    <div className="contentWrapper">
                      <div className="topLeft">
                        <div className="cityName">{weather.name}</div>
                        <div className="descriptionText">
                          {weather.description}
                        </div>
                      </div>
                      <div className="topRight">
                        <div>
                          <img
                            src={`https://openweathermap.org/img/w/${weather.icon}.png`}
                            alt=""
                          />
                        </div>
                        <div className="weatherDegree">
                          {Math.round(weather.temp)} °C
                        </div>
                      </div>
                      <div className="bottomLeft">
                        <div className="dateText">{date}</div>
                        <div className="descriptionText">{time}</div>
                      </div>
                      <div className="bottomRight">
                        <div className="descriptionText">
                          Tuuli: {weather.speed} m/s
                        </div>
                        <div className="descriptionText">
                          Ilmankosteus: {weather.humidity} %
                        </div>
                      </div>
                    </div>
                  </Paper>
                </div>
                <div>
                  <div>
                    {weatherForecasts[key].map((forecast, forecastkey) => (
                      <Paper className="paperSmall" key={forecastkey}>
                        <div className="weatherInfo">
                          <div className="descriptionText">{forecast.time}</div>
                          <div>
                            <img
                              src={`https://openweathermap.org/img/w/${forecast.icon}.png`}
                              alt={""}
                            />
                          </div>
                          <div className="weatherDegreeSmall">
                            {Math.round(forecast.temp)} °C
                          </div>
                        </div>
                        <Divider />
                        <div className="smallText">
                          <div>{forecast.speed} m/s</div>
                          <div>{forecast.humidity} %</div>
                        </div>
                      </Paper>
                    ))}
                  </div>
                </div>
              </>
            ))}
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default WeatherRadar;
