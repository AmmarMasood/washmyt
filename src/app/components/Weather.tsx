import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import dayjs from "dayjs";

function Weather({ lat, lng, time }: any) {
  const [weather, setWeather] = useState<any>(null);
  const [icon, setIcon] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState<any>(null);

  const fetchWeather = async () => {
    setLoading(true);
    const res = await axios.get(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&appid=${process.env.NEXT_PUBLIC_OPEN_WEATHER_API_KEY}`
    );
    const forecast = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${process.env.NEXT_PUBLIC_OPEN_WEATHER_API_KEY}`
    );
    const iconcode = res.data.current.weather[0].icon;
    const icon = "http://openweathermap.org/img/w/" + iconcode + ".png";

    setForecast(forecast.data);

    setWeather(res.data.current);
    setIcon(icon);
    console.log(res.data);

    setLoading(false);
  };

  useEffect(() => {
    if (time) {
      const targetDate = dayjs.unix(time).format("YYYY-MM-DD");

      const targetEntry = forecast.list.find(
        (entry: any) => dayjs(entry.dt_txt).format("YYYY-MM-DD") === targetDate
      );
      if (targetEntry) {
        console.log(targetEntry);
        setWeather({ ...targetEntry, temp: targetEntry.main.temp });
        setIcon(
          `http://openweathermap.org/img/w/${targetEntry.weather[0].icon}.png`
        );
      }
    }
  }, [time]);

  useEffect(() => {
    fetchWeather();
  }, []);

  const toCelcius = (temp: number) => {
    return Math.round(temp - 273.15);
  };
  return loading === true ? (
    <span className="text-sm text-primary-gray">Loading weather...</span>
  ) : (
    icon && (
      <div className="flex items-center">
        <Image src={icon} alt="weather" width={60} height={60} />
        <div>
          <p className="text-primary-gray text-md font-bold">
            {toCelcius(weather?.temp)} °
          </p>
          <p className="text-primary-gray text-sm font-bold">
            {weather?.weather[0]?.main}
          </p>
        </div>
      </div>
    )
  );
}

export default Weather;
