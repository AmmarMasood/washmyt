import { Avatar, Button, Image, Popover, Space, Tag, Modal } from "antd";
import { ColumnsType } from "antd/es/table";
import { MoreOutlined } from "@ant-design/icons";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { WashStatus } from "@/app/types/interface";

const { confirm } = Modal;

const showConfirm = () => {
  confirm({
    title: "Are you sure you want to delete this item?",
    icon: <ExclamationCircleFilled />,
    content: "",
    okButtonProps: {
      className: "!bg-primary-color text-white",
    },
    onOk() {
      console.log("OK");
    },
    onCancel() {
      console.log("Cancel");
    },
  });
};

const content = (
  <div>
    <Button type="link" size="large">
      Edit
    </Button>
    <br />
    <Button type="link" size="large" onClick={showConfirm}>
      Delete
    </Button>
  </div>
);

export const columns: ColumnsType<any> = [
  {
    title: "Contact",
    key: "name",
    render: (text) => (
      <div>
        <p>{text.name}</p>
        <p className="text-primary-gray font-xs">{text.email}</p>
      </div>
    ),
    sorter: (a, b) => a.name.length - b.name.length,
    sortDirections: ["descend"],
  },
  {
    title: "Business Name",
    dataIndex: "businessName",
    key: "businessName",
  },
  {
    title: "Address",
    dataIndex: "businessAddress",
    key: "businessAddress",
    render: (text) => (
      <div>
        <p>{JSON.parse(text)?.formatted_address}</p>
      </div>
    ),
  },
  {
    title: "Status",
    dataIndex: "onboardingCompleted",
    key: "onboardingCompleted",
    render: (text) =>
      text === true ? (
        <Tag color={"success"}>Onboarding Completed</Tag>
      ) : (
        <Tag color={"error"}>Onboarding Pending</Tag>
      ),
  },
  {
    title: "Washes Completed",
    dataIndex: "washRequests",
    key: "washRequests",
    render: (text) => (
      <p>
        {
          text.filter((wash: any) => wash.washStatus === WashStatus.COMPLETED)
            .length
        }
      </p>
    ),
  },

  {
    title: "Ratings",
    dataIndex: "washRequests",
    key: "washRequests",
    render: (text) => (
      <p>{text.filter((wash: any) => wash.rating && wash.rating > 0).length}</p>
    ),
  },
  {
    title: "Avg Ratings",
    dataIndex: "washRequests",
    key: "washRequests",
    render: (text) => (
      <p className="text-red-500 font-bold">
        {text
          .filter((wash: any) => wash.rating && wash.rating > 0)
          .reduce((a: any, b: any) => {
            return a + b.rating;
          }, 0) /
          text.filter((wash: any) => wash.rating && wash.rating > 0).length ||
          0}
      </p>
    ),
  },

  {
    title: "",
    dataIndex: "action",
    render: (text) => (
      <Popover content={content} trigger="click">
        <MoreOutlined className="text-xl cursor-pointer" />
      </Popover>
    ),
  },
];
