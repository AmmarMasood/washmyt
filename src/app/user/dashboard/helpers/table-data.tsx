import { Avatar, Image, Popover, Modal, Tag, Button } from "antd";
import { ColumnsType } from "antd/es/table";
import { MoreOutlined } from "@ant-design/icons";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { modelsData } from "@/app/utils/static-data";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(utc);
dayjs.extend(customParseFormat);

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
      Details
    </Button>
    <br />
    <Button type="link" size="large" onClick={showConfirm}>
      Delete
    </Button>
  </div>
);

export const columns: ColumnsType<any> = [
  {
    title: "Name",
    key: "name",
    render: (text) => (
      <div>
        <p>{text?.customer?.name}</p>
        <p className="text-primary-gray font-xs">{text?.customer?.email}</p>
      </div>
    ),
  },
  {
    title: "Model",
    dataIndex: "selectedModel",
    key: "selectedModel",
    render: (text) => <p>{modelsData.filter((r) => r.id === text)[0].name}</p>,
  },
  {
    title: "Color",
    dataIndex: "color",
    key: "color",
  },
  {
    title: "Package",
    dataIndex: "package",
    key: "package",
    render: (text) => <p className="text-red-500">{text.name.split("(")[0]}</p>,
  },
  {
    title: "Status",
    dataIndex: "washStatus",
    key: "washStatus",
    render: (text) => <Tag color={"success"}>{text}</Tag>,
  },
  {
    title: "Date/Time",
    dataIndex: "washDateAndTimeUTC",
    key: "washDateAndTimeUTC",
    render: (text) => (
      <p>{dayjs.utc(text).local().format("MM/DD/YY h:mm A")}</p>
    ),
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
    render: (text) => <p>{JSON.parse(text).formatted_address}</p>,
  },
  {
    title: "Wash Pro",
    dataIndex: "washer",
    key: "washer",
    render: (text) => <p className="font-bold">{text ? text.name : "No"}</p>,
  },
  {
    title: "Paid",
    dataIndex: "paymentStatus",
    key: "paymentStatus",
    render: (text) => <p className="text-green-500 font-bold">{text}</p>,
  },
  {
    title: "Rating",
    dataIndex: "rating",
    key: "rating",
    render: (text) => <p>{text}</p>,
  },
];
