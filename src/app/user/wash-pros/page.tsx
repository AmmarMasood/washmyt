"use client";

import React, { use, useEffect, useState } from "react";
import Image from "next/image";
import Layout from "../components/Layout";
import { PROFILE } from "@/app/store";
import Card from "@/app/components/Card";
import InfoCard from "../components/InfoCard";
// icons
import WashRequestIcon from "../../../../public/imgs/wash-request-icon.svg";
import MatchIcon from "../../../../public/imgs/match-icon.svg";
import OnboardingIcon from "../../../../public/imgs/onboarding.svg";
import WashCompletedIcon from "../../../../public/imgs/wash-completed.svg";
import RatingIcon from "../../../../public/imgs/rating-icon.svg";
import CustomTable from "@/app/components/Table";
import { columns, data } from "./helpers/table-data";
import Map from "../components/Map";
import { UserAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { withAuth } from "@/app/hoc/withAuth";

function Page() {
  const { profile } = UserAuth() as any;
  const router = useRouter();
  const [address, setAddress] = useState({
    geometry: {
      location: {
        lat: 0,
        lng: 0,
      },
    },
  });

  useEffect(() => {
    router.push("/user/access-denied");
  }, []);

  useEffect(() => {
    if (profile) {
      setAddress(JSON.parse(profile.businessAddress));
    }
  }, [profile]);

  return (
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
                title="0"
                description="Live Wash Pros"
              />
              <InfoCard
                img={OnboardingIcon}
                title="0"
                description="Onboarding"
              />

              <InfoCard
                img={WashCompletedIcon}
                title="0"
                description="Washes Completed"
              />
              <InfoCard img={RatingIcon} title="0" description="Ratings" />
            </div>
            <div className="h-[400px] overflow-hidden w-[600px] rounded-3xl">
              <Map
                coordinates={{
                  lat: address?.geometry?.location.lat,
                  lng: address?.geometry?.location.lng,
                }}
              />
            </div>
          </div>
          <div className="mt-8">
            <CustomTable
              columns={columns}
              data={data}
              showSearch={true}
              heading="WASH QUEUE"
            />
          </div>
        </Card>
      </Layout>
    </div>
  );
}

export default withAuth(Page);
