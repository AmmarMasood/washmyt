"use client";

import Image from "next/image";
import Button from "../../components/Button";
import { useState } from "react";
import Card from "../../components/Card";
import LogoIcon from "../../../../public/imgs/logo-icon.svg";
import StepperBar from "@/app/components/StepperBar";
import Tick from "../../../../public/imgs/tick.svg";
import { TimePicker, message } from "antd";
import CaldendarIcon from "../../../../public/imgs/calendar-icon.svg";

import { DatePicker } from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { IOnboardingPageProps } from "./PartOne";
import Weather from "@/app/components/Weather";
import posthog from "posthog-js";
import { washRequestEvents } from "@/app/providers/posthog_events";

dayjs.extend(utc);
dayjs.extend(customParseFormat);

export default function PartFour(props: IOnboardingPageProps) {
  const { onNext, onBack, values } = props;
  const [date, setDate] = useState(values?.washD || "");
  const [time, setTime] = useState(values?.washT || "");

  const handleDateChange = (e: any) => {
    setDate(e);
  };

  const handleTime = (e: any) => {
    setTime(e);
  };

  const joinDateAndTime = (date: any, time: any) => {
    const d = dayjs(date.$d).format("DD-MM-YYYY");
    const t = dayjs(time.$d).format("H:mm:ss");

    const dateTime = dayjs(`${d} ${t} `, "DD-MM-YYYY H:mm:ss");

    return dateTime.utc().format();
  };

  const verifyFields = () => {
    if (!date || !time) {
      message.error("Please select date and time.");
      return false;
    }
    return true;
  };

  const onNextClick = () => {
    if (verifyFields()) {
      posthog.capture(washRequestEvents.WASH_REQUEST_DATE_AND_TIME_SELECTED, {
        washDate: date,
        washTime: time,
      });
      onNext({
        washDateAndTimeUTC: joinDateAndTime(date, time),
        washD: date,
        washT: time,
      });
    }
  };

  const suggestOptimalTime = () => {
    const suggestedDate = dayjs().add(2, "day").startOf("day").add(11, "hour");
    setDate(suggestedDate);
    setTime(suggestedDate);
  };

  const setQuickTime = (hours: number, minutes: number = 0) => {
    const suggestedDate = dayjs()
      .add(2, "day")
      .startOf("day")
      .add(hours, "hour")
      .add(minutes, "minute");
    setDate(suggestedDate);
    setTime(suggestedDate);
  };

  return (
    <div className="max-md:w-full max-md:mt-10 ">
      <StepperBar current={4} total={10} />
      <Card className="p-12 w-[1300px] mt-12 max-md:w-full">
        <>
          <div className="flex items-center justify-between mt-4">
            {/* <Image src={WeatherPart} alt="weather" /> */}
            <Weather
              lat={JSON.parse(values?.address).geometry.location.lat}
              lng={JSON.parse(values?.address).geometry.location.lng}
              time={dayjs(date).unix()}
            />
            <Image src={LogoIcon} alt="washmyt" />
          </div>
          <div className="p-4 mt-4 flex flex-col items-center justfiy-center max-md:p-0">
            <h1 className="text-black text-2xl text-center mb-2">
              Select a date & TIme
            </h1>
            <h3 className=" mb-16 text-primary-gray text-xl text-center">
              Please allow a 48 hour advance notice
            </h3>
            <div>
              <div className="flex items-center justify-center">
                <DatePicker
                  size="large"
                  suffixIcon={false}
                  picker="month"
                  format={"MM"}
                  value={date ? dayjs(date, "MM") : null}
                  onChange={handleDateChange}
                  placeholder="MM"
                  allowClear={false}
                  className="p-5 mb-6 !w-[90px] rounded-xl border-1 border-black text-black text-lg mr-3"
                />

                <DatePicker
                  size="large"
                  suffixIcon={false}
                  format={"DD"}
                  value={date ? dayjs(date, "D") : null}
                  onChange={handleDateChange}
                  placeholder="DD"
                  allowClear={false}
                  className="p-5 mb-6 !w-[90px] rounded-xl border-1 border-black text-black text-lg mr-3"
                />

                <DatePicker
                  size="large"
                  suffixIcon={false}
                  format={"YYYY"}
                  picker="year"
                  value={date ? dayjs(date, "YYYY") : null}
                  onChange={handleDateChange}
                  placeholder="YYYY"
                  allowClear={false}
                  className="p-5 mb-6 !w-[90px] rounded-xl border-1 border-black text-black text-lg mr-3"
                />

                <Image src={CaldendarIcon} alt="caldendar" className="-mt-7" />
              </div>
              <div className="flex items-center justify-center">
                <TimePicker
                  allowClear={false}
                  className="p-5 mb-6 !w-[90px] rounded-xl border-1 border-black text-black text-lg mr-3"
                  placeholder="HH"
                  size="large"
                  showNow={false}
                  disabledTime={
                    // disable all times between 8am and 6pm
                    () => {
                      return {
                        disabledHours: () => {
                          const hours: number[] = [];
                          for (let i = 0; i < 8; i++) {
                            hours.push(i);
                          }
                          for (let i = 19; i < 24; i++) {
                            hours.push(i);
                          }
                          return hours;
                        },
                      };
                    }
                  }
                  hideDisabledOptions={true}
                  changeOnBlur={true}
                  suffixIcon={false}
                  onChange={handleTime}
                  value={time ? dayjs(time, "h") : null}
                  format={"H"}
                />
                <span className="mb-7 text-black">:</span>
                <TimePicker
                  allowClear={false}
                  className="p-5 mb-6 !w-[90px] rounded-xl border-1 border-black text-black text-lg ml-3"
                  placeholder="MM"
                  size="large"
                  showNow={false}
                  disabledTime={
                    // disable minute with interval of 30
                    () => {
                      return {
                        disabledMinutes: () => {
                          const minutes: number[] = [];
                          for (let i = 0; i < 60; i++) {
                            if (i % 30 !== 0) {
                              minutes.push(i);
                            }
                          }
                          return minutes;
                        },
                      };
                    }
                  }
                  hideDisabledOptions={true}
                  changeOnBlur={true}
                  suffixIcon={false}
                  onChange={handleTime}
                  value={time ? dayjs(time, "m") : null}
                  format={"m"}
                />
              </div>
              <p className="text-black text-center mt-3 mb-5">
                Book appointment in 2 days at:
              </p>
              <div className="flex justify-center space-x-4 mb-4">
                <Button
                  disabled={false}
                  onClick={() => suggestOptimalTime()}
                  className="!text-white text-md whitespace-nowrap w-32"
                >
                  11 AM
                </Button>
                <Button
                  disabled={false}
                  onClick={() => setQuickTime(9, 0)}
                  className="!text-white text-md whitespace-nowrap w-32"
                >
                  9:00 AM
                </Button>
                <Button
                  disabled={false}
                  onClick={() => setQuickTime(12, 0)}
                  className="!text-white text-md whitespace-nowrap w-32"
                >
                  12:00 PM
                </Button>
                <Button
                  disabled={false}
                  onClick={() => setQuickTime(15, 0)}
                  className="!text-white text-md whitespace-nowrap w-32"
                >
                  3:00 PM
                </Button>
              </div>
            </div>
            <div className="flex items-center pt-12 mb-14">
              <p
                onClick={onBack}
                className="text-primary-color text-xs mr-6 mt-3 cursor-pointer"
              >
                &#8592; Go Back
              </p>
              <Button
                onClick={onNextClick}
                disabled={false}
                className="mt-16 !w-[150px] mb-14 !text-white"
              >
                <span className="flex items-center justify-center">
                  <label className="mr-4 !text-white">OK</label>
                  <Image src={Tick} alt="tick" />
                </span>
              </Button>
            </div>
          </div>
        </>
      </Card>
    </div>
  );
}
