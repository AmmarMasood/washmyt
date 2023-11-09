"use client";

import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { PROFILE } from "@/app/store";
import Card from "@/app/components/Card";
import CustomCalender from "@/app/user/calendar/components/CustomCalendar";
//
import LogoIcon from "../../../../public/imgs/logo-icon.svg";
import Image from "next/image";
import WashCard from "./components/WashCard";
import Tesla from "../../../../public/imgs/wash-card-tesla.svg";
import { withAuth } from "@/app/hoc/withAuth";
import { useRouter } from "next/navigation";
import axiosApiInstance from "@/app/utils/axiosClient";
import {
  normalizeWashRequestForCalendar,
  normalizeWashRequestForDashboard,
} from "@/app/normalizers/UserNormalizers";
import { message } from "antd";
import Loading from "@/app/components/Loading";
import { modelsData } from "@/app/utils/static-data";

function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>([]);
  const getData = async () => {
    setLoading(true);
    try {
      const res = await axiosApiInstance.get("/api/user/wash-request");
      const d = normalizeWashRequestForCalendar(res.data);
      setData(d);
    } catch (error) {
      console.log(error);
      message.error("Unable to get data");
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <Loading show={loading} />
      <div className="min-h-screen  bg-secondary-color p-6 relative">
        <Layout currentOption={1}>
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
                {data["today"]?.length <= 0 ? (
                  <p className="text-primary-gray text-md">
                    No washes for today.
                  </p>
                ) : (
                  data["today"]?.map((item: any) => (
                    <WashCard
                      img={modelsData.filter((r) => r.id === item.model)[0].img}
                      title={`${item.fullCustomer.name} x ${item.washPro}`}
                      date={item.date}
                      washType={item.fullPackage.name}
                      schedule={item.time}
                      scheduleColor={item.color}
                      className="mb-4"
                    />
                  ))
                )}
              </div>
            </div>
            <Card className="h-full p-4 bg-white">
              <div className="flex items-center justify-end mt-2 mb-2">
                <Image src={LogoIcon} alt="washmyt" />
              </div>
              <CustomCalender data={data} />
            </Card>
          </div>
        </Layout>
      </div>
    </>
  );
}

export default withAuth(Page);
