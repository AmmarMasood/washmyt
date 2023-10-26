"use client";

import Image from "next/image";
import Button from "../../components/Button";
import { useEffect, useState } from "react";
import Card from "../../components/Card";
import LogoIcon from "../../../../public/imgs/logo-icon.svg";
import StepperBar from "@/app/components/StepperBar";
import Tick from "../../../../public/imgs/tick.svg";
import { Select, message } from "antd";
import axiosApiInstance from "@/app/utils/axiosClient";
import Loading from "@/app/components/Loading";
import { IOnboardingPageProps } from "./PartOne";

export default function PartThree(props: IOnboardingPageProps) {
  const { onNext } = props;
  const [packageType, setPackageType] = useState(null);
  const [packageInfo, setPackageInfo] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);

  const verifyFields = () => {
    if (!packageType) {
      message.error("Please select package type.");
      return false;
    }
    return true;
  };

  const getPackages = async () => {
    setLoading(true);
    try {
      const response = await axiosApiInstance.get("/api/wash-request/packages");
      setOptions(response.data.options);
    } catch (error) {
      console.log(error);
      message.error("Unable to get packages");
    }
    setLoading(false);
  };

  useEffect(() => {
    getPackages();
  }, []);

  const onNextClick = () => {
    if (verifyFields()) {
      onNext({
        packageId: packageType,
      });
    }
  };

  return (
    <>
      <Loading show={loading} />
      <div className="max-md:w-full max-md:mt-10 ">
        <StepperBar current={2} total={10} />
        <Card className="p-12 w-[1300px] mt-12 max-md:w-full ">
          <>
            <div className="flex items-end justify-end">
              <Image src={LogoIcon} alt="washmyt" />
            </div>
            <div className="p-4 mt-4 flex flex-col items-center justfiy-center max-md:p-0 ">
              <h1 className="text-black text-2xl text-center mb-2 font-semibold ">
                Choose a wash package.
              </h1>
              <h3 className=" mb-16 text-primary-gray text-xl text-center">
                You will be asked for payment once you confirm the payment
              </h3>
              <Select
                showSearch
                size="large"
                defaultOpen
                className="w-[600px] max-md:w-full  rounded-xl border-1 border-black !max-md:w-full"
                placeholder="Search for option"
                listHeight={350}
                placement="bottomRight"
                open={true}
                onChange={(value) => {
                  setPackageType(value);
                  setPackageInfo(
                    options.find((option: any) => option.id === value)
                  );
                }}
                dropdownStyle={{
                  padding: "10px",
                }}
                listItemHeight={2000}
                filterOption={(input, option) =>
                  (option?.value?.toString() ?? "").includes(input)
                }
                filterSort={(optionA, optionB) =>
                  (optionA?.value?.toString() ?? "")
                    .toLowerCase()
                    .localeCompare(
                      (optionB?.value?.toString() ?? "").toLowerCase()
                    )
                }
                options={options.map((option: any) => ({
                  value: option.id,
                  label: (
                    <p className="!whitespace-normal text-lg mb-4">
                      {`${option.name} (${option.description}) ($ ${option.price})`}
                    </p>
                  ),
                }))}
              ></Select>
              <Button
                disabled={false}
                onClick={onNextClick}
                className="mt-16 !w-[150px] mb-14 !mt-96"
              >
                <span className="flex items-center justify-center">
                  <label className="mr-4">OK</label>
                  <Image src={Tick} alt="tick" />
                </span>
              </Button>
            </div>
          </>
        </Card>
      </div>
    </>
  );
}
