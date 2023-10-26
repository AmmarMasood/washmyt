"use client";

import Image from "next/image";
import Button from "../../components/Button";
import { useState } from "react";
import Card from "../../components/Card";
import LogoIcon from "../../../../public/imgs/logo-icon.svg";
import StepperBar from "@/app/components/StepperBar";
import Tick from "../../../../public/imgs/tick.svg";
import { Input, message } from "antd";
import { IOnboardingPageProps } from "./PartOne";

export default function PartNine(props: IOnboardingPageProps) {
  const { onNext } = props;
  const [email, setEmail] = useState("");

  const handleOnChange = (e: any) => {
    setEmail(e.target.value);
  };

  const verifyEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const verifyFields = () => {
    if (!email) {
      message.error("Please enter email.");
      return false;
    }

    if (verifyEmail(email) === false) {
      message.error("Please enter a valid email.");
      return false;
    }

    return true;
  };

  const onNextClick = () => {
    if (verifyFields()) {
      onNext({
        customerEmail: email,
      });
    }
  };

  return (
    <div className="max-md:w-full max-md:mt-10 ">
      <StepperBar current={8} total={10} />
      <Card className="p-12 w-[1300px] mt-12 max-md:w-full">
        <>
          {" "}
          <div className="flex items-end justify-end">
            <Image src={LogoIcon} alt="washmyt" />
          </div>
          <div className="p-4 mt-4 flex flex-col items-center justfiy-center  max-md:p-0 ">
            <h1 className="text-black text-2xl text-center mb-8">Your email</h1>
            <Input
              placeholder="Type your answer here"
              onChange={handleOnChange}
              className="p-4 mb-6 w-[500px] max-md:w-[250px] rounded-xl border-1 border-black"
            />

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
