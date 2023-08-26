"use client";

import Image from "next/image";
import Button from "../../components/Button";
import { ChangeEvent, useState } from "react";
import Card from "../../components/Card";
import LogoIcon from "../../../../public/imgs/logo-icon.svg";
import StepperBar from "@/app/components/StepperBar";
import { IOnboardingPageProps } from "@/app/onboard-user/getting-started/components/StartOnboarding";
import Tick from "../../../../public/imgs/tick.svg";
import { Input } from "antd";
import CaldendarIcon from "../../../../public/imgs/calendar-icon.svg";
import WeatherPart from "../../../../public/imgs/temprature.svg";

export default function PartFour(props: IOnboardingPageProps) {
  const { onNext } = props;
  const [time, setTime] = useState({
    dd: "",
    mm: "",
    yy: "",
    hh: "",
    min: "",
  });

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTime((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
          <div className="p-4 mt-4 flex flex-col items-center justfiy-center">
            <h1 className="text-black text-2xl text-center mb-2">
              Choose a wash package.
            </h1>
            <h3 className=" mb-16 text-primary-gray text-xl text-center">
              You will be asked for payment once you confirm the payment
            </h3>
            <div>
              <div className="flex items-center justify-center">
                <Input
                  name="dd"
                  placeholder="DD"
                  onChange={handleOnChange}
                  className="p-4 mb-6 !w-[90px] rounded-xl border-1 border-black text-black text-lg mr-3"
                />
                <Input
                  name="mm"
                  placeholder="MM"
                  onChange={handleOnChange}
                  className="p-4 mb-6 !w-[90px] rounded-xl border-1 border-black text-black text-lg mr-3"
                />
                <Input
                  name="yy"
                  placeholder="YYYY"
                  onChange={handleOnChange}
                  className="p-4 mb-6  !w-[100px] rounded-xl border-1 border-black text-black text-lg mr-3"
                />
                <Image src={CaldendarIcon} alt="caldendar" className="-mt-7" />
              </div>
              <div className="flex items-center justify-center">
                <Input
                  name="hh"
                  placeholder="HH"
                  onChange={handleOnChange}
                  className="p-4 mb-6 !w-[90px] rounded-xl border-1 border-black text-black text-lg mr-3"
                />
                <span className="mb-7 text-black">:</span>
                <Input
                  name="min"
                  placeholder="MM"
                  onChange={handleOnChange}
                  className="p-4 mb-6 !w-[90px] rounded-xl border-1 border-black text-black text-lg ml-3"
                />
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
