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
import GoogleAutocomplete from "@/app/components/GoogleAutocomplete";
import { UserAuth } from "@/app/context/AuthContext";
import axiosApiInstance from "@/app/utils/axiosClient";
import { message } from "antd";
import GreenCheckmark from "../../../../../public/imgs/icons8-checkmark-30.png";

export default function SecondPart(props: IOnboardingPageProps) {
  const { onNext } = props;
  const { profile, setLoading } = UserAuth() as any;
  const [inputValues, setInputValues] = useState({
    businessAdderess: profile.businessAddress || "",
    tShirtSize: profile.tShirtSize || "",
    website: profile.website || "",
    email: profile.email || "",
  });

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const verifyFields = () => {
    if (!inputValues.businessAdderess) {
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
        businessAddress: inputValues.businessAdderess,
        tShirtSize: inputValues.tShirtSize,
        website: inputValues.website,
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
          <StepperBar current={1} total={5} />
          <div className="p-4 mt-4">
            {/* <FormField
              type="email"
              name="email"
              label="Your Email*"
              placeholder="Email"
              onChange={handleOnChange}
              value={inputValues.email}
              className="mt-4"
              disabled={true}
            /> */}
            <FormField
              type="text"
              name="website"
              label="Your Website"
              placeholder="Website"
              onChange={handleOnChange}
              value={inputValues.website}
              className="mt-8"
              preField="https://"
            />
            <Select
              name="tShirtSize"
              label="T-shirt size"
              onChange={handleOnChange}
              value={inputValues.tShirtSize}
              className="mt-8"
              options={[
                {
                  id: "S",
                  value: "S",
                },
                {
                  id: "M",
                  value: "M",
                },
                {
                  id: "L",
                  value: "L",
                },
                {
                  id: "XL",
                  value: "XL",
                },
                {
                  id: "XXL",
                  value: "XXL",
                },
              ]}
            />
            <GoogleAutocomplete
              label="Business Address*"
              onSelect={(place) => {
                setInputValues((prevValues) => ({
                  ...prevValues,
                  businessAdderess: JSON.stringify(place),
                }));
              }}
              className="!w-full"
            />
            {inputValues.businessAdderess &&
              typeof inputValues.businessAdderess === "string" && (
                <div className="flex items-center mt-2 ml-1">
                  <p className="text-primary-gray text-md font-medium  mr-2 ">
                    {
                      JSON.parse(inputValues.businessAdderess)
                        ?.formatted_address
                    }
                  </p>
                  <Image
                    src={GreenCheckmark}
                    alt="checkmark"
                    height={20}
                    width={20}
                  />
                </div>
              )}
            <Button
              disabled={false}
              onClick={updateData}
              className="mt-10 !text-white"
            >
              Next
            </Button>
          </div>
        </>
      </Card>
    </div>
  );
}
