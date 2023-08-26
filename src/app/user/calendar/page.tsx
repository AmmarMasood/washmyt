"use client";

import React from "react";
import Layout from "../components/Layout";
import { PROFILE } from "@/app/store";
import Card from "@/app/components/Card";
import CustomCalender from "@/app/user/calendar/components/CustomCalendar";
//
import LogoIcon from "../../../../public/imgs/logo-icon.svg";
import Image from "next/image";
import WashCard from "./components/WashCard";
import Tesla from "../../../../public/imgs/wash-card-tesla.svg";

function Page() {
  return (
    <div className="min-h-screen  bg-secondary-color p-6 relative">
      <Layout currentOption={3} profile={PROFILE}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "395px 1fr",
            gridGap: "20px",
          }}
        >
          <div>
            <h1 className="font-semibold text-2xl text-black">Upcoming</h1>
            <div className="mt-6">
              <h3 className="text-primary-gray text-base font-semibold mb-5">
                Today
              </h3>
              <WashCard
                img={Tesla}
                title="Ted Baker x Wash Pro Name"
                date="Nov 01, 2023"
                washType="Handwash +"
                schedule="10.00 AM - 11.00 AM"
                scheduleColor="#8BF4E1"
                className="mb-4"
              />
              <WashCard
                img={Tesla}
                title="Draft Submission"
                date="Nov 01, 2023"
                schedule="10.00 AM - 11.00 AM"
                scheduleColor=""
                className="mb-4"
              />
            </div>
          </div>
          <Card className="h-full p-4 bg-white">
            <div className="flex items-center justify-end mt-2 mb-2">
              <Image src={LogoIcon} alt="washmyt" />
            </div>
            <CustomCalender />
          </Card>
        </div>
      </Layout>
    </div>
  );
}

export default Page;
