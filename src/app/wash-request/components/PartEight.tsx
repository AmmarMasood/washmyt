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

export default function PartEight(props: IOnboardingPageProps) {
  const { onNext, onBack, values } = props;
  const [name, setName] = useState(values?.customerName || "");

  const handleOnChange = (e: any) => {
    setName(e.target.value);
  };

  const verifyFields = () => {
    if (!name) {
      message.error("Please enter name.");
      return false;
    }
    return true;
  };

  const onNextClick = () => {
    if (verifyFields()) {
      onNext({
        customerName: name,
      });
    }
  };

  return (
    <div className="max-md:w-full max-md:mt-10 ">
      <StepperBar current={7} total={10} />
      <Card className="p-12 w-[1300px] mt-12 max-md:w-full">
        <>
          <div className="flex items-end justify-end">
            <Image src={LogoIcon} alt="washmyt" />
          </div>
          <div className="p-4 mt-4 flex flex-col items-center justfiy-center max-md:p-0">
            <h1 className="text-black text-2xl text-center mb-8">First name</h1>
            <Input
              value={name}
              placeholder="Type your answer here"
              onChange={handleOnChange}
              className="p-4 mb-6 w-[500px]  max-md:w-[250px] rounded-xl border-1 border-black"
            />
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
                className="mt-16 !w-[150px] mb-14"
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
