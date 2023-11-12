import { Avatar, Image, Popover, Space, Tag, Modal, Button } from "antd";
import { ColumnsType } from "antd/es/table";
import { MoreOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import dayjs from "dayjs";
import { PaymentStatus, WashStatus } from "@/app/types/interface";

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
    key: "createdAt",
    render: (text) => (
      <div>
        <p>{dayjs(text.createdAt).format("DD MMMM YYYY")}</p>
      </div>
    ),
  },

  {
    title: "Washes",
    key: "washRequests",
    render: (text) => (
      <div>
        <p>{text.washRequests.length}</p>
      </div>
    ),
  },
  {
    title: "Spent",
    key: "washRequests",
    render: (text) => (
      <div>
        <p>
          {text?.washRequests?.length > 0 &&
            `$${
              text.washRequests.reduce(
                (customerAccumulator: any, wash: any) => {
                  if (
                    wash.paymentStatus === PaymentStatus.PAID &&
                    wash.washStatus === WashStatus.COMPLETED
                  ) {
                    const tipAmount = wash.tipAmount || 0;
                    return customerAccumulator + wash.chargedAmount + tipAmount;
                  }
                  return customerAccumulator;
                },
                0
              ) / 100
            }`}
        </p>
      </div>
    ),
  },
];
