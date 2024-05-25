"use client";

import Image from "next/image";
import Button from "../../components/Button";
import { useState } from "react";
import Card from "../../components/Card";
import LogoIcon from "../../../../public/imgs/logo-icon.svg";
import StepperBar from "@/app/components/StepperBar";
import Tick from "../../../../public/imgs/tick.svg";
import { IOnboardingPageProps } from "./PartOne";
import posthog from "posthog-js";
import { washRequestEvents } from "@/app/providers/posthog_events";
//
const options = [
  {
    id: "yes",
    name: "Yes",
  },
  {
    id: "no",
    name: "No",
  },
];

export default function PartSeven(props: IOnboardingPageProps) {
  const { onNext, onBack, values } = props;
  const [outlet, setOutlet] = useState(
    values.electricalHookupAvailable === true ? "yes" : "no"
  );

  const verifyFields = () => {
    if (!outlet) {
      return false;
    }
    return true;
  };

  const onNextClick = () => {
    if (verifyFields()) {
      posthog.capture(
        washRequestEvents.WASH_REQUEST_ELECTRICAL_OUTLET_AVAILABILITY_SELECTED,
        {
          electricalHookupAvailable: outlet === "yes" ? true : false,
        }
      );
      onNext({
        electricalHookupAvailable: outlet === "yes" ? true : false,
      });
    }
  };

  return (
    <div className="max-md:w-full max-md:mt-10 ">
      <StepperBar current={6} total={10} />
      <Card className="p-12 w-[1300px] mt-12 max-md:w-full">
        <>
          <div className="flex items-end justify-end">
            <Image src={LogoIcon} alt="washmyt" />
          </div>
          <div className="p-4 mt-4 flex flex-col items-center justfiy-center max-md:p-0">
            <h1 className="text-black text-2xl text-center mb-16">
              Is there an electrical outlet available?
            </h1>
            <div>
              {options.map((option, index) => (
                <div
                  onClick={() => setOutlet(option.id)}
                  key={index}
                  className={`min-w-[500px]  max-md:min-w-[250px] cursor-pointer p-4 border-transparent rounded-xl border-2 bg-secondary-color mb-6 ${
                    option.id === outlet &&
                    "!border-black rounded-xl border-2 bg-black/[0.1]"
                  }`}
                >
                  <p className="text-primary-gray text-xl	font-bold	 text-center">
                    {option.name}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex items-center pt-12 mb-14">
              <p
                onClick={onBack}
                className="text-primary-color text-xs mr-6 mt-3 cursor-pointer"
              >
                &#8592; Go Back
              </p>
              <Button
                onClick={onNextClick}
                disabled={false}
                className="mt-16 !w-[150px] mb-14 !text-white"
              >
                <span className="flex items-center justify-center">
                  <label className="mr-4 !text-white">OK</label>
                  <Image src={Tick} alt="tick" />
                </span>
              </Button>
            </div>
          </div>
        </>
      </Card>
    </div>
  );
}
