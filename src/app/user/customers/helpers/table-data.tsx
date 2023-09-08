import { Avatar, Image, Popover, Space, Tag, Modal, Button } from "antd";
import { ColumnsType } from "antd/es/table";
import { MoreOutlined, ExclamationCircleFilled } from "@ant-design/icons";

const { confirm } = Modal;

interface DataType {
  key: string;
  model: string;
  color: string;
  package: string;
  status: string;
  date: string;
  address: string;
  washPro: string;
  paid: string;
  rating: number;
  name: string;
  email: string;
}

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

export const columns: ColumnsType<DataType> = [
  {
    title: "Customer Name",
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
    title: "Joined Date",
    dataIndex: "model",
    key: "model",
  },
  {
    title: "Type",
    dataIndex: "color",
    key: "color",
    render: (text) => <p>{text}</p>,
  },
  {
    title: "Washes",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Spent",
    dataIndex: "date",
    key: "date",
    render: (text) => <p>{text}</p>,
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
    name: "Olivia Rhyn",
    email: "@oliviarhyn",
    model: "10 December",
    color: "Member One Off",
    package: "Handwash+",
    status: "3",
    date: "$25.00",
    address: "1234 Main St, San Francisco, CA 94123",
    washPro: "No",
    paid: "Yes",
    rating: 5.0,
  },
];
