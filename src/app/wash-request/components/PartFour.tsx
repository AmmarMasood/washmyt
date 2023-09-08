"use client";

import Image from "next/image";
import Button from "../../components/Button";
import { ChangeEvent, useState } from "react";
import Card from "../../components/Card";
import LogoIcon from "../../../../public/imgs/logo-icon.svg";
import StepperBar from "@/app/components/StepperBar";
import { IOnboardingPageProps } from "@/app/onboard-user/getting-started/components/StartOnboarding";
import Tick from "../../../../public/imgs/tick.svg";
import { Input, TimePicker } from "antd";
import CaldendarIcon from "../../../../public/imgs/calendar-icon.svg";
import WeatherPart from "../../../../public/imgs/temprature.svg";
import { DatePicker, Space } from "antd";
import dayjs from "dayjs";

export default function PartFour(props: IOnboardingPageProps) {
  const { onNext } = props;
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleDateChange = (e: any) => {
    console.log("ammar", e);
    console.log(e.$d);
    setDate(e);
  };

  const handleTime = (e: any) => {
    console.log("ammar", e);
    console.log(e.$d);
    setTime(e);
  };

  return (
    <div className="max-md:w-full max-md:mt-10 ">
      <StepperBar current={3} total={10} />
      <Card className="p-12 w-[1300px] mt-12 max-md:w-full">
        <>
          <div className="flex items-center justify-between">
            <Image src={WeatherPart} alt="weather" />
            <Image src={LogoIcon} alt="washmyt" />
          </div>
          <div className="p-4 mt-4 flex flex-col items-center justfiy-center  max-md:p-0 ">
            <h1 className="text-black text-2xl text-center mb-2">
              Choose a wash package.
            </h1>
            <h3 className=" mb-16 text-primary-gray text-xl text-center">
              You will be asked for payment once you confirm the payment
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
            <Button onClick={onNext} className="mt-16 !w-[150px] mb-14">
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
