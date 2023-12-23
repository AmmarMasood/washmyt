"use client";

import Image from "next/image";
import Button from "../../components/Button";
import { ChangeEvent, useState } from "react";
import Card from "../../components/Card";
import LogoIcon from "../../../../public/imgs/logo-icon.svg";
import StepperBar from "@/app/components/StepperBar";
import Tick from "../../../../public/imgs/tick.svg";
import { message } from "antd";
import GoogleAutocomplete from "@/app/components/GoogleAutocomplete";
import { IOnboardingPageProps } from "./PartOne";
import GreenCheckmark from "../../../../public/imgs/icons8-checkmark-30.png";

export default function PartFive(props: IOnboardingPageProps) {
  const { onNext, onBack, values } = props;
  const [address, setAddress] = useState(values?.address || "");

  const handleOnChange = (e: any) => {
    setAddress(JSON.stringify(e));
  };

  const verifyFields = () => {
    if (!address) {
      message.error("Please enter address.");
      return false;
    }
    return true;
  };

  const onNextClick = () => {
    if (verifyFields()) {
      onNext({
        address,
      });
    }
  };

  return (
    <div className="max-md:w-full max-md:mt-10 ">
      <StepperBar current={3} total={10} />
      <Card className="p-12 w-[1300px] mt-12 max-md:w-full max-md:p-4">
        <>
          <div className="flex items-end justify-end">
            <Image src={LogoIcon} alt="washmyt" />
          </div>
          <div className="p-4 mt-4 flex flex-col items-center justfiy-center max-md:p-0 ">
            <h1 className="text-black text-2xl text-center mb-2">Address</h1>
            <h3 className=" mb-2 text-primary-gray text-xl text-center">
              Please provide the address including street, city, state, zip
            </h3>
            <div className=" w-[500px] max-md:w-[300px]">
              <GoogleAutocomplete
                onSelect={handleOnChange}
                label=""
                className="!p-4 !mb-4 !mt-0 !rounded-xl border-1 border-black w-full"
                placeholder="Type your answer here"
              />

              {address && typeof address === "string" && (
                <div className="flex items-center">
                  <p className="text-primary-gray text-md text-left font-medium  mr-2 ">
                    {JSON.parse(address)?.formatted_address}
                  </p>
                  <Image
                    src={GreenCheckmark}
                    alt="checkmark"
                    height={45}
                    width={45}
                  />
                </div>
              )}
            </div>

            <div className="flex items-center pt-12 mb-14">
              <p
                onClick={onBack}
                className="text-primary-color text-xs mr-6 mt-3 cursor-pointer"
              >
                &#8592; Go Back
              </p>
              <Button
                disabled={false}
                onClick={onNextClick}
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
