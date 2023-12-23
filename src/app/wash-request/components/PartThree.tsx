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
import { useSearchParams } from "next/navigation";
import { modelsData } from "@/app/utils/static-data";
import Checkbox from "@/app/components/Checkbox";

export default function PartThree(props: IOnboardingPageProps) {
  const { onNext, onBack, values } = props;
  const params = useSearchParams();
  const [open, setOpen] = useState(true);
  const [packageType, setPackageType] = useState(null);
  const [packageInfo, setPackageInfo] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [snow, setSnow] = useState(false);

  const verifyFields = () => {
    if (!packageType) {
      message.error("Please select package type.");
      return false;
    }
    return true;
  };

  const getModels = (packages: any) => {
    const matches = packages.map((carDetail: any) => {
      const match = carDetail.name.match(/\((Models: [^)]+)\)/);
      return match ? { ...carDetail, model: match[1] } : null;
    });
    return matches
      .map((m: any) => ({ ...m, model: m.model?.replace("Models: ", "") }))
      .map((model: any) => {
        const match = model.model.match(/(\w+)/g); // Extract individual words
        return match ? { ...model, model: `model${match.join("")}` } : null;
      });
  };

  const getPackages = async () => {
    const model = params.get("model");
    if (model && modelsData.filter((f) => f.id === model).length > 0) {
      setLoading(true);
      try {
        const response = await axiosApiInstance.get(
          "/api/wash-request/packages"
        );
        const mods = getModels(response.data.options);
        const filMods = mods.filter((f: any) =>
          f.model.includes(model.replace("model", ""))
        );
        setOptions(filMods);
      } catch (error) {
        console.log(error);
        message.error("Unable to get packages");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    getPackages();
    setPackageType(values?.packageId);
    setSnow(values?.snowPackage);
  }, []);

  const onNextClick = () => {
    if (verifyFields()) {
      onNext({
        packageId: packageType,
        snowPackage: snow,
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
                value={packageType}
                open={open}
                onChange={(value) => {
                  setPackageType(value);
                  setPackageInfo(
                    options.find((option: any) => option.id === value)
                  );
                  // setOpen(false);
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
                      {`${option.description} for $${option.price}`}
                    </p>
                  ),
                }))}
              ></Select>
              <div className="!mt-96">
                <Checkbox
                  name="snow"
                  checked={snow}
                  label="Add Snow Package ($79)"
                  onChange={(e) => setSnow(e.target.checked)}
                  className="-ml-6"
                />
                <div className="flex items-center pt-12 mb-14">
                  <p
                    onClick={onBack}
                    className="text-primary-color text-xs mr-6 cursor-pointer"
                  >
                    &#8592; Go Back
                  </p>
                  <Button
                    disabled={false}
                    onClick={onNextClick}
                    className=" !w-[150px]"
                  >
                    <span className="flex items-center justify-center">
                      <label className="mr-4 !text-white">OK</label>
                      <Image src={Tick} alt="tick" />
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </>
        </Card>
      </div>
    </>
  );
}
