import Modal from "@/app/components/Modal";
import Image from "next/image";
import React, { useEffect } from "react";
import LogoIcon from "../../../../../public/imgs/logo-icon.svg";
import { modelsData } from "@/app/utils/static-data";
import dayjs from "dayjs";
import { Divider, List } from "antd";
import CustomTable from "@/app/components/Table";

interface ICustomerDetailProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  washProDetail: any;
}
function WashProDetail(props: ICustomerDetailProps) {
  const { show, onClose, onConfirm, washProDetail } = props;
  const [data, setData] = React.useState<any>({});
  //   const modelInfo = modelsData.filter((r) => r.id === customerDetail.model)[0];

  useEffect(() => {
    console.log("data", washProDetail);
    // setData(data);
  }, [washProDetail]);
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
    </Modal>
  );
}

export default WashProDetail;
