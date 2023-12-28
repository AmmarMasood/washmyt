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
import { Button, Modal, Popover, message } from "antd";
import axiosApiInstance from "@/app/utils/axiosClient";
import Loading from "@/app/components/Loading";
import { MoreOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import NewWashPro from "./NewWashPro/NewWashPro";
import WashProDetail from "./WashProDetail/WashProDetail";

function Page() {
  const router = useRouter();
  const { confirm } = Modal;
  const { profile, superAdmin } = UserAuth() as any;
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
  const [filteredR, setFilteredR] = useState([]);
  //
  const [selectedWashPro, setSelectedWashPro] = useState({});
  const [showNewWashPro, setShowNewWashPro] = useState(false);
  const [showEditWashPro, setShowEditWashPro] = useState(false);

  const getWashProsData = async () => {
    setLoading(true);
    try {
      const res = await axiosApiInstance.get("/api/admin/wash-pros");
      setData(res.data);
      setFilteredR(res.data.washPros);
    } catch (err) {
      message.error("Unable to get data");
      console.log(err);
    }
    setLoading(false);
  };

  const deleteWashPro = async (id: string) => {
    setLoading(true);
    try {
      await axiosApiInstance.delete(`/api/admin/wash-pros?id=${id}`);
      message.success("Wash pro deleted successfully");
      setLoading(false);
      getWashProsData();
    } catch (error) {
      console.log(error);
      message.error("Unable to delete wash pro");
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
        deleteWashPro(id);
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
                onClick={() => {
                  setSelectedWashPro(rowIndex);
                  setShowEditWashPro(true);
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

  useEffect(() => {
    if (profile && superAdmin === true) {
      getWashProsData();
    }
  }, [profile]);

  return (
    <>
      <Loading show={loading} />
      <div className="min-h-screen  bg-secondary-color p-6 relative">
        {profile && superAdmin === true && (
          <Layout currentOption={1}>
            <NewWashPro
              show={showNewWashPro}
              onClose={() => setShowNewWashPro(false)}
              onConfirm={() => setShowNewWashPro(false)}
            />
            <WashProDetail
              show={showEditWashPro}
              onClose={() => setShowEditWashPro(false)}
              onConfirm={() => {
                getWashProsData();
                setTimeout(() => {
                  setSelectedWashPro({});
                  setShowEditWashPro(false);
                }, 1000);
              }}
              washProDetail={selectedWashPro}
            />
            <Card className="h-full p-4 bg-white">
              <div className="flex items-center justify-between">
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(200px, 1fr))",
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
                  pagination={{
                    position: "bottomRight",
                  }}
                  onSearch={(v) =>
                    setFilteredR((prev) =>
                      data.washPros.filter((r: any) => {
                        return r?.name?.toLowerCase().includes(v.toLowerCase());
                      })
                    )
                  }
                  columns={myCoulmns}
                  data={filteredR}
                  showSearch={true}
                  showButton={true}
                  onAdd={() => setShowNewWashPro(true)}
                  heading="WASH PROS"
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
