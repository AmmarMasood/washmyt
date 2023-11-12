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

dayjs.extend(utc);
dayjs.extend(customParseFormat);

export default function PartFour(props: IOnboardingPageProps) {
  const { onNext } = props;
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

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
      onNext({
        washDateAndTimeUTC: joinDateAndTime(date, time),
      });
    }
  };

  return (
    <div className="max-md:w-full max-md:mt-10 ">
      <StepperBar current={3} total={10} />
      <Card className="p-12 w-[1300px] mt-12 max-md:w-full">
        <>
          <div className="flex items-center justify-between mt-4">
            {/* <Image src={WeatherPart} alt="weather" /> */}
            <Weather />
            <Image src={LogoIcon} alt="washmyt" />
          </div>
          <div className="p-4 mt-4 flex flex-col items-center justfiy-center  max-md:p-0 ">
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
                  // hideDisabledOptions={true}
                  changeOnBlur={true}
                  suffixIcon={false}
                  onChange={handleTime}
                  value={time ? dayjs(time, "h") : null}
                  format={"H"}
                />
                {/* <Input
                  name="hh"
                  placeholder="HH"
                  onChange={handleOnChange}
                  className="p-4 mb-6 !w-[90px] rounded-xl border-1 border-black text-black text-lg mr-3"
                /> */}
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
                {/* <Input
                  name="min"
                  placeholder="MM"
                  onChange={handleOnChange}
                  className="p-4 mb-6 !w-[90px] rounded-xl border-1 border-black text-black text-lg ml-3"
                /> */}
              </div>
            </div>
            <Button
              onClick={onNextClick}
              disabled={false}
              className="mt-16 !w-[150px] mb-14"
            >
              <span className="flex items-center justify-center">
                <label className="mr-4">OK</label>
                <Image src={Tick} alt="tick" />
              </span>
            </Button>
          </div>
        </>
      </Card>
    </div>
  );
}
