import axios from "axios";

export function getWeather(lat, lon, timezone) {
   return axios.get("https://api.open-meteo.com/v1/forecast", {
        params: {
            latitude: lat,
            longitude: lon,
            timezone,
            current_weather: true,
            hourly: "temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m",
            daily: "weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,wind_speed_10m_max",
            temperature_unit: "fahrenheit",
            wind_speed_unit: "mph",
            precipitation_unit: "inch",
            timeformat: "unixtime",
        }
    })
    .then(({ data }) => {
        // Parsing data into desired format before returning
        return {
            current: parseCurrentWeather(data),
            daily: parseDailyWeather(data),
            hourly: parseHourlyWeather(data),
        };
    })
    .catch((error) => {
        console.error("Error fetching weather data", error.response ? error.response.data : error.message);
        throw error;  // This will trigger the `.catch` in main.js
    });
}

function parseCurrentWeather(data) {
    const {
        current_weather: { temperature: currentTemp = 0, windspeed: windSpeed, weathercode: iconCode } = {},
        daily: {
            temperature_2m_max: [maxTemp] = [],
            temperature_2m_min: [minTemp] = [],
            apparent_temperature_max: [maxFeelsLikeTemp] = [],
            apparent_temperature_min: [minFeelsLikeTemp] = [],
            precipitation_sum: [precip] = [],
        } = {},
    } = data;

    return {
        currentTemp: Math.round(currentTemp),
        highTemp: Math.round(maxTemp),
        lowTemp: Math.round(minTemp),
        highFeelsLike: Math.round(maxFeelsLikeTemp),
        lowFeelsLike: Math.round(minFeelsLikeTemp),
        windSpeed: Math.round(windSpeed),
        precip: Math.round(precip * 100) / 100,
        iconCode,
    };
}

function parseDailyWeather(data) {
    return data.daily.time.map((time, index) => {
        return {
            timestamp: time * 1000,  // Convert UNIX timestamp to milliseconds
            iconCode: data.daily.weather_code[index],
            maxTemp: Math.round(data.daily.temperature_2m_max[index]),
            minTemp: Math.round(data.daily.temperature_2m_min[index]),
        };
    });
}

function parseHourlyWeather(data) {
    return data.hourly.time.map((time, index) => {
        return {
            timestamp: time * 1000,  // Convert UNIX timestamp to milliseconds
            temp: Math.round(data.hourly.temperature_2m[index]),
            iconCode: data.hourly.weather_code[index],
            feelsLike: Math.round(data.hourly.apparent_temperature[index]),
            windSpeed: Math.round(data.hourly.wind_speed_10m[index]),
            precip: Math.round(data.hourly.precipitation[index] * 100) / 100,
        };
    });
}
