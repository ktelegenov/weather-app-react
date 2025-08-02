import "./Weather.css";
import React, { useState, useRef, useEffect } from "react";
import useWeather from "./hooks/useWeather";
import { getCitySuggestions } from "./citiesData";

const Weather = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);

  const { weather, loading, error, cityTime, fetchWeather, clearError } = useWeather();

  // Handle input change and show suggestions
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    clearError();

    if (value.length >= 2) {
      const newSuggestions = getCitySuggestions(value);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
      setSelectedSuggestionIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle search
  const handleSearch = async (cityName = query) => {
    await fetchWeather(cityName);
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
    handleSearch(suggestion);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSuggestionClick(suggestions[selectedSuggestionIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setSuggestions([]);
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
      default:
        break;
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Format wind direction
  const getWindDirection = (degrees) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  return (
    <div className="weather-container">
      {/* Header */}
      <div className="weather-header">
        <h1 className="weather-title">Weather App</h1>
      </div>

      {/* Search Section */}
      <div className="search-section">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <div className="search-container">
          <input
            ref={searchInputRef}
            type="text"
            className="search-input"
            placeholder="Search for a city..."
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          
          {showSuggestions && suggestions.length > 0 && (
            <div ref={suggestionsRef} className="suggestions-list">
              {suggestions.map((suggestion, index) => (
                <div
                  key={suggestion}
                  className={`suggestion-item ${index === selectedSuggestionIndex ? 'highlighted' : ''}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  onMouseEnter={() => setSelectedSuggestionIndex(index)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>

        <button 
          onClick={() => handleSearch()} 
          className="search-button"
          disabled={loading || !query.trim()}
        >
          {loading ? 'Searching...' : 'Get Weather'}
        </button>
      </div>

      {/* Content Section */}
      <div className="weather-content">
        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        )}

        {!loading && !weather && !error && (
          <div className="welcome-message">
            <div className="welcome-icon">🌤️</div>
            <div className="welcome-text">Welcome to Weather App</div>
            <div className="welcome-subtext">Search for a city to get started</div>
          </div>
        )}

        {weather && !loading && (
          <div className="weather-info">
            <div className="location-header">
              <h2 className="location-name">{weather.name}, {weather.sys.country}</h2>
              <span className="local-time">{cityTime}</span>
            </div>

            <div className="temperature-display">
              <h1 className="temperature">
                {Math.round(weather.main.temp)}°C
              </h1>
              <p className="weather-description">
                {weather.weather[0].description}
              </p>
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
                className="weather-icon"
              />
            </div>

            <div className="weather-details">
              <div className="detail-item">
                <div className="detail-label">Feels Like</div>
                <div className="detail-value">{Math.round(weather.main.feels_like)}°C</div>
              </div>
              
              <div className="detail-item">
                <div className="detail-label">Humidity</div>
                <div className="detail-value">{weather.main.humidity}%</div>
              </div>
              
              <div className="detail-item">
                <div className="detail-label">Wind Speed</div>
                <div className="detail-value">
                  {weather.wind.speed} m/s {weather.wind.deg && getWindDirection(weather.wind.deg)}
                </div>
              </div>
              
              <div className="detail-item">
                <div className="detail-label">Pressure</div>
                <div className="detail-value">{weather.main.pressure} hPa</div>
              </div>
              
              <div className="detail-item">
                <div className="detail-label">Visibility</div>
                <div className="detail-value">
                  {weather.visibility ? (weather.visibility / 1000).toFixed(1) + ' km' : 'N/A'}
                </div>
              </div>
              
              <div className="detail-item">
                <div className="detail-label">UV Index</div>
                <div className="detail-value">
                  {weather.uvi ? Math.round(weather.uvi) : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
