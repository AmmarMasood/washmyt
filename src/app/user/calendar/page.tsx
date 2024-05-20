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
import { UserAuth } from "@/app/context/AuthContext";
import WashDetail from "../dashboard/WashDetail/WashDetail";

function Page() {
  const { superAdmin, profile } = UserAuth() as any;
  const [showWashDetailModal, setShowWashDetailModal] = useState(false);
  const [washDetail, setWashDetail] = useState({});
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>([]);
  const getData = async () => {
    setLoading(true);
    try {
      // handle for not wash-pros only handleing for admin
      const res = await axiosApiInstance.get(
        superAdmin === true ? "/api/admin/calendar" : "/api/user/wash-request"
      );
      const d = normalizeWashRequestForCalendar(res.data);
      setData(d);
    } catch (error) {
      console.log(error);
      message.error("Unable to get data");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (profile) {
      getData();
    }
  }, [profile]);

  const onClickRequest = (washDetail: any) => {
    if (superAdmin === true) {
      console.log(washDetail.originalObject);
      setWashDetail(washDetail.originalObject);
      setShowWashDetailModal(true);
    } else {
      router.push(`/user/wash-detail/${washDetail.key}`);
    }
  };

  return (
    <>
      <Loading show={loading} />
      <div className="min-h-screen  bg-secondary-color p-6 relative">
        {superAdmin === true && (
          <WashDetail
            show={showWashDetailModal}
            onClose={() => setShowWashDetailModal(false)}
            onConfirm={() => {
              getData();
              setTimeout(() => {
                setShowWashDetailModal(false);
              }, 1000);
            }}
            washDetail={washDetail}
            setLoading={setLoading}
            profile={profile}
          />
        )}
        <Layout currentOption={superAdmin === false ? 0 : 3}>
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
                  data["today"]?.map((item: any, key: number) => (
                    <WashCard
                      key={key}
                      img={modelsData.filter((r) => r.id === item.model)[0].img}
                      title={`${item.fullCustomer.name} x ${item.washPro}`}
                      date={item.date}
                      washType={item.fullPackage.name.split("(")[0]}
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
              <CustomCalender data={data} onClickRequest={onClickRequest} />
            </Card>
          </div>
        </Layout>
      </div>
    </>
  );
}

export default withAuth(Page);
