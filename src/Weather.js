import "./Weather.css";
import React, { useState } from "react";

function myFunction(error) {
  alert("Failed to fetch weather data: " + error);
}

const Weather = () => {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState(null);
  const [cityTime, setCityTime] = useState("");

  const api = {
    key: "5a139e2949d094a8d498f0bc4fdc8099", // Replace with your OpenWeather API key
    base: "https://api.openweathermap.org/data/2.5/",
  };

  const search = async () => {
    try {
      const response = await fetch(
        `${api.base}weather?q=${query}&units=metric&APPID=${api.key}`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      const timezoneOffset = data.timezone;
      const currentTime = new Date();
      const utcTime = new Date(
        currentTime.getTime() + currentTime.getTimezoneOffset() * 60000
      );
      const localTime = new Date(utcTime.getTime() + timezoneOffset * 1000);
      const hours = localTime.getHours().toString().padStart(2, "0");
      const minutes = localTime.getMinutes().toString().padStart(2, "0");
      const formattedTime = `${hours}:${minutes}`;
      setCityTime(formattedTime);
      setWeather(data);
      setQuery("");
    } catch (error) {
      myFunction(error.message);
      console.log("Failed to fetch weather data:", error.message);
      setWeather(null);
      setQuery("");
    }
  };

  return (
    <div className="container p-3">
    
      <div className="offset-lg-3 col-lg-6">
        <div className="card">
          <div className="card-title text-center py-2">
            Simple Weather App
          </div>
          <div className="search-box d-flex p-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search for a city"
              onChange={(e) => setQuery(e.target.value)}
              value={query}
            />
            <button onClick={search} className="btn btn-secondary ms-2">
              Search
            </button>
          </div>
          <div className="card-body">
            {weather && (
              <div className="vh-auto">
                <div className="container py-5 h-100">
                  <div className="row d-flex justify-content-center align-items-center h-100">                    
                    <div className="">
                      <div className="card weather-card">
                        <div className="card-body p-4">
                          <div className="d-flex">
                            <h6 className="flex-grow-1"> {weather.name}</h6>
                            <h6> {cityTime} </h6>
                          </div>
                          

                          <div className="d-flex flex-column text-center mt-5 mb-4">
                            <h6 className="display-4 mb-0 font-weight-bold">
                              {Math.round(weather.main.temp)} &deg;C
                            </h6>
                            <span className="small description">
                              {weather.weather[0].main}
                            </span>
                            <span>
                              <img
                                alt="Weather Icon"
                                className="text-center"
                                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                                width="100px"
                              />
                            </span>
                          </div>

                          <div className="d-flex align-items-center">
                            <div className="flex-grow-1">
                              <div>
                                <span className="ms-1 small">
                                  Feels like:{" "}
                                  {Math.round(weather.main.feels_like)} &deg;C
                                </span>
                              </div>
                              <div>
                                <span className="ms-1 small">
                                  Wind speed: {weather.wind.speed} m/s
                                </span>
                              </div>
                              <div>
                                <span className="ms-1 small">
                                  Humidity: {weather.main.humidity} %
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;
