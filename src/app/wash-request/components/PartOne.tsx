"use client";

import Image from "next/image";
import Button from "../../components/Button";
import { useState } from "react";
import Card from "../../components/Card";
import LogoIcon from "../../../../public/imgs/logo-icon.svg";
import StepperBar from "@/app/components/StepperBar";
import Tick from "../../../../public/imgs/tick.svg";
import { message } from "antd";
import { modelsData } from "@/app/utils/static-data";
export interface IOnboardingPageProps {
  onNext: (values: any, force?: any) => void;
  final?: boolean;
}
export default function PartOne(props: IOnboardingPageProps) {
  const { onNext } = props;
  const [selectedModel, setSelectedModel] = useState("modelS");
  const [models, setModels] = useState(modelsData);

  const verifyFields = () => {
    if (!selectedModel) {
      message.error("Please select a model.");
      return false;
    }
    return true;
  };

  const onNextClick = () => {
    if (!verifyFields()) {
      return;
    }
    onNext({
      selectedModel,
    });
  };

  return (
    <div className="max-md:w-full max-md:mt-10 ">
      <StepperBar current={0} total={10} />
      <Card className="p-12 w-[1300px] mt-12 max-md:w-full">
        <>
          <div className="flex items-end justify-end">
            <Image src={LogoIcon} alt="washmyt" />
          </div>
          <div className="p-4 mt-4 flex flex-col items-center justfiy-center max-md:p-0 ">
            <h1 className="text-black font-semibold text-center text-2xl mb-28 max-md:mb-8">
              Select Your Tesla
            </h1>
            <div className="flex items-center max-md:flex-wrap">
              {models.map((model, index) => (
                <div
                  onClick={() => setSelectedModel(model.id)}
                  key={index}
                  className={`cursor-pointer p-4  border-transparent rounded-xl border-2 ${
                    model.id === selectedModel &&
                    "!border-black rounded-xl border-2 bg-black/[0.1]"
                  }`}
                >
                  <Image src={model.img} alt={model.name} />
                  <p className="text-primary-gray text-xl	font-bold	 text-center mt-2">
                    {model.name}
                  </p>
                </div>
              ))}
            </div>
            <Button
              disabled={false}
              onClick={onNextClick}
              className="mt-20 !w-[150px] mb-14"
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
