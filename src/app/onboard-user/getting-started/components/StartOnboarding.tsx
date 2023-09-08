"use client";

import Image from "next/image";
import Button from "../../../components/Button";
import { ChangeEvent, useState } from "react";
import Card from "../../../components/Card";
import Logo from "../../../../../public/imgs/logo.svg";
import BgImage from "../../../../../public/imgs/bg-img.svg";
import Checkbox from "@/app/components/Checkbox";
import SmallClock from "../../../../../public/imgs/small-clock.svg";

export interface IOnboardingPageProps {
  onNext: () => void;
}
export default function StartOnboarding(props: IOnboardingPageProps) {
  const { onNext } = props;
  const [inputValues, setInputValues] = useState({
    accepted: false,
  });

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.checked,
    }));
  };

  return (
    <div>
      <Card className="p-10 relative overflow-hidden !bg-[#f0f0f0]">
        <div>
          <Image
            src={Logo}
            alt="wash-my-t-pro"
            className="mx-auto mb-10 relative z-10"
          />
          <Image
            src={BgImage}
            alt="bg"
            className="absolute -top-10 left-0 z-5 "
          />
          <h1 className="heading-1 text-center mb-5 text-[#1E1E1E] text-3xl	font-semibold	relative z-10 mt-72 max-md:mt-10">
            Welcome to WashmyT
          </h1>

          <p className="text-[#1E1E1E] text-xl text-center relative z-10 mt-10">
            We are genuinely excited to add more washes to your schedule. To
            begin receiving wash requests from us, please fill out our
            application form.
          </p>
          <p className="text-[#1E1E1E] text-xl text-center opacity-50  mt-5">
            By joining, we do not prohibit you from taking other washes; we only
            aim to add washes to your existing business. We look forward to
            working together!
          </p>
        </div>
        <div className="flex flex-col items-center justify-center  mt-5">
          <Checkbox
            checked={inputValues.accepted}
            onChange={handleOnChange}
            name="accepted"
            label="Accept Terms and Conditions to Start"
          />
          <Button onClick={onNext} className=" mt-5 w-[250px] z-10">
            Start
          </Button>
          <p className="text-sm mt-6 flex items-center">
            <Image src={SmallClock} alt="small-clock" />
            <span className="text-primary-gray ml-1">Takes 1 minute</span>
          </p>
        </div>
      </Card>
    </div>
  );
}
