import API_TOKEN from "./tokens.js";

// Function to fetch current weather data from OpenWeatherMap API
export const getCurrentWeatherData = async (lat, lon) => {
  const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_TOKEN}&units=metric&lang=fi`;

  try {
    const response = await fetch(URL);
    const data = await response.json();

    const { name, weather, main, wind } = data;
    const { temp, humidity } = main;
    const { speed } = wind;
    const { description, icon } = weather[0];

    return {
      name,
      description,
      icon,
      temp,
      humidity,
      speed,
    };
  } catch (error) {
    console.error("Error fetching current weather data:", error);
    return `Error fetching current weather data:", ${error}`;
  }
};

// Function to fetch 3-hour interval weather forecast data from OpenWeatherMap API
export const get3hWeatherData = async (lat, lon) => {
  const URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_TOKEN}&units=metric&lang=fi`;

  try {
    const response = await fetch(URL);
    const data = await response.json();

    const forecastArray = data.list.slice(0, 5).map((item) => {
      const { dt_txt, weather, main, wind } = item;
      const { icon } = weather[0];
      const { temp, humidity } = main;
      const { speed } = wind;

      const dt = new Date(dt_txt);
      const time = `${dt.getHours().toString().padStart(2, "0")}:${dt
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;

      return { time, icon, temp, humidity, speed };
    });

    return forecastArray;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return `Error fetching current weather data:", ${error}`;
  }
};
