"use client";

import Image from "next/image";
import Button from "../../../components/Button";
import { ChangeEvent, useState } from "react";
import Card from "../../../components/Card";
import StepperBar from "@/app/components/StepperBar";
import FormField from "@/app/components/FormField";
import { IOnboardingPageProps } from "./StartOnboarding";
import axiosApiInstance from "@/app/utils/axiosClient";
import { UserAuth } from "@/app/context/AuthContext";
import { message } from "antd";

export default function FirstPart(props: IOnboardingPageProps) {
  const { onNext } = props;
  const { profile, setLoading } = UserAuth() as any;
  const [inputValues, setInputValues] = useState({
    businessName: profile?.businessName || "",
    name: profile?.name || "",
    mobileNumber: profile?.phoneNumber || "",
    email: profile?.email || "",
  });

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const verifyFields = () => {
    if (
      !inputValues.businessName ||
      !inputValues.name ||
      !inputValues.mobileNumber
    ) {
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
        businessName: inputValues.businessName,
        name: inputValues.name,
        phoneNumber: inputValues.mobileNumber,
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
      <Card className="p-12 w-[800px] max-md:w-full max-md:p-6 ">
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
              preField="+1"
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
              disabled={true}
            />
            <Button onClick={updateData} className="mt-10" disabled={false}>
              Next
            </Button>
          </div>
        </>
      </Card>
    </div>
  );
}
