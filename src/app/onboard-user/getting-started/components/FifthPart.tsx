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
import Link from "next/link";

export default function FifthPart() {
  const [inputValues, setInputValues] = useState({
    businessInsurance: "yes",
  });

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onUpload = (file: any) => {};

  return (
    <div className="max-md:w-full">
      <Card className="p-12 w-[800px] max-md:w-full max-md:p-6">
        <>
          <StepperBar current={4} total={5} />
          <div className="p-4 mt-4">
            <Select
              name="businessInsurance"
              label="Does your business have General Liability insurance?"
              placeholder="Yes"
              onChange={handleOnChange}
              value={inputValues.businessInsurance}
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
              label="Please take a photo of your insurance"
              onUpload={onUpload}
              className="mt-8"
            />
            <Link href={"/user/dashboard"}>
              <Button onClick={() => console.log("next")} className="mt-10">
                Complete Registration
              </Button>
            </Link>
          </div>
        </>
      </Card>
    </div>
  );
}
