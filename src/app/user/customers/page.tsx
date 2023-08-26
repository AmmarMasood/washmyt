"use client";

import React from "react";
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
import SalesIcon from "../../../../public/imgs/sales-icon.svg";
import CustomTable from "@/app/components/Table";
import { columns, data } from "./helpers/table-data";
import Map from "../components/Map";
import CardFilter from "../components/CardFilter";

function Page() {
  return (
    <div className="min-h-screen  bg-secondary-color p-6 relative">
      <Layout currentOption={2} profile={PROFILE}>
        <Card className="h-full p-4 bg-white">
          <CardFilter />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gridGap: "20px",
            }}
          >
            <InfoCard
              img={WashRequestIcon}
              title="7"
              description="Total Customers"
            />
            <InfoCard
              img={MatchIcon}
              title="$35,021"
              description="On Recurr Plan"
            />

            <InfoCard img={SalesIcon} title="$20,123" description="Avg. LTV" />
            <InfoCard
              img={WashCompletedIcon}
              title="272"
              description="Acive Now"
            />
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

export default Page;
