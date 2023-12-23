"use client";

import React, { useEffect } from "react";
import Layout from "../components/Layout";
import Card from "@/app/components/Card";
import InfoCard from "../components/InfoCard";
// icons
import WashRequestIcon from "../../../../public/imgs/wash-request-icon.svg";
import MatchIcon from "../../../../public/imgs/match-icon.svg";
import SalesIcon from "../../../../public/imgs/sales-icon.svg";
import CustomTable from "@/app/components/Table";
import { columns } from "./helpers/table-data";
import CardFilter from "../components/CardFilter";
import { useRouter } from "next/navigation";
import { withAuth } from "@/app/hoc/withAuth";
import axiosApiInstance from "@/app/utils/axiosClient";
import Loading from "@/app/components/Loading";
import { Button, Modal, Popover, message } from "antd";
import { MoreOutlined, ExclamationCircleFilled } from "@ant-design/icons";

import { UserAuth } from "@/app/context/AuthContext";
import NewCustomer from "./NewCustomer/NewCustomer";
import CustomerDetail from "./CustomerDetail/CustomerDetail";
const timeOptions = [
  { value: "7days", label: "Last 7 Days" },
  { value: "14days", label: "Last 14 Days" },
  { value: "30days", label: "Last 30 Days" },
];

function Page() {
  const { confirm } = Modal;
  const router = useRouter();
  const [timeFilter, setTimeFilter] = React.useState(timeOptions[0].value);
  const [showCards, setShowCards] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const { profile, superAdmin } = UserAuth() as any;
  const [data, setData] = React.useState({
    totalCustomers: "",
    totalRecuringCustomersSales: "",
    avgLtv: "",
    customers: [],
  });
  const [filteredR, setFilteredR] = React.useState([]);
  // modals
  const [showCustomerDetail, setShowCustomerDetail] = React.useState(false);
  const [showNewCustomer, setShowNewCustomer] = React.useState(false);
  const [selectedCustomer, setSelectedCustomer] = React.useState({});

  const getWashProsData = async () => {
    setLoading(true);
    try {
      const res = await axiosApiInstance.get(
        `/api/admin/customers?time=${timeFilter}`
      );
      setData(res.data);
      setFilteredR(res.data.customers);
    } catch (err) {
      message.error("Unable to get data");
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (profile && superAdmin === true) {
      getWashProsData();
    }
  }, [profile, timeFilter]);

  const onHide = () => {
    setShowCards((prev) => !prev);
  };

  const handleTimeChange = (time: any) => {
    setTimeFilter(time);
  };

  const deleteCustomer = async (id: string) => {
    setLoading(true);
    try {
      await axiosApiInstance.delete(`/api/admin/customers?id=${id}`);
      message.success("Customer deleted successfully");
      setLoading(false);
      getWashProsData();
    } catch (error) {
      console.log(error);
      message.error("Unable to delete customer");
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
        deleteCustomer(id);
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
                  setSelectedCustomer(rowIndex);
                  setShowCustomerDetail(true);
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

  return (
    <>
      <Loading show={loading} />
      <div className="min-h-screen  bg-secondary-color p-6 relative">
        {profile && superAdmin === true && (
          <Layout currentOption={2}>
            <NewCustomer
              show={showNewCustomer}
              onClose={() => setShowNewCustomer(false)}
              onConfirm={() => setShowNewCustomer(false)}
            />
            <CustomerDetail
              show={showCustomerDetail}
              onClose={() => setShowCustomerDetail(false)}
              onConfirm={() => setShowCustomerDetail(false)}
              customerDetail={selectedCustomer as any}
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
                  title={data.totalCustomers}
                  description="Total Customers"
                />
                <InfoCard
                  img={MatchIcon}
                  title={`$${data.totalRecuringCustomersSales}`}
                  description="On Recurr Plan"
                />
                <InfoCard
                  img={SalesIcon}
                  title={`$${data.avgLtv}`}
                  description="Avg LTV"
                />
                {/* <InfoCard
                              img={WashCompletedIcon}
              title={data}
              description="Acive Now"
            /> */}
              </div>
              <div className="mt-8">
                <CustomTable
                  pagination={{
                    position: "bottomRight",
                  }}
                  columns={myCoulmns}
                  data={filteredR}
                  onSearch={(v) =>
                    setFilteredR((prev) =>
                      data.customers.filter((r: any) =>
                        r.name.toLowerCase().includes(v.toLowerCase())
                      )
                    )
                  }
                  showSearch={true}
                  showButton={true}
                  onAdd={() => setShowNewCustomer(true)}
                  heading="CUSTOMERS"
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
