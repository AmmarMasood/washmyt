"use client";

import React, { useEffect } from "react";
import Layout from "../components/Layout";
import Card from "@/app/components/Card";
import InfoCard from "../components/InfoCard";
// icons
import WashRequestIcon from "../../../../public/imgs/wash-request-icon.svg";
import MatchIcon from "../../../../public/imgs/match-icon.svg";
import WashCompletedIcon from "../../../../public/imgs/wash-completed.svg";
import CustomTable from "@/app/components/Table";
import { columns } from "./helpers/table-data";
import CardFilter from "../components/CardFilter";
import { UserAuth } from "@/app/context/AuthContext";
import { withAuth } from "@/app/hoc/withAuth";
import axiosApiInstance from "@/app/utils/axiosClient";
import { message } from "antd";
import Loading from "@/app/components/Loading";
import NewLedger from "./NewLedger/NewLedger";

const timeOptions = [
  { value: "7days", label: "Last 7 Days" },
  { value: "14days", label: "Last 14 Days" },
  { value: "30days", label: "Last 30 Days" },
];

function Page() {
  const { profile, user, superAdmin } = UserAuth() as any;
  const [showNewLedgerModal, setShowNewLedgerModal] = React.useState(false);
  const [timeFilter, setTimeFilter] = React.useState(timeOptions[0].value);
  const [showCards, setShowCards] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState({
    washRequests: [],
    totalWashRequests: "",
    totalPaymentsReceived: "",
    percentageRecurrentCustomers: "",
    percentageOneTimeCustomers: "",
    totalPayoutsPushed: "",
  });
  const [filteredR, setFilteredR] = React.useState([]);

  const onHide = () => {
    setShowCards((prev) => !prev);
  };

  const getData = async () => {
    setLoading(true);
    try {
      const res = await axiosApiInstance(
        `/api/admin/ledger?time=${timeFilter}`
      );
      setFilteredR(res.data.washRequests);
      setData(res.data);
    } catch (error) {
      console.log(error);
      message.error("Unable to get data");
    }
    setLoading(false);
  };

  const handleTimeChange = (time: any) => {
    setTimeFilter(time);
  };

  useEffect(() => {
    if (profile && superAdmin === true) {
      getData();
    }
  }, [profile, timeFilter]);

  return (
    <>
      <Loading show={loading} />
      <div className="min-h-screen  bg-secondary-color p-6 relative">
        {profile && superAdmin === true && (
          <Layout currentOption={4}>
            <NewLedger
              show={showNewLedgerModal}
              onClose={() => setShowNewLedgerModal(false)}
              onConfirm={() => setShowNewLedgerModal(false)}
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
                  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                  gridGap: "20px",
                }}
              >
                <InfoCard
                  img={WashRequestIcon}
                  title={data.totalWashRequests}
                  description="Washes Completed"
                />
                <InfoCard
                  img={MatchIcon}
                  title={`$${data.totalPaymentsReceived}`}
                  description="Payment Received"
                />
                <InfoCard
                  img={MatchIcon}
                  title={`$${data.totalPayoutsPushed}`}
                  description="Payouts Pushed"
                />
                <InfoCard
                  img={WashCompletedIcon}
                  multiValues={[
                    {
                      title: `${data.percentageRecurrentCustomers}%`,
                      description: "Recurring",
                    },
                    {
                      title: `${data.percentageOneTimeCustomers}%`,
                      description: "One Time",
                    },
                  ]}
                />
              </div>
              <div className="mt-8">
                <CustomTable
                  pagination={{
                    position: "bottomRight",
                  }}
                  columns={columns}
                  onSearch={(v) =>
                    setFilteredR((prev) =>
                      data.washRequests.filter((r: any) =>
                        r.customer.name.toLowerCase().includes(v.toLowerCase())
                      )
                    )
                  }
                  data={filteredR}
                  showSearch={true}
                  showSelect={false}
                  showButton={true}
                  onAdd={() => setShowNewLedgerModal(true)}
                  heading="LEDGER"
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
