"use client";

import Image from "next/image";
import Button from "../../../components/Button";
import { ChangeEvent, useState } from "react";
import Card from "../../../components/Card";
import LogoIcon from "../../../../../public/imgs/logo-icon.svg";
import StepperBar from "@/app/components/StepperBar";
import FormField from "@/app/components/FormField";
import Select from "@/app/components/Select";
import { IOnboardingPageProps } from "./StartOnboarding";

export default function SecondPart(props: IOnboardingPageProps) {
  const { onNext } = props;
  const [inputValues, setInputValues] = useState({
    businessAdderess: "",
    tShirtSize: "m",
    website: "",
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
          <StepperBar current={1} total={5} />
          <div className="p-4 mt-4">
            <FormField
              type="email"
              name="email"
              label="Your Email*"
              placeholder="Email"
              onChange={handleOnChange}
              value={inputValues.email}
              className="mt-4"
            />
            <FormField
              type="text"
              name="website"
              label="Your Website"
              placeholder="Website"
              onChange={handleOnChange}
              value={inputValues.website}
              className="mt-8"
            />
            <Select
              name="tShirtSize"
              label="T shirt size"
              onChange={handleOnChange}
              value={inputValues.tShirtSize}
              className="mt-8"
              options={[
                {
                  id: "s",
                  value: "S",
                },
                {
                  id: "m",
                  value: "M",
                },
                {
                  id: "l",
                  value: "L",
                },
                {
                  id: "xl",
                  value: "XL",
                },
              ]}
            />
            <FormField
              type="text"
              name="businessAdderess"
              label="Business Address"
              placeholder="Business Address"
              onChange={handleOnChange}
              value={inputValues.businessAdderess}
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
