"use client";

import Image from "next/image";
import Button from "../../components/Button";
import { ChangeEvent, useState } from "react";
import Card from "../../components/Card";
import LogoIcon from "../../../../public/imgs/logo-icon.svg";
import StepperBar from "@/app/components/StepperBar";

import Tick from "../../../../public/imgs/tick.svg";
import { IOnboardingPageProps } from "./PartOne";
import { message } from "antd";
//
const options = [
  {
    id: "black",
    name: "Black",
  },
  {
    id: "white",
    name: "White",
  },
  {
    id: "red",
    name: "Red",
  },
  {
    id: "blue",
    name: "Blue",
  },
  {
    id: "gray",
    name: "Gray",
  },
  {
    id: "other",
    name: "Other",
  },
];

export default function PartTwo(props: IOnboardingPageProps) {
  const { onNext } = props;
  const [color, setColor] = useState("black");

  const verifyFields = () => {
    if (!color) {
      message.error("Please select a color.");
      return false;
    }
    return true;
  };

  const onNextClick = () => {
    if (verifyFields()) {
      onNext({
        color,
      });
    }
  };

  return (
    <div className="max-md:w-full max-md:mt-10 ">
      <StepperBar current={1} total={10} />
      <Card className="p-12 w-[1300px] mt-12 max-md:w-full">
        <>
          <div className="flex items-end justify-end">
            <Image src={LogoIcon} alt="washmyt" />
          </div>
          <div className="p-4 mt-4 flex flex-col items-center justfiy-center max-md:p-0 ">
            <h1 className="text-black text-2xl text-center mb-16 font-semibold">
              Select the color of your Model X
            </h1>
            <div>
              {options.map((option, index) => (
                <div
                  onClick={() => setColor(option.id)}
                  key={index}
                  className={`min-w-[500px] max-md:min-w-[250px] cursor-pointer p-4 border-transparent rounded-xl border-2 bg-secondary-color mb-8 ${
                    option.id === color &&
                    "!border-black rounded-xl border-2 bg-black/[0.1]"
                  }`}
                >
                  <p className="text-primary-gray text-xl	font-bold	 text-center">
                    {option.name}
                  </p>
                </div>
              ))}
            </div>

            <Button
              disabled={false}
              onClick={onNextClick}
              className="mt-16 !w-[150px] mb-14"
            >
              <span className="flex items-center justify-center">
                <label className="mr-4 !text-white">OK</label>
                <Image src={Tick} alt="tick" />
              </span>
            </Button>
          </div>
        </>
      </Card>
    </div>
  );
}
