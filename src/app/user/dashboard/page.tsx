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
import SalesIcon from "../../../../public/imgs/sales-icon.svg";
import WashCompletedIcon from "../../../../public/imgs/wash-completed.svg";
import RatingIcon from "../../../../public/imgs/rating-icon.svg";
import CustomTable from "@/app/components/Table";
import { columns, data } from "./helpers/table-data";
import { Select } from "antd";
import CardFilter from "../components/CardFilter";

function Page() {
  const [showCards, setShowCards] = React.useState(true);

  const onHide = () => {
    setShowCards((prev) => !prev);
  };
  return (
    <div className="min-h-screen  bg-secondary-color p-6 relative">
      <Layout currentOption={0} profile={PROFILE}>
        <Card className="h-full p-4 bg-white">
          <CardFilter onHide={onHide} />
          <div
            style={{
              display: showCards ? "grid" : "none",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gridGap: "20px",
            }}
          >
            <InfoCard
              img={WashRequestIcon}
              title="7"
              description="New Washes Requests"
              bottomDescription="2 Cancelled"
            />
            <InfoCard
              img={MatchIcon}
              title="352"
              description="Assign washes matched"
              bottomDescription="41 Not Matched"
            />
            <InfoCard
              img={SalesIcon}
              title="$20,123"
              description="Total Sales"
              bottomDescription="$7,034 Uncollected"
            />
            <InfoCard
              img={WashCompletedIcon}
              title="272"
              description="Wash Completed"
              bottomDescription="121 Pending"
            />
            <InfoCard
              img={RatingIcon}
              title="4.7"
              description="Average Rating"
              bottomDescription="152 Reviews"
            />
          </div>
          <div className={`mt-8`}>
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
