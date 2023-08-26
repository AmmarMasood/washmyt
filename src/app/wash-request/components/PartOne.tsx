"use client";

import Image from "next/image";
import Button from "../../components/Button";
import { ChangeEvent, useState } from "react";
import Card from "../../components/Card";
import LogoIcon from "../../../../public/imgs/logo-icon.svg";
import StepperBar from "@/app/components/StepperBar";
import { IOnboardingPageProps } from "@/app/onboard-user/getting-started/components/StartOnboarding";
import Tick from "../../../../public/imgs/tick.svg";
//
import ModelS from "../../../../public/imgs/big-model-s.svg";
import Model3 from "../../../../public/imgs/big-model-3.svg";
import ModelX from "../../../../public/imgs/big-model-x.svg";

export default function PartOne(props: IOnboardingPageProps) {
  const { onNext } = props;
  const [selectedModel, setSelectedModel] = useState("modelS");
  const [models, setModels] = useState([
    {
      id: "modelS",
      name: "Model S",
      img: ModelS,
    },
    {
      id: "model3",
      name: "Model 3",
      img: Model3,
    },
    {
      id: "modelX",
      name: "Model X",
      img: ModelX,
    },
    {
      id: "modelS2",
      name: "Model S",
      img: ModelS,
    },
  ]);

  return (
    <div className="max-md:w-full max-md:mt-10 ">
      <StepperBar current={0} total={10} />
      <Card className="p-12 w-[1300px] mt-12 max-md:w-full">
        <>
          <Image src={LogoIcon} alt="washmyt" className="float-right" />
          <div className="p-4 mt-32 flex flex-col items-center justfiy-center">
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
            <Button onClick={onNext} className="mt-20 !w-[150px] mb-14">
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
