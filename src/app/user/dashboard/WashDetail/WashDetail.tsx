import Modal from "@/app/components/Modal";
import React, { useEffect } from "react";
import Stepper from "./Stepper";
import LogoIcon from "../../../../../public/imgs/logo-icon.svg";
import Image from "next/image";
import { modelsData } from "@/app/utils/static-data";
import Weather from "@/app/components/Weather";
import EditIcon from "../../../../../public/imgs/edit-icon.svg";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
import { Button, Divider } from "antd";
import { set } from "firebase/database";
import WashEdit from "../WashEdit/WashEdit";

dayjs.extend(utc);
dayjs.extend(customParseFormat);

interface IWashDetailProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  washDetail: any;
  setLoading: (loading: boolean) => void;
}

const rowClassName = `
   flex items-start justify-between text-right
   mb-4
`;
const keyClassName = `text-primary-gray mr-4 w-1/3 text-left`;
const valueClassName = `text-primary-black font-semibold w-2/3 flex items-start justify-end flex-wrap`;
const editIconClassName = `cursor-pointer ml-4 mt-1`;

function WashDetail(props: IWashDetailProps) {
  const { show, onClose, onConfirm, washDetail, setLoading } = props;
  const [customerDetail, setCustomerDetail] = React.useState<any>({});
  const [modelInfo, setModelInfo] = React.useState<any>({});
  const [address, setAddress] = React.useState<any>(null);
  const [editModal, setEditModal] = React.useState(false);
  const [step, setStep] = React.useState(1);

  useEffect(() => {
    console.log(washDetail);
    setCustomerDetail(washDetail?.customer);
    setModelInfo(
      modelsData.filter((r) => r.id === washDetail?.selectedModel)[0]
    );
    if (washDetail?.address) setAddress(JSON.parse(washDetail?.address));

    if (washDetail?.washStatus === "COMPLETED") setStep(4);
    else if (washDetail?.washer && washDetail?.paymentStatus === "PAID")
      setStep(3);
    else if (
      washDetail?.washStatus === "ACCEPTED" &&
      washDetail?.paymentStatus === "UNPAID"
    )
      setStep(2);
    else if (washDetail?.washStatus === "CREATED" && !washDetail?.washDetail)
      setStep(1);
    else setStep(0);
  }, [washDetail]);

  function openMailApplication(email: string) {
    window.location.href = `mailto:${email}`;
  }
  function openTextApplication(phoneNumber: string) {
    window.location.href = `sms:${phoneNumber}`;
  }

  return (
    <Modal
      title=""
      width={1000}
      show={show}
      onClose={onClose}
      onConfirm={onConfirm}
      showCloseButton={true}
    >
      <Image src={LogoIcon} alt="washmyt" />
      <WashEdit
        show={editModal}
        onClose={() => setEditModal(false)}
        onConfirm={() => setEditModal(false)}
        setLoading={setLoading}
        washDetail={washDetail}
      />
      <div className="mt-4">
        <Stepper currentStep={step} />
        <div className="flex items-start justify-between mt-10">
          <div>
            <h2 className="text-xl my-2">{customerDetail?.name}</h2>

            {address && (
              <Weather
                lat={address.geometry.location.lat}
                lng={address.geometry.location.lng}
                time={washDetail?.washDateAndTimeUTC}
              />
            )}
            <p className="font-semibold my-4">{modelInfo?.name}</p>

            <Image src={modelInfo?.img} alt="washmyt" height={"150"} />
          </div>
          {/*  */}
          <div>
            {/*  */}
            <div className={rowClassName}>
              <p className={keyClassName}>Wash Package</p>

              <div className={valueClassName}>
                <span className="text-primary-color">
                  {washDetail?.package?.name}
                </span>
                <Image
                  src={EditIcon}
                  alt="washmyt"
                  className={editIconClassName}
                  onClick={() => setEditModal(true)}
                />
              </div>
            </div>
            {/*  */}
            {/*  */}
            <div className={rowClassName}>
              <p className={keyClassName}>Date</p>

              <div className={valueClassName}>
                <span>
                  {dayjs
                    .utc(washDetail?.washDateAndTimeUTC)
                    .local()
                    .format("MMM DD, YYYY")}
                </span>
                <Image
                  src={EditIcon}
                  alt="washmyt"
                  className={editIconClassName}
                  onClick={() => setEditModal(true)}
                />
              </div>
            </div>
            {/*  */}
            {/*  */}
            <div className={rowClassName}>
              <p className={keyClassName}>Time</p>

              <div className={valueClassName}>
                <span>
                  {dayjs
                    .utc(washDetail?.washDateAndTimeUTC)
                    .local()
                    .format("h:mm A")}
                </span>
                <Image
                  src={EditIcon}
                  alt="washmyt"
                  className={editIconClassName}
                  onClick={() => setEditModal(true)}
                />
              </div>
            </div>
            {/*  */}
            {/*  */}
            <div className={rowClassName}>
              <p className={keyClassName}>Address</p>
              <div className={valueClassName}>
                <span>{address?.formatted_address}</span>
                <Image
                  src={EditIcon}
                  alt="washmyt"
                  className={editIconClassName}
                  onClick={() => setEditModal(true)}
                />
              </div>
            </div>
            {/*  */}
            {/*  */}
            <div className={rowClassName}>
              <p className={keyClassName}>Has Eletric Outlets</p>
              <div className={valueClassName}>
                {washDetail?.electricalHookupAvailable ? (
                  <span>Yes</span>
                ) : (
                  <span className="text-primary-color">No</span>
                )}
                <Image
                  src={EditIcon}
                  alt="washmyt"
                  className={editIconClassName}
                  onClick={() => setEditModal(true)}
                />
              </div>
            </div>
            {/*  */}
            {/*  */}
            <div className={rowClassName}>
              <p className={keyClassName}>Has Water Outlet Available</p>
              <div className={valueClassName}>
                {washDetail?.waterHookupAvailable ? (
                  <span>Yes</span>
                ) : (
                  <span className="text-primary-color">No</span>
                )}
                <Image
                  src={EditIcon}
                  alt="washmyt"
                  className={editIconClassName}
                  onClick={() => setEditModal(true)}
                />
              </div>
            </div>
          </div>
          {/*  */}
        </div>
        <p className="font-medium text-lg text-primary-gray mt-12 -mb-4">
          CONVERSATIONS
        </p>
        <Divider />
        <div className="flex items-center justify-between">
          <div className="mt-2">
            <h2 className="text-xl my-2">Customer</h2>
            <Button
              className="bg-primary-color text-white mr-5"
              onClick={() => openTextApplication(customerDetail?.phoneNumber)}
            >
              Text
            </Button>
            <Button
              className="bg-gray-200 text-black"
              onClick={() => openMailApplication(customerDetail?.email)}
            >
              Email
            </Button>
          </div>
          {washDetail?.washer && (
            <div className="mt-2">
              <h2 className="text-xl my-2">
                Wash Pro {`(${washDetail?.washer?.name || ""})`}
              </h2>
              <Button
                className="bg-primary-color text-white mr-5"
                onClick={() =>
                  openTextApplication(washDetail?.washer?.phoneNumber)
                }
              >
                Text
              </Button>
              <Button
                className="bg-gray-200 text-black"
                onClick={() => openMailApplication(washDetail?.washer?.email)}
              >
                Email
              </Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default WashDetail;
