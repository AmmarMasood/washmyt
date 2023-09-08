import { Avatar, Image, Popover, Space, Tag, Modal, Button } from "antd";
import { ColumnsType } from "antd/es/table";
import { MoreOutlined, ExclamationCircleFilled } from "@ant-design/icons";
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

interface DataType {
  key: string;
  timeCompleted: string;
  washId: string;
  customerName: string;
  washProName: string;
  type: string;
  date: string;
  amount: string;
  status: string;
}

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

export const columns: ColumnsType<DataType> = [
  {
    title: "Time Completed",
    key: "timeCompleted",
    sorter: (a, b) => a.timeCompleted.length - b.timeCompleted.length,
    sortDirections: ["descend"],
  },
  {
    title: "WashID",
    dataIndex: "washId",
    key: "washId",
  },
  {
    title: "Customer Name",
    dataIndex: "customerName",
    key: "customerName",
  },
  {
    title: "Wash Pro Name",
    dataIndex: "washProName",
    key: "washProName",
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "Date/Time",
    dataIndex: "date",
    key: "date",
    render: (text) => <p>{text}</p>,
  },

  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (text) => (
      <p className="text-green-500 border-solid border-2 p-0 border-green-500 text-center rounded-lg text-sm">
        {text}
      </p>
    ),
  },

  {
    title: "",
    dataIndex: "action",
    render: (text) => <p className="text-red-500 font-bold">View</p>,
  },
];

export const data: DataType[] = [
  {
    key: "1",
    timeCompleted: "5-29-2023 11:00 AM",
    washId: "123456",
    customerName: "John Doe",
    washProName: "John Doe",
    type: "Payment for wash",
    date: "10 December at 11:00 AM",
    amount: "$100",
    status: "Paid Out",
  },
];
