import { Avatar, Image, Popover, Space, Tag, Modal, Button } from "antd";
import { ColumnsType } from "antd/es/table";
import { MoreOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import dayjs from "dayjs";
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
    title: "Time Completed",
    dataIndex: "washCompletedTime",
    key: "washCompletedTime",
    render: (text) => <p>{dayjs(text).format("DD-MM-YYYY H:mm")}</p>,
  },
  {
    title: "WashID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Customer Name",
    dataIndex: "customer",
    key: "customer",
    render: (text) => <p>{text.name}</p>,
  },
  {
    title: "Wash Pro Name",
    dataIndex: "washer",
    key: "washer",
    render: (text) => <p>{text?.name}</p>,
  },
  {
    title: "Date/Time",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text) => <p>{dayjs(text).format("DD-MM-YYYY H:mm")}</p>,
  },
  {
    title: "Amount",
    key: "amount",
    render: (text) => (
      <p>{`$${text.chargedAmount ? text.chargedAmount / 100 : 0} ${
        text.tipAmount ? `+ $${text.tipAmount / 100}` : ""
      }`}</p>
    ),
  },

  {
    title: "Status",
    dataIndex: "washStatus",
    key: "washStatus",
    render: (text) => <Tag color={"success"}>{text}</Tag>,
  },
];
