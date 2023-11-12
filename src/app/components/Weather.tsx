import React, { useEffect, useState } from "react";
import axios from "axios";
import WeatherIcon from "../../../public/imgs/weather.svg";
import Image from "next/image";

function Weather({ lat, lng }: any) {
  const [weather, setWeather] = useState(null);

  // const fetchWeather = async () => {
  //   const res = await axios.get(
  //     `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&appid=${process.env.NEXT_PUBLIC_OPEN_WEATHER_API_KEY}`
  //   );
  //   console.log(res);
  // };

  // useEffect(() => {
  //   fetchWeather();
  // }, []);
  return <Image src={WeatherIcon} alt="weather" />;
}

export default Weather;
