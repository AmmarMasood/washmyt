"use client";

import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Card from "@/app/components/Card";
import InfoCard from "../components/InfoCard";
import WashRequestIcon from "../../../../public/imgs/wash-request-icon.svg";
import MatchIcon from "../../../../public/imgs/match-icon.svg";
import SalesIcon from "../../../../public/imgs/sales-icon.svg";
import WashCompletedIcon from "../../../../public/imgs/wash-completed.svg";
import RatingIcon from "../../../../public/imgs/rating-icon.svg";
import CustomTable from "@/app/components/Table";
import { columns } from "./helpers/table-data";
import { Button, Modal, Popover, message } from "antd";
import CardFilter from "../components/CardFilter";
import { withAuth } from "@/app/hoc/withAuth";
import { useRouter } from "next/navigation";
import { UserAuth } from "@/app/context/AuthContext";
import axiosApiInstance from "@/app/utils/axiosClient";
import Loading from "@/app/components/Loading";
import { MoreOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import NewWash from "./NewWash/NewWash";
import WashDetail from "./WashDetail/WashDetail";

const timeOptions = [
  { value: "7days", label: "Last 7 Days" },
  { value: "14days", label: "Last 14 Days" },
  { value: "30days", label: "Last 30 Days" },
];

function Page() {
  const { confirm } = Modal;
  const [showNewWashModal, setShowNewWashModal] = useState(false);
  const [showWashDetailModal, setShowWashDetailModal] = useState(false);
  const [washDetail, setWashDetail] = useState({});

  const [timeFilter, setTimeFilter] = useState(timeOptions[0].value);
  const [showCards, setShowCards] = React.useState(true);
  const { loading, setLoading, profile, superAdmin } = UserAuth() as any;
  const [info, setInfo] = useState({
    new: "",
    matched: "",
    totalSales: "",
    completed: "",
    averageRating: "",
    washRequests: [],
  });
  const [filteredR, setFilteredR] = useState([]);
  const router = useRouter();

  const getData = async () => {
    setLoading(true);
    try {
      const res = await axiosApiInstance.get(
        `/api/admin/dashboard?time=${timeFilter}`
      );
      setInfo(res.data);
      setFilteredR(res.data.washRequests);
    } catch (error) {
      console.log(error);
      message.error("Unable to get data");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (profile && superAdmin === true) {
      getData();
    }
  }, [profile, timeFilter]);
  const onHide = () => {
    setShowCards((prev) => !prev);
  };

  const deleteWasRequest = async (id: any) => {
    setLoading(true);
    try {
      await axiosApiInstance.delete(`/api/admin/wash-request?id=${id}`);
      message.success("Wash request deleted successfully");
      setLoading(false);
      getData();
    } catch (error) {
      console.log(error);
      message.error("Unable to delete wash request");
      setLoading(false);
    }
  };

  const showConfirm = (id: string) => {
    confirm({
      title: "Are you sure you want to delete this item?",
      icon: <ExclamationCircleFilled />,
      content: "",
      okButtonProps: {
        className: "!bg-primary-color text-white",
      },
      onOk() {
        deleteWasRequest(id);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const myCoulmns = [
    ...columns,
    {
      title: "",
      dataIndex: "action",

      render: (record: any, rowIndex: any) => (
        <Popover
          content={
            <>
              <Button
                type="link"
                size="large"
                onClick={() => router.push(`/user/wash-detail/${rowIndex.id}`)}
              >
                Open
              </Button>
              <br />
              <Button
                type="link"
                size="large"
                onClick={() => {
                  onClickWashDetail(rowIndex);
                }}
              >
                Details
              </Button>

              <br />
              <Button
                type="link"
                size="large"
                onClick={() => showConfirm(rowIndex.id)}
              >
                Delete
              </Button>
            </>
          }
          trigger="click"
        >
          <MoreOutlined className="text-xl cursor-pointer" />
        </Popover>
      ),
    },
  ];

  const handleTimeChange = (time: any) => {
    setTimeFilter(time);
  };

  const onCreateNewWash = () => {
    setShowNewWashModal(true);
  };

  const onClickWashDetail = (washDetail: any) => {
    console.log(washDetail);
    setWashDetail(washDetail);
    setShowWashDetailModal(true);
  };

  return (
    <>
      <Loading show={loading} />

      <div className="min-h-screen  bg-secondary-color p-6 relative">
        {profile && superAdmin === true && (
          <Layout currentOption={0}>
            <NewWash
              show={showNewWashModal}
              onClose={() => setShowNewWashModal(false)}
              onConfirm={() => setShowNewWashModal(false)}
            />
            <WashDetail
              show={showWashDetailModal}
              onClose={() => setShowWashDetailModal(false)}
              onConfirm={() => setShowWashDetailModal(false)}
              washDetail={washDetail}
              setLoading={setLoading}
            />

            <Card className="h-full p-4 bg-white">
              <CardFilter
                onHide={onHide}
                onChangeTime={handleTimeChange}
                options={timeOptions}
                value={timeFilter}
              />
              <div
                style={{
                  display: showCards ? "grid" : "none",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gridGap: "20px",
                }}
              >
                <InfoCard
                  img={WashRequestIcon}
                  title={info.new as any}
                  description="New Washes Requests"
                />
                <InfoCard
                  img={MatchIcon}
                  title={info.matched as any}
                  description="Assign washes matched"
                />
                <InfoCard
                  img={SalesIcon}
                  title={`$${info.totalSales}`}
                  description="Total Sales"
                />
                <InfoCard
                  img={WashCompletedIcon}
                  title={info.completed as any}
                  description="Wash Completed"
                />
                <InfoCard
                  img={RatingIcon}
                  title={info.averageRating as any}
                  description="Average Rating"
                />
              </div>
              <div className={`mt-8`}>
                <CustomTable
                  pagination={{
                    position: "bottomRight",
                  }}
                  onSearch={(v) =>
                    setFilteredR((prev) =>
                      info.washRequests.filter((r: any) =>
                        r.customer.name.toLowerCase().includes(v.toLowerCase())
                      )
                    )
                  }
                  columns={myCoulmns}
                  data={filteredR}
                  showSearch={true}
                  showButton={true}
                  onAdd={onCreateNewWash}
                  heading="WASH QUEUE"
                />
              </div>
            </Card>
          </Layout>
        )}
      </div>
    </>
  );
}

export default withAuth(Page);
