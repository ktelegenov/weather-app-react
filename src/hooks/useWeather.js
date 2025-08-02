import { useState, useCallback } from 'react';

const useWeather = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cityTime, setCityTime] = useState('');

  const api = {
    key: "5a139e2949d094a8d498f0bc4fdc8099", // Your OpenWeather API key
    base: "https://api.openweathermap.org/data/2.5/",
  };

  const formatTime = (timezoneOffset) => {
    const currentTime = new Date();
    const utcTime = new Date(
      currentTime.getTime() + currentTime.getTimezoneOffset() * 60000
    );
    const localTime = new Date(utcTime.getTime() + timezoneOffset * 1000);
    
    return localTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const fetchWeather = useCallback(async (city) => {
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${api.base}weather?q=${encodeURIComponent(city)}&units=metric&APPID=${api.key}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('City not found. Please check the spelling and try again.');
        } else if (response.status === 401) {
          throw new Error('API key is invalid. Please check your configuration.');
        } else {
          throw new Error(`Weather service error: ${response.status}`);
        }
      }

      const data = await response.json();
      const formattedTime = formatTime(data.timezone);
      
      setCityTime(formattedTime);
      setWeather(data);
    } catch (error) {
      setError(error.message);
      setWeather(null);
      setCityTime('');
    } finally {
      setLoading(false);
    }
  }, [api.base, api.key]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setWeather(null);
    setError(null);
    setCityTime('');
    setLoading(false);
  }, []);

  return {
    weather,
    loading,
    error,
    cityTime,
    fetchWeather,
    clearError,
    reset
  };
};

export default useWeather;
