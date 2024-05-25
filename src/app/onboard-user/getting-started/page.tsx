"use client";

import { useState } from "react";
import StartOnboarding from "./components/StartOnboarding";
import FirstPart from "./components/FirstPart";
import SecondPart from "./components/SecondPart";
import ThirdPart from "./components/ThirdPart";
import FourthPart from "./components/FourthPart";
import FifthPart from "./components/FifthPart";
import Image from "next/image";
import LogoIcon from "../../../../public/imgs/logo-icon.svg";
import { withAuth } from "@/app/hoc/withAuth";
import { Avatar, message } from "antd";
import { UserAuth } from "@/app/context/AuthContext";
import Loading from "@/app/components/Loading";
import { UserOutlined } from "@ant-design/icons";
import posthog from "posthog-js";
import { onboardingEvents } from "@/app/providers/posthog_events";

function OnboardUser() {
  const [content, setContent] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();
  const { loading, profile } = UserAuth() as any;

  function getGreeting() {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    if (currentHour >= 5 && currentHour < 12) {
      return "Good morning!";
    } else if (currentHour >= 12 && currentHour < 18) {
      return "Good afternoon!";
    } else {
      return "Good evening!";
    }
  }

  const onNext = () => {
    if (content < 5) {
      setContent((prev) => prev + 1);
    } else {
    }
  };

  const onPrev = () => {
    if (content > 0) {
      setContent((prev) => prev - 1);
    } else {
    }
  };
  return (
    <>
      <Loading show={loading} />
      <main className="flex min-h-screen flex-col items-center justify-center bg-secondary-color px-24 py-12 relative max-md:p-2">
        {content !== 0 && (
          <div className="mb-4 flex items-center justify-between w-full">
            <Image src={LogoIcon} alt="washmyt" />
            {
              <div className="flex items-center">
                <Avatar
                  src={profile?.profileImage}
                  icon={<UserOutlined />}
                  className="mr-2"
                  size="large"
                />
                <div className="flex flex-col">
                  <span className="text-black">{getGreeting()} 👋</span>
                  <span className="text-black font-bold">{profile?.email}</span>
                </div>
              </div>
            }
          </div>
        )}
        {content === 0 && (
          <StartOnboarding
            onNext={() => {
              posthog.capture(onboardingEvents.ONBOARDING_STARTED, {
                email: profile?.email,
              });
              onNext();
            }}
          />
        )}
        {content === 1 && <FirstPart onNext={onNext} />}
        {content === 2 && <SecondPart onNext={onNext} />}
        {content === 3 && <ThirdPart onNext={onNext} />}
        {content === 4 && <FourthPart onNext={onNext} />}
        {content === 5 && <FifthPart />}
        {contextHolder}
      </main>
    </>
  );
}

export default withAuth(OnboardUser);
