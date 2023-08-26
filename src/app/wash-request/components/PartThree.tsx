"use client";

import Image from "next/image";
import Button from "../../components/Button";
import { ChangeEvent, useState } from "react";
import Card from "../../components/Card";
import LogoIcon from "../../../../public/imgs/logo-icon.svg";
import StepperBar from "@/app/components/StepperBar";
import { IOnboardingPageProps } from "@/app/onboard-user/getting-started/components/StartOnboarding";
import Tick from "../../../../public/imgs/tick.svg";
import { Input } from "antd";

const options = [
  {
    id: 1,
    name: "Premier Detail+ (Models: S, X)",
    description:
      "Premier Detail+ (Our full detail, Exterior handwash, full clay bar process, interior detail)",
    price: 329,
  },
  {
    id: 2,
    name: "Premier Detail+ (Models: 3,Y)",
    description:
      "Premier Detail+ (Our full detail, Exterior handwash, full clay bar process, interior detail)",
    price: 299,
  },
  {
    id: 3,
    name: "Total Package+ (Models: S, X)",
    description:
      "Total Package+ (Covers Exterior Hand Wash, Tires Included, and Interior Vacuum/Wipedown)",
    price: 199,
  },
  {
    id: 4,
    name: "Total Package+ (Models: 3,Y)",
    description:
      "Total Package+ (Covers Exterior Hand Wash, Tires Included, and Interior Vacuum/Wipedown)",
    price: 189,
  },
  {
    id: 5,
    name: "Handwash+ (Models: S, X)",
    description:
      "Handwash+ (Covers Exterior Only, Tires are Included, No Interior)",
    price: 139,
  },
  {
    id: 6,
    name: "Handwash+ (Models: 3,Y)",
    description:
      "Handwash+ (Covers Exterior Only, Tires are Included, No Interior)",
    price: 129,
  },
];

export default function PartThree(props: IOnboardingPageProps) {
  const { onNext } = props;
  const [packageType, setPackageType] = useState(1);
  const [addSnow, setAddSnow] = useState(false);
  const [allOptions, setAllOptions] = useState(options);

  return (
    <div className="max-md:w-full max-md:mt-10 ">
      <StepperBar current={2} total={10} />
      <Card className="p-12 w-[1300px] mt-12 max-md:w-full">
        <>
          <Image src={LogoIcon} alt="washmyt" className="float-right" />
          <div className="p-4 mt-4 flex flex-col items-center justfiy-center">
            <h1 className="text-black text-2xl text-center mb-2">
              Choose a wash package.
            </h1>
            <h3 className=" mb-16 text-primary-gray text-xl text-center">
              You will be asked for payment once you confirm the payment
            </h3>
            <Input
              placeholder="Search for option"
              onChange={(e) => {
                const value = e.target.value;
                const filteredOptions = options.filter((option) =>
                  option.name.toLowerCase().includes(value.toLowerCase())
                );
                setAllOptions(filteredOptions);
              }}
              className="p-4 mb-6 w-[500px] max-md:w-[200px]  rounded-xl border-1 border-black"
            />
            <div>
              {allOptions.map((option, index) => (
                <div
                  onClick={() => setPackageType(option.id)}
                  key={index}
                  className={`min-w-[500px] max-md:min-w-[200px] cursor-pointer p-4 border-transparent rounded-xl border-2 bg-secondary-color mb-4 ${
                    option.id === packageType &&
                    "!border-black rounded-xl border-2 bg-black/[0.1]"
                  }`}
                >
                  <p className="text-primary-gray text-lg	font-bold	 text-center">
                    {option.name}
                  </p>
                </div>
              ))}
            </div>
            <Button onClick={onNext} className="mt-16 !w-[150px] mb-14">
              <span className="flex items-center justify-center">
                <label className="mr-4">OK</label>
                <Image src={Tick} alt="tick" />
              </span>
            </Button>
          </div>
        </>
      </Card>
    </div>
  );
}
