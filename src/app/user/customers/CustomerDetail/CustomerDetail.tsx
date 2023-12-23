import Modal from "@/app/components/Modal";
import Image from "next/image";
import React, { useEffect } from "react";
import LogoIcon from "../../../../../public/imgs/logo-icon.svg";
import { modelsData } from "@/app/utils/static-data";
import dayjs from "dayjs";
import { Divider, List } from "antd";
import CustomTable from "@/app/components/Table";
import { userWashesTableColumns } from "../helpers/table-data";

interface IWashRequest {
  address: string;
  afterPhoto: null | string;
  beforePhoto: null | string;
  chargedAmount: null | number;
  color: string;
  couponId: null | string;
  createdAt: string;
  customerId: string;
  electricalHookupAvailable: boolean;
  id: string;
  packageId: string;
  paymentStatus: "PAID" | "UNPAID"; // Assuming payment status is either "PAID" or "UNPAID"
  rating: null | number;
  selectedModel: string;
  snowPackage: boolean;
  stripeId: null | string;
  tipAmount: null | number;
  tipPaid: boolean;
  tipStripeId: null | string;
  updatedAt: string;
  washCompletedTime: null | string;
  washDateAndTimeUTC: string;
  washStatus: string;
  washerId: null | string;
  waterHookupAvailable: boolean;
}
interface ICustomerDetailProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  customerDetail: {
    createdAt: string;
    email: string;
    name: string;
    id: string;
    phoneNumber: string;
    stripeId: string;
    washRequests: IWashRequest[];
  };
}
function CustomerDetail(props: ICustomerDetailProps) {
  const { show, onClose, onConfirm, customerDetail } = props;
  const [data, setData] = React.useState<any>({});
  //   const modelInfo = modelsData.filter((r) => r.id === customerDetail.model)[0];

  useEffect(() => {
    let modelImage;
    let address;
    if (customerDetail?.washRequests?.length > 0) {
      modelImage = modelsData.filter(
        (r) => r.id === customerDetail?.washRequests[0]?.selectedModel
      )[0]?.img;
      address = JSON.parse(
        customerDetail?.washRequests[0]?.address
      )?.formatted_address;
    }
    const data = {
      ...customerDetail,
      modelImage,
      address,
    };
    console.log("data", data);
    setData(data);
  }, [customerDetail]);
  return (
    <Modal
      title=""
      show={show}
      onClose={onClose}
      onConfirm={onConfirm}
      showCloseButton={true}
      width={700}
    >
      <Image src={LogoIcon} alt="washmyt" />
      <div className="flex items-start justify-between mt-4">
        <div>
          <h3 className="text-lg font-medium mb-2">{data?.name}</h3>
          <Image src={data?.modelImage} alt="washmyt" height={"100"} />
        </div>
        <div>
          <p className="text-md font-medium">
            {dayjs(data?.createdAt).format("MMMM d, YYYY")}
          </p>
          <h3 className="text-2xl font-bold mt-6 text-primary-color">
            {data?.washRequests ? `${data?.washRequests?.length} Washes` : ""}
          </h3>
        </div>
      </div>
      <div className="my-6">
        <div className="flex justify-between mt-4">
          <p className="text-primary-gray">Phone</p>
          <p>{data?.phoneNumber}</p>
        </div>
        <div className="flex justify-between my-4">
          <p className="text-primary-gray">Email</p>
          <p>{data?.email}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-primary-gray">Address</p>
          <p>{data?.address}</p>
        </div>
      </div>
      <span className="font-medium text-lg text-primary-gray">WASHES</span>
      <Divider />
      <CustomTable
        pagination={false}
        columns={userWashesTableColumns}
        data={customerDetail?.washRequests}
        showSearch={false}
        heading="WASHES"
        size="small"
        y={200}
      />
    </Modal>
  );
}

export default CustomerDetail;
