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
import GoogleAutocomplete from "@/app/components/GoogleAutocomplete";

export default function PartFive(props: IOnboardingPageProps) {
  const { onNext } = props;
  const [address, setAddress] = useState("");

  const handleOnChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setAddress(e.target.value);
  };

  return (
    <div className="max-md:w-full max-md:mt-10 ">
      <StepperBar current={4} total={10} />
      <Card className="p-12 w-[1300px] mt-12 max-md:w-full">
        <>
          <Image src={LogoIcon} alt="washmyt" className="float-right" />
          <div className="p-4 mt-4 flex flex-col items-center justfiy-center">
            <h1 className="text-black text-2xl text-center mb-2">Address</h1>
            <h3 className=" mb-2 text-primary-gray text-xl text-center">
              Please provide the address including street, city, state, zip
            </h3>

            <GoogleAutocomplete
              onSelect={(e) => setAddress(e)}
              label=""
              className="!p-4 !mb-6 !mt-0 !w-[500px] !max-md:w-[300px] !rounded-xl border-1 border-black"
              placeholder="Type your answer here"
            />
            <p className="paragraph-1 text-center">
              Shift ⇧ + Enter ↵ to make a line break
            </p>
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
