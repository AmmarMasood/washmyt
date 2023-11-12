"use client";

import { message } from "antd";
import Image from "next/image";
import Button from "../../../components/Button";
import { ChangeEvent, useEffect, useState } from "react";
import Card from "../../../components/Card";
import Logo from "../../../../../public/imgs/logo.svg";
import BgImage from "../../../../../public/imgs/bg-img.svg";
import Checkbox from "@/app/components/Checkbox";
import SmallClock from "../../../../../public/imgs/small-clock.svg";
import { UserAuth } from "@/app/context/AuthContext";
import Modal from "@/app/components/Modal";
import Link from "next/link";

export interface IOnboardingPageProps {
  onNext: () => void;
}
export default function StartOnboarding(props: IOnboardingPageProps) {
  const { onNext } = props;
  const [messageApi, contextHolder] = message.useMessage();
  const { user, sendVerificationEmail, profile } = UserAuth() as any;
  const [inputValues, setInputValues] = useState({
    accepted: false,
  });

  const [isUserVerified, setIsUserVerified] = useState(true);

  useEffect(() => {
    if (user) {
      if (user?.emailVerified) {
        setIsUserVerified(true);
      } else {
        setIsUserVerified(false);
      }
    }
  }, [user]);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.checked,
    }));
  };

  const reSendVerificationEmail = async () => {
    try {
      await sendVerificationEmail();
      messageApi.open({
        type: "success",
        content: "Email sent!",
      });
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Unable to send email please try again.",
      });
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Verify your email"
        show={!isUserVerified}
        onClose={() => setIsUserVerified(false)}
        onConfirm={() => setIsUserVerified(false)}
        showCloseButton={false}
      >
        <h1 className="text-md">
          An email for verification has been sent to your inbox. Please take a
          moment to verify your email address.
        </h1>
        <div className="mt-5 flex items-center justify-between">
          <Button
            onClick={reSendVerificationEmail}
            className="text-white text-sm mr-5"
            disabled={false}
          >
            Resend Email
          </Button>
          <Button
            onClick={() => {
              if (!user.emailVerified) {
                location.reload();
              }
            }}
            className="text-white text-sm ml-5"
            disabled={false}
          >
            Done
          </Button>
        </div>
      </Modal>
      <>
        <Card className="p-10 relative overflow-hidden !bg-[#f0f0f0]">
          <div>
            <Image
              src={Logo}
              alt="wash-my-t-pro"
              className="mx-auto mb-10 relative z-10"
            />
            <Image
              src={BgImage}
              alt="bg"
              className="absolute -top-10 left-0 z-5 "
            />
            <h1 className="heading-1 text-center mb-5 text-[#1E1E1E] text-3xl	font-semibold	relative z-10 mt-72 max-md:mt-10">
              Welcome to WashmyT
            </h1>

            <p className="text-[#1E1E1E] text-xl text-center relative z-10 mt-10">
              We are genuinely excited to add more washes to your schedule. To
              begin receiving wash requests from us, please fill out our
              application form.
            </p>
            <p className="text-[#1E1E1E] text-xl text-center opacity-50  mt-5">
              By joining, we do not prohibit you from taking other washes, we
              only aim to add washes to your existing business. We look forward
              to working together!
            </p>
          </div>
          <div className="flex flex-col items-center justify-center  mt-5">
            <Link
              href={"https://www.washmyt.com/terms-conditions/"}
              target="_blank"
              className="text-primary-color text-sm mb-1 mt-4 cursor-pointer text-center underline z-10"
            >
              Read terms and conditions.
            </Link>
            <Checkbox
              checked={inputValues.accepted}
              onChange={handleOnChange}
              name="accepted"
              label="Accept Terms and Conditions to Start"
            />

            <Button
              onClick={profile === null ? () => console.log("") : onNext}
              className=" mt-5 w-[250px] z-10"
              disabled={profile === null || inputValues.accepted === false}
            >
              Start
            </Button>
            <p className="text-sm mt-6 flex items-center">
              <Image src={SmallClock} alt="small-clock" />
              <span className="text-primary-gray ml-1">Takes 1 minute</span>
            </p>
          </div>
        </Card>
      </>
    </>
  );
}
