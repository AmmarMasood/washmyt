"use client";

import React, { useEffect } from "react";
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
import { UserAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { withAuth } from "@/app/hoc/withAuth";

function Page() {
  const [showCards, setShowCards] = React.useState(true);
  const { profile, loading, user } = UserAuth as any;

  const router = useRouter();
  useEffect(() => {
    router.push("/user/access-denied");
  }, []);

  const onHide = () => {
    setShowCards((prev) => !prev);
  };

  return (
    <div className="min-h-screen  bg-secondary-color p-6 relative">
      <Layout currentOption={4}>
        <Card className="h-full p-4 bg-white">
          <CardFilter onHide={onHide} />
          <div
            style={{
              display: showCards ? "grid" : "none",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gridGap: "20px",
            }}
          >
            <InfoCard
              img={WashRequestIcon}
              title="0"
              description="Total Customers"
            />
            <InfoCard img={MatchIcon} title="0" description="On Recurr Plan" />

            <InfoCard img={SalesIcon} title="$20,123" description="Avg. LTV" />
            <InfoCard
              img={WashCompletedIcon}
              multiValues={[
                {
                  title: "0",
                  description: "Recurring",
                },
                {
                  title: "0",
                  description: "One Time",
                },
              ]}
            />
          </div>
          <div className="mt-8">
            <CustomTable
              columns={columns}
              data={data}
              showSearch={true}
              showSelect={true}
              heading="LEDGER"
            />
          </div>
        </Card>
      </Layout>
    </div>
  );
}

export default withAuth(Page);
