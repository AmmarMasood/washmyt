"use client";

import Button from "../../../components/Button";
import { ChangeEvent, useState } from "react";
import Card from "../../../components/Card";
import StepperBar from "@/app/components/StepperBar";
import Select from "@/app/components/Select";
import UploadImage from "@/app/components/UploadImage";
import { storage } from "@/app/lib/firebase";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { UserAuth } from "@/app/context/AuthContext";
import axiosApiInstance from "@/app/utils/axiosClient";
import { useRouter } from "next/navigation";
import { message } from "antd";

export default function FifthPart() {
  const { profile, user, setLoading, getUser } = UserAuth() as any;
  const router = useRouter();

  const [inputValues, setInputValues] = useState({
    businessInsurance: profile.ownInsurance === false ? "no" : "yes",
  });
  const [file, setFile] = useState(null);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const updateData = async (file: File) => {
    if (!file) return;

    try {
      const fileRef = ref(storage, `${profile.userId}/insurance/${file.name}`);
      const uploadTask = await uploadBytes(fileRef, file);
      const link = await getDownloadURL(uploadTask.ref);
      return link;
    } catch (error) {
      console.log(error);
      message.error("Unable to upload file. Please try again.");
    }
  };

  const onUpload = (file: any) => {
    setFile(file[0]);
  };

  const verifyFields = () => {
    if (inputValues.businessInsurance === "yes" && !file) {
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

    const link =
      typeof file === "string" ? file : await updateData(file as any);
    try {
      await axiosApiInstance.post("/api/onboard/complete-profile", {
        ownInsurance: inputValues.businessInsurance === "yes" ? true : false,
        insuranceImage: inputValues.businessInsurance === "yes" ? link : "",
        onboardingCompleted: true,
      });
      await getUser(true);

      router.push("/user/profile");
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
          <StepperBar current={4} total={5} />
          <div className="p-4 mt-4">
            <Select
              name="businessInsurance"
              label="Does your business have General Liability insurance?"
              placeholder="yes"
              onChange={handleOnChange}
              value={inputValues.businessInsurance}
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
              file={file}
              label="Please take a photo of your insurance"
              onUpload={onUpload}
              className="mt-8"
            />

            <Button disabled={false} onClick={onClickNext} className="mt-10">
              Complete Registration
            </Button>
          </div>
        </>
      </Card>
    </div>
  );
}
