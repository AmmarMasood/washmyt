import { Avatar, Image, Popover, Modal, Tag, Button } from "antd";
import { ColumnsType } from "antd/es/table";
import { MoreOutlined } from "@ant-design/icons";
import { ExclamationCircleFilled } from "@ant-design/icons";

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
    title: "Name",
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
    title: "Model",
    dataIndex: "model",
    key: "model",
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
    render: (text) => <p className="text-red-500">{text}</p>,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (text) => <Tag color={"success"}>{text}</Tag>,
  },
  {
    title: "Date/Time",
    dataIndex: "date",
    key: "date",
    render: (text) => <p>{text}</p>,
  },

  {
    title: "Address",
    dataIndex: "address",
    key: "address",
    render: (text) => <p>{text}</p>,
  },
  {
    title: "Wash Pro",
    dataIndex: "washPro",
    key: "washPro",
    render: (text) => <p className="text-red-500 font-bold">{text}</p>,
  },
  {
    title: "Paid",
    dataIndex: "paid",
    key: "paid",
    render: (text) => <p className="text-green-500 font-bold">{text}</p>,
  },
  {
    title: "Rating",
    dataIndex: "rating",
    key: "rating",
    render: (text) => <p>{text}</p>,
  },
];

export const data: DataType[] = [
  {
    key: "1",
    name: "Olivia Rhyn",
    email: "@oliviarhyn",
    model: "Model S",
    color: "Tesla White",
    package: "Handwash+",
    status: "Confirmed",
    date: "10 December at 11.00 AM",
    address: "1234 Main St, San Francisco, CA 94123",
    washPro: "No",
    paid: "Yes",
    rating: 5.0,
  },
];
