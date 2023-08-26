"use client";

import Image from "next/image";
import Button from "../../../components/Button";
import { ChangeEvent, useState } from "react";
import Card from "../../../components/Card";
import LogoIcon from "../../../../../public/imgs/logo-icon.svg";
import StepperBar from "@/app/components/StepperBar";
import FormField from "@/app/components/FormField";
import { IOnboardingPageProps } from "./StartOnboarding";

export default function FirstPart(props: IOnboardingPageProps) {
  const { onNext } = props;
  const [inputValues, setInputValues] = useState({
    businessName: "",
    name: "",
    mobileNumber: "",
    email: "",
  });

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="max-md:w-full">
      <Image
        src={LogoIcon}
        alt="washmyt"
        className="absolute top-24 left-24 max-md:top-10 max-md:left-10"
      />
      <Card className="p-12 w-[800px] max-md:w-full max-md:p-6">
        <>
          <StepperBar current={0} total={5} />
          <div className="p-4 mt-4">
            <FormField
              type="text"
              name="businessName"
              label="Your Business Name*"
              placeholder="Business Name"
              onChange={handleOnChange}
              value={inputValues.businessName}
              className="mt-4"
            />
            <FormField
              type="text"
              name="name"
              label="Your Name*"
              placeholder="Name"
              onChange={handleOnChange}
              value={inputValues.name}
              className="mt-8"
            />
            <FormField
              type="number"
              name="mobileNumber"
              label="Your Mobile Phone Number*"
              placeholder="000 000 000"
              onChange={handleOnChange}
              value={inputValues.mobileNumber}
              preField="-1"
              className="mt-8"
            />
            <FormField
              type="email"
              name="email"
              label="Your Email*"
              placeholder="Email"
              onChange={handleOnChange}
              value={inputValues.email}
              className="mt-8"
            />
            <Button onClick={onNext} className="mt-10">
              Next
            </Button>
          </div>
        </>
      </Card>
    </div>
  );
}
