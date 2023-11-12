"use client";

import Button from "../../../components/Button";
import { ChangeEvent, useState } from "react";
import Card from "../../../components/Card";
import StepperBar from "@/app/components/StepperBar";
import Select from "@/app/components/Select";
import MultiSelect, { ISelectedValue } from "@/app/components/MultiSelect";
import UploadImage from "@/app/components/UploadImage";
import { IOnboardingPageProps } from "./StartOnboarding";
import { storage } from "@/app/lib/firebase";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { UserAuth } from "@/app/context/AuthContext";
import axiosApiInstance from "@/app/utils/axiosClient";
import { message } from "antd";

const servicesArr = [
  {
    id: "",
    value: "",
  },
  {
    id: "all",
    value: "All",
  },
  {
    id: "exterior_window_cleaning",
    value: "Exterior Window Cleaning",
  },
  {
    id: "exterior_hand_wash_dry",
    value: "Exterior Hand Wash & Dry",
  },
  {
    id: "clean_dress_tires",
    value: "Clean & Dress Tires",
  },
  {
    id: "clean_wheel_wells",
    value: "Clean Wheel Wells",
  },
  {
    id: "foam_cannon",
    value: "Foam Cannon",
  },
  {
    id: "interior_vacuum",
    value: "Interior Vacuum",
  },
  {
    id: "interior_wipe_down",
    value: "Interior Wipe Down",
  },
  {
    id: "bug_removal",
    value: "Bug Removal",
  },
  {
    id: "full_clay_bar_process",
    value: "Full Clay Bar Process",
  },
  {
    id: "shampoo_floor_mats",
    value: "Shampoo Floor Mats",
  },
  {
    id: "carnauba_wax",
    value: "Carnauba Wax",
  },
  {
    id: "synthetic_sealant",
    value: "Synthetic Sealant",
  },
  {
    id: "ceramic_coating",
    value: "Ceramic Coating",
  },
];
export default function FourthPart(props: IOnboardingPageProps) {
  const { onNext } = props;
  const { profile, user, setLoading } = UserAuth() as any;
  const [inputValues, setInputValues] = useState({
    selectedServices:
      (profile.services &&
        servicesArr.filter((s) => profile.services.includes(s.id))) ||
      [],
    service: "",
    businessLicense: profile.ownBusinessLicense === false ? "no" : "yes",
  });
  const [file, setFile] = useState(profile.businessLicenseImage || null);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleMultiChange = (value: ISelectedValue) => {
    if (value.id === "") return;
    setInputValues((prev: any) => ({
      ...prev,
      service: value.id,
      selectedServices: [...prev.selectedServices, value],
    }));
  };

  const handleRemoveValue = (id: string) => {
    setInputValues((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.filter(
        (v: any) => (v as ISelectedValue).id !== id
      ),
    }));
  };

  const onUpload = (file: any) => {
    setFile(file[0]);
  };

  const updateData = async (file: File) => {
    if (!file) return;
    try {
      const fileRef = ref(
        storage,
        `${profile.userId}/businessLicense/${file.name}`
      );
      const uploadTask = await uploadBytes(fileRef, file);
      const link = await getDownloadURL(uploadTask.ref);
      return link;
    } catch (error) {
      console.log(error);
      message.error("Unable to upload file. Please try again.");
    }
  };

  const verifyFields = () => {
    if (
      !inputValues.selectedServices.length ||
      (inputValues.businessLicense === "yes" && !file)
    ) {
      return false;
    }
    return true;
  };

  const onClickNext = async () => {
    if (!verifyFields()) {
      message.error("Please fill all the required fields.");
      return;
    }
    setLoading(true);

    const link = typeof file === "string" ? file : await updateData(file);
    try {
      await axiosApiInstance.post("/api/onboard/complete-profile", {
        ownBusinessLicense:
          inputValues.businessLicense === "yes" ? true : false,
        businessLicenseImage: inputValues.businessLicense === "yes" ? link : "",
        services: inputValues.selectedServices.map((v: any) => (v as any).id),
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
          <StepperBar current={3} total={5} />
          <div className="p-4 mt-4">
            <MultiSelect
              name="services"
              label="Which services can you perform?*"
              placeholder="Yes"
              onChange={handleMultiChange}
              value={inputValues.service}
              selectedValues={inputValues.selectedServices}
              removeValue={handleRemoveValue}
              className="mt-8"
              options={servicesArr}
            />
            <Select
              name="businessLicense"
              label="Do you have a business license?"
              placeholder="yes"
              onChange={handleOnChange}
              value={inputValues.businessLicense}
              className="mt-8"
              options={[
                {
                  id: "yes",
                  value: "yes",
                },
                {
                  id: "no",
                  value: "no",
                },
              ]}
            />

            <UploadImage
              label="Please take a photo of your business license"
              onUpload={onUpload}
              file={file}
              className="mt-8"
            />

            <Button disabled={false} onClick={onClickNext} className="mt-10">
              Next
            </Button>
          </div>
        </>
      </Card>
    </div>
  );
}
