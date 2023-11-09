"use client";

import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Card from "@/app/components/Card";
import InfoCard from "../components/InfoCard";
// icons
import WashRequestIcon from "../../../../public/imgs/wash-request-icon.svg";
import OnboardingIcon from "../../../../public/imgs/onboarding.svg";
import WashCompletedIcon from "../../../../public/imgs/wash-completed.svg";
import RatingIcon from "../../../../public/imgs/rating-icon.svg";
import CustomTable from "@/app/components/Table";
import { columns } from "./helpers/table-data";
import Map from "../components/Map";
import { UserAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { withAuth } from "@/app/hoc/withAuth";
import { message } from "antd";
import axiosApiInstance from "@/app/utils/axiosClient";
import Loading from "@/app/components/Loading";

function Page() {
  const router = useRouter();
  const { profile } = UserAuth() as any;
  const [data, setData] = useState({
    liveWashPros: "",
    onboarding: "",
    washProsLocation: [],
    totalRequests: "",
    totalRatings: "",
    washPros: [],
  });
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    geometry: {
      location: {
        lat: 0,
        lng: 0,
      },
    },
  });

  const getWashProsData = async () => {
    setLoading(true);
    try {
      const res = await axiosApiInstance.get("/api/admin/wash-pros");
      console.log(
        res.data,
        res.data.washPros.map((re: any) => JSON.parse(re.businessAddress))
      );
      setData(res.data);
    } catch (err) {
      message.error("Unable to get data");
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (profile) {
      setAddress(JSON.parse(profile.businessAddress));
    }
  }, [profile]);

  useEffect(() => {
    getWashProsData();
  }, []);

  return (
    <>
      <Loading show={loading} />
      <div className="min-h-screen  bg-secondary-color p-6 relative">
        <Layout currentOption={1}>
          <Card className="h-full p-4 bg-white">
            <div className="flex items-center justify-between">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gridGap: "20px",
                  width: "500px",
                }}
              >
                <InfoCard
                  img={WashRequestIcon}
                  title={data.liveWashPros}
                  description="Live Wash Pros"
                />
                <InfoCard
                  img={OnboardingIcon}
                  title={data.onboarding}
                  description="Onboarding"
                />

                <InfoCard
                  img={WashCompletedIcon}
                  title={data.totalRequests}
                  description="Washes Completed"
                />
                <InfoCard
                  img={RatingIcon}
                  title={data.totalRatings}
                  description="Ratings"
                />
              </div>
              <div className="h-[400px] overflow-hidden w-[600px] rounded-3xl">
                <Map
                  containerStyle={{
                    width: "100%",
                    height: "500px",
                    borderRadius: "30px",
                  }}
                  coordinates={{
                    lat: address?.geometry?.location.lat,
                    lng: address?.geometry?.location.lng,
                  }}
                  multipleCoordinates={data.washProsLocation}
                  zoom={2}
                />
              </div>
            </div>
            <div className="mt-8">
              <CustomTable
                columns={columns}
                data={data.washPros}
                showSearch={true}
                heading="WASH QUEUE"
              />
            </div>
          </Card>
        </Layout>
      </div>
    </>
  );
}

export default withAuth(Page);
