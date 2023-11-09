"use client";

import React, { useEffect, useState } from "react";
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
import { Button, Popover, Select, message } from "antd";
import CardFilter from "../components/CardFilter";
import { withAuth } from "@/app/hoc/withAuth";
import { useRouter } from "next/navigation";
import { UserAuth } from "@/app/context/AuthContext";
import axiosApiInstance from "@/app/utils/axiosClient";
import Loading from "@/app/components/Loading";
import { normalizeWashRequestForDashboard } from "@/app/normalizers/UserNormalizers";
import { MoreOutlined } from "@ant-design/icons";

function Page() {
  const [showCards, setShowCards] = React.useState(true);
  const { loading, setLoading, superAdmin } = UserAuth() as any;
  const [info, setInfo] = useState({
    newWashRequests: 0,
    assignWashers: 0,
    totalSales: 0,
    washesCompleted: 0,
    averageRating: 0,
    unCollectedSales: 0,
    washesPending: 0,
    cancelled: 0,
  });
  const [data, setData] = useState<any>([]);
  const router = useRouter();

  const getData = async () => {
    setLoading(true);
    try {
      const res = await axiosApiInstance("/api/user/wash-request");
      const d = normalizeWashRequestForDashboard(
        res.data.mine,
        res.data.unassigned
      );
      setData([...d.mine, ...d.unassigned]);
      setInfo(d);
    } catch (error) {
      console.log(error);
      message.error("Unable to get data");
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);
  const onHide = () => {
    setShowCards((prev) => !prev);
  };
  const myCoulmns = [
    ...columns,
    {
      title: "",
      dataIndex: "action",

      render: (record: any, rowIndex: any) => (
        <Popover
          content={
            <Button
              type="link"
              size="large"
              onClick={() =>
                router.push(`/user/dashboard/wash-detail/${rowIndex.key}`)
              }
            >
              Details
            </Button>
          }
          trigger="click"
        >
          <MoreOutlined className="text-xl cursor-pointer" />
        </Popover>
      ),
    },
  ];
  return (
    <>
      <Loading show={loading} />
      <div className="min-h-screen  bg-secondary-color p-6 relative">
        <Layout currentOption={0}>
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
                title={info.newWashRequests as any}
                description="New Washes Requests"
                bottomDescription={`${info.cancelled} Cancelled`}
              />
              <InfoCard
                img={MatchIcon}
                title={info.assignWashers as any}
                description="Assign washes matched"
                bottomDescription={`${info.newWashRequests} Not Matched`}
              />
              <InfoCard
                img={SalesIcon}
                title={info.totalSales as any}
                description="Total Sales"
                bottomDescription={`$ ${info.unCollectedSales} Uncollected`}
              />
              <InfoCard
                img={WashCompletedIcon}
                title={info.washesCompleted as any}
                description="Wash Completed"
                bottomDescription={`${info.washesPending} Pending`}
              />
              <InfoCard
                img={RatingIcon}
                title={info.averageRating as any}
                description="Average Rating"
                bottomDescription="0 Reviews"
              />
            </div>
            <div className={`mt-8`}>
              <CustomTable
                columns={myCoulmns}
                data={data}
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
