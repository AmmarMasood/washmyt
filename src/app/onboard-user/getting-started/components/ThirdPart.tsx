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
import { UserAuth } from "@/app/context/AuthContext";
import axiosApiInstance from "@/app/utils/axiosClient";
import { message } from "antd";

export default function ThirdPart(props: IOnboardingPageProps) {
  const { onNext } = props;
  const { profile, setLoading } = UserAuth() as any;

  const [inputValues, setInputValues] = useState({
    radius: profile.serviceRadius || "30",
    ownCar: profile.ownACar === false ? "no" : "yes",
    waterCapabilities: profile.mobileWaterCapability === false ? "no" : "yes",
    electricCapabilities:
      profile.mobileElectricCapability === false ? "no" : "yes",
  });

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const verifyFields = () => {
    if (!inputValues.radius) {
      return false;
    }
    return true;
  };

  const updateData = async () => {
    if (!verifyFields()) {
      message.error("Please fill all the required fields.");
      return;
    }
    setLoading(true);
    try {
      await axiosApiInstance.post("/api/onboard/complete-profile", {
        serviceRadius: parseFloat(inputValues.radius),
        ownACar: inputValues.ownCar === "yes" ? true : false,
        mobileWaterCapability:
          inputValues.waterCapabilities === "yes" ? true : false,
        mobileElectricCapability:
          inputValues.electricCapabilities === "yes" ? true : false,
      });
      onNext();
    } catch (error) {
      console.log(error);
      message.error("Something went wrong. Please try again.");
    }
    setLoading(false);
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
              label="Service Radius (how far will you travel in miles?)*"
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
                  value: "yes",
                },
                {
                  id: "no",
                  value: "no",
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
                  value: "yes",
                },
                {
                  id: "no",
                  value: "no",
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
                  value: "yes",
                },
                {
                  id: "no",
                  value: "no",
                },
              ]}
            />
            <Button disabled={false} onClick={updateData} className="mt-10">
              Next
            </Button>
          </div>
        </>
      </Card>
    </div>
  );
}
