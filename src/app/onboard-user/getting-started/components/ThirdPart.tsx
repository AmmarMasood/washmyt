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

export default function ThirdPart(props: IOnboardingPageProps) {
  const { onNext } = props;
  const [inputValues, setInputValues] = useState({
    radius: "",
    ownCar: "yes",
    waterCapabilities: "yes",
    electricCapabilities: "yes",
  });

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="max-md:w-full">
      <Card className="p-12 w-[800px] max-md:w-full max-md:p-6">
        <>
          <StepperBar current={2} total={5} />
          <div className="p-4 mt-4">
            <FormField
              type="number"
              name="radius"
              label="Service Radius (how far will you travel?)"
              placeholder="0 miles"
              onChange={handleOnChange}
              value={inputValues.radius}
              className="mt-4"
            />
            <Select
              name="ownCar"
              label="Do you own a car?"
              placeholder="Yes"
              onChange={handleOnChange}
              value={inputValues.ownCar}
              className="mt-8"
              options={[
                {
                  id: "yes",
                  value: "Yes",
                },
                {
                  id: "no",
                  value: "No",
                },
              ]}
            />
            <Select
              name="waterCapabilities"
              label="Mobile Water Capabilities"
              onChange={handleOnChange}
              value={inputValues.waterCapabilities}
              className="mt-8"
              options={[
                {
                  id: "yes",
                  value: "Yes",
                },
                {
                  id: "no",
                  value: "No",
                },
              ]}
            />
            <Select
              name="electricCapabilities"
              label="Mobile Electric Capabilities"
              onChange={handleOnChange}
              value={inputValues.electricCapabilities}
              className="mt-8"
              options={[
                {
                  id: "yes",
                  value: "Yes",
                },
                {
                  id: "no",
                  value: "No",
                },
              ]}
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
