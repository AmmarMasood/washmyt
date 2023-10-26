"use client";

import Image from "next/image";
import Button from "../../components/Button";
import { useState } from "react";
import Card from "../../components/Card";
import LogoIcon from "../../../../public/imgs/logo-icon.svg";
import StepperBar from "@/app/components/StepperBar";
import { Input, message } from "antd";
import Link from "next/link";
import { IOnboardingPageProps } from "./PartOne";

export default function PartTen(props: IOnboardingPageProps) {
  const { onNext } = props;
  const [extension, setExtension] = useState("+1");
  const [phone, setPhone] = useState("");

  const handleOnChange = (e: any) => {
    setPhone(e.target.value);
  };

  const verifyFields = () => {
    if (!phone) {
      message.error("Please enter phone.");
      return false;
    }

    return true;
  };

  const onNextClick = () => {
    if (verifyFields()) {
      onNext(
        {
          customerPhoneNumber: phone,
        },
        true
      );
    }
  };

  return (
    <div className="max-md:w-full max-md:mt-10 ">
      <StepperBar current={9} total={10} />
      <Card className="p-12 w-[1300px] mt-12 max-md:w-full">
        <>
          <div className="flex items-end justify-end">
            <Image src={LogoIcon} alt="washmyt" />
          </div>
          <div className="p-4 mt-4 flex flex-col items-center justfiy-center  max-md:p-0 ">
            <h1 className="text-black text-2xl text-center mb-8">
              Lastly, your mobile number
            </h1>
            <div className="flex items-center justify-center">
              <Input
                style={{ width: "65px" }}
                onChange={(e) => setExtension(e.target.value)}
                value={extension}
                className="p-4 mb-6 rounded-xl border-1 border-black mr-4"
              />
              <Input
                placeholder="Type your answer here"
                type="number"
                onChange={handleOnChange}
                className="p-4 mb-6 w-[500px] max-md:w-[250px] rounded-xl border-1 border-black"
              />
            </div>

            <Button
              disabled={false}
              onClick={onNextClick}
              className="mt-16 !w-fit mb-14 px-4"
            >
              <span className="flex items-center justify-center">
                <label>Submit Wash Request</label>
              </span>
            </Button>
          </div>
        </>
      </Card>
    </div>
  );
}
