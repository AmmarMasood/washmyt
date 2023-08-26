"use client";

import Image from "next/image";
import Button from "../../../components/Button";
import { ChangeEvent, useState } from "react";
import Card from "../../../components/Card";
import LogoIcon from "../../../../../public/imgs/logo-icon.svg";
import StepperBar from "@/app/components/StepperBar";
import Select from "@/app/components/Select";
import MultiSelect, { ISelectedValue } from "@/app/components/MultiSelect";
import UploadImage from "@/app/components/UploadImage";
import { IOnboardingPageProps } from "./StartOnboarding";

export default function FourthPart(props: IOnboardingPageProps) {
  const { onNext } = props;
  const [inputValues, setInputValues] = useState({
    selectedServices: [],
    service: "",
    businessLicense: "yes",
    waterCapabilities: "capabilities",
    electricCapabilities: "mobileCapabilities",
  });

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleMultiChange = (value: ISelectedValue) => {
    if (value.id === "") return;
    setInputValues((prev) => ({
      ...prev,
      service: value.id,
      selectedServices: [...prev.selectedServices, value],
    }));
  };

  const handleRemoveValue = (id: string) => {
    setInputValues((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.filter(
        (v) => (v as ISelectedValue).id !== id
      ),
    }));
  };

  const onUpload = (file: any) => {};

  return (
    <div className="max-md:w-full">
      <Image
        src={LogoIcon}
        alt="washmyt"
        className="absolute top-24 left-24 max-md:top-10 max-md:left-10"
      />
      <Card className="p-12 w-[800px] max-md:w-full max-md:p-6">
        <>
          <StepperBar current={3} total={5} />
          <div className="p-4 mt-4">
            <MultiSelect
              name="services"
              label="Which services can you perform?"
              placeholder="Yes"
              onChange={handleMultiChange}
              value={inputValues.service}
              selectedValues={inputValues.selectedServices}
              removeValue={handleRemoveValue}
              className="mt-8"
              options={[
                {
                  id: "",
                  value: "",
                },
                {
                  id: "wash",
                  value: "Wash",
                },
                {
                  id: "repair",
                  value: "Repair",
                },
                {
                  id: "fixes",
                  value: "Fixes",
                },
              ]}
            />
            <Select
              name="businessLicense"
              label="Do you have a business license?"
              placeholder="Yes"
              onChange={handleOnChange}
              value={inputValues.businessLicense}
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

            <UploadImage
              label="Please take a photo of your business license"
              onUpload={onUpload}
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
