import Button from "@/app/components/Button";
import Card from "@/app/components/Card";
import Image from "next/image";
import React, { useState } from "react";
import Map from "./Map";
import Weather from "@/app/components/Weather";
import { UserAuth } from "@/app/context/AuthContext";
import { UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import FaqIcon from "../../../../public/imgs/faq-icon.svg";
import UploadImage from "@/app/components/UploadImage";
import {
  PaymentStatus,
  WashDetailAccessType,
  WashStatus,
} from "@/app/types/interface";
import { Rate } from "antd";
import CameraIcon from "../../../../public/imgs/icons8-camera-100.png";
import { washerCut } from "@/contants";

dayjs.extend(relativeTime);

interface IWashRequestDetail {
  accessType: WashDetailAccessType; //can be USER, ADMIN, CUSTOMER
  modelDetail: any;
  packageDetail: any;
  date: string;
  time: string;
  addressDetail: any;
  electricalAvailable: boolean;
  waterAvailable: boolean;
  payoutDetail?: any;
  customerDetail: any;
  weatherDetail?: any;
  washerDetail?: any;
  loading?: boolean;
  openRescheduleModal?: () => void;
  onAcceptRequest?: () => void;
  onRescheduleRequest?: () => void;
  onCompleteRequest?: () => void;
  onStartRequest?: () => void;
  onUploadBeforeImage?: (file: any) => void;
  onUploadAfterImage?: (file: any) => void;
  onClickViewReceipt?: () => void;
  openRateAndTipModal?: () => void;
  washId: string;
  beforePhoto?: string;
  afterPhoto?: string;
  tipPaid?: boolean;
  tipAmount?: string;
  tipStripeId?: string;
  rating?: number;
  paymentStatus: PaymentStatus;
  washStatus: WashStatus;
  isNotWashTime?: boolean;
  receivedAmount?: any;
  receivedTip?: any;
  snowPackage?: boolean;
  rescheduleData?: any;
  ledger?: any;
}
const rowStyle = "flex flex-row justify-between items-center mt-4";
const labelStyle = "text-primary-gray text-base";
const valueStyle = "text-black text-base font-semibold w-[250px] text-right";

function WashRequestDetail(props: IWashRequestDetail) {
  const { user } = UserAuth() as any;
  const [beforePhoto, setBeforePhoto] = useState<any>(null);
  const [afterPhoto, setAfterPhoto] = useState<any>(null);

  const onAcceptRequest = () => {
    if (props.onAcceptRequest) {
      props.onAcceptRequest();
    }
  };

  const getUserButtons = () => {
    if (!user) return;
    if (
      props?.washerDetail?.userId &&
      props?.washerDetail?.userId !== user.uid
    ) {
      return (
        <div className="mt-4">
          <p className="text-primary-gray">
            This request has been accepted by one of the washpro.{" "}
          </p>
        </div>
      );
    }

    if (
      props.washStatus === WashStatus.ACCEPTED &&
      props.paymentStatus === PaymentStatus.UNPAID
    ) {
      if (props.washerDetail.userId === user.uid) {
        return (
          <div className="mt-4">
            <p className="text-primary-gray">
              Waiting for customer to complete the payment.
            </p>
          </div>
        );
      } else {
        return (
          <div className="mt-4">
            <p className="text-primary-gray">
              This request has been accepted by one of the washpro.{" "}
            </p>
          </div>
        );
      }
    } else if (
      props.washStatus === WashStatus.ACCEPTED &&
      props.paymentStatus === PaymentStatus.PAID &&
      props.washerDetail.userId === user.uid
      // &&
      // props.isNotWashTime === false
    ) {
      return (
        <div className="mt-4">
          <button
            onClick={props.onStartRequest}
            disabled={props.loading || props.beforePhoto === null}
            className={`!bg-green-500 pointer text-lg p-2 rounded-xl w-[150px] border-0 !text-white`}
            style={{
              position: "relative",
              zIndex: "1000000",
            }}
          >
            Start Wash
          </button>
        </div>
      );
    } else if (
      props.washStatus === WashStatus.STARTED &&
      props.paymentStatus === PaymentStatus.PAID &&
      // props.isNotWashTime === false &&
      props.washerDetail.userId === user.uid
    ) {
      return (
        <div className="mt-4">
          <button
            onClick={props.onCompleteRequest}
            disabled={props.loading || props.afterPhoto === null}
            className={`!bg-green-500 pointer text-lg p-2 rounded-xl w-[150px] border-0 !text-white `}
            style={{
              position: "relative",
              zIndex: "1000000",
            }}
          >
            Complete Wash
          </button>
        </div>
      );
    } else if (props.washStatus === WashStatus.CREATED) {
      return (
        <div className="mt-4">
          <button
            onClick={onAcceptRequest}
            disabled={props.loading}
            className="!bg-green-500 pointer text-lg p-2 rounded-xl w-[150px] border-0 !text-white"
          >
            Accept
          </button>

          <button
            onClick={props.openRescheduleModal}
            disabled={props.loading}
            className="!bg-yellow-500 pointer text-lg p-2 rounded-xl w-[150px] border-0 !text-white ml-2"
          >
            Reschedule
          </button>
        </div>
      );
    }
  };

  const getCustomerButtons = () => {
    return (
      <div className="mt-4 flex items-center">
        {props.washStatus === WashStatus.COMPLETED &&
          props.paymentStatus === PaymentStatus.PAID && (
            <>
              {props.rating && props.rating >= 0 ? (
                ""
              ) : (
                <p
                  className="text-primary-color mr-10 text-md underline cursor-pointer"
                  onClick={props.openRateAndTipModal}
                >
                  Rate & tip
                </p>
              )}
            </>
          )}
        {props.paymentStatus === PaymentStatus.PAID && (
          <button
            className="!bg-primary-color pointer text-lg p-2 rounded-xl w-[150px] border-0 !text-white"
            onClick={props.onClickViewReceipt}
          >
            View Receipt
          </button>
        )}
      </div>
    );
  };

  const getBottomBar = () => {
    if (props.accessType === WashDetailAccessType.USER) {
      return (
        <div className="flex items-end justify-between max-md:flex-wrap">
          <div className="flex items-center mt-6 max-sm:flex-wrap">
            <div className="mr-8">
              <p className="text-primary-color text-lg uppercase mb-4">
                Customer Detail
              </p>
              <div className="flex items-center">
                <UserOutlined
                  style={{
                    color: "black",
                    fontSize: "28px",
                    border: "1px solid #000",
                    borderRadius: "50%",
                    padding: "5px",
                  }}
                />
                <div className="ml-3">
                  <p className={`${valueStyle} !w-fit`}>
                    {props.customerDetail?.name}
                  </p>
                  <p className={`${labelStyle} text-xs`}>
                    Member since{" "}
                    {dayjs(props.customerDetail?.createdAt).fromNow()}
                  </p>
                </div>
              </div>
            </div>
            <div className="max-sm:mt-8">
              <p className="text-primary-gray text-lg uppercase mb-4">Help</p>
              <div className="flex items-center">
                <Image alt="faq" src={FaqIcon} height={30} width={30} />
                <div className="ml-3">
                  <p className={`${valueStyle} !w-fit`}>FAQs</p>
                  <p className={`${labelStyle} text-xs`}>
                    Frequently Asked Questions for WashmyT
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>{getUserButtons()}</div>
        </div>
      );
    } else if (props.accessType === WashDetailAccessType.CUSTOMER) {
      return (
        <div className="flex items-end justify-between max-sm:flex-col">
          <div className="flex items-center mt-6">
            <div className="mr-8">
              <p className="text-primary-color text-lg uppercase mb-4">
                Your Wash Pro
              </p>
              <div className="flex items-center">
                <Image
                  alt="user"
                  src={props.washerDetail?.profileImage || ""}
                  height={30}
                  width={30}
                  className="rounded-full"
                />

                <div className="ml-3">
                  <p className={`${valueStyle} !w-fit`}>
                    {props.washerDetail?.name}
                  </p>
                  <p className={`${labelStyle} text-xs`}>
                    Member since{" "}
                    {dayjs(props.washerDetail?.createdAt).fromNow()}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-primary-gray text-lg uppercase mb-4">Help</p>
              <div className="flex items-center">
                <Image alt="faq" src={FaqIcon} height={30} width={30} />
                <div className="ml-3">
                  <p className={`${valueStyle} !w-fit`}>FAQs</p>
                  <p className={`${labelStyle} text-xs`}>
                    Frequently Asked Questions for WashmyT
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>{getCustomerButtons()}</div>
        </div>
      );
    }
  };

  const showBeforeAndAfterContainer = () => {
    if (!user) return;
    if (props.accessType === WashDetailAccessType.USER) {
      if (
        (props.washStatus === WashStatus.ACCEPTED ||
          props.washStatus === WashStatus.COMPLETED ||
          props.washStatus === WashStatus.STARTED) &&
        props.paymentStatus === PaymentStatus.PAID &&
        props.washerDetail.userId === user.uid
        // &&
        // props.isNotWashTime === false
      ) {
        return (
          <div className="mt-6">
            <p className="text-primary-gray text-lg">BEFORE/AFTER PHOTOS</p>
            <div className="flex max-sm:flex-wrap">
              <div className="bg-[#f5f5f5] p-3 rounded-sm h-52 w-full mr-2 relative">
                {props.beforePhoto && (
                  <Image src={props.beforePhoto} alt="before" fill />
                )}
                {props.onUploadBeforeImage &&
                  props.washStatus === WashStatus.ACCEPTED && (
                    <UploadImage
                      label=""
                      onUpload={props.onUploadBeforeImage}
                    />
                  )}
              </div>
              <div className="bg-[#f5f5f5] p-3 rounded-sm h-52 w-full relative max-sm:mt-4">
                {props.afterPhoto && (
                  <Image src={props.afterPhoto} alt="before" fill />
                )}
                {props.onUploadAfterImage &&
                  props.washStatus === WashStatus.STARTED && (
                    <UploadImage label="" onUpload={props.onUploadAfterImage} />
                  )}
              </div>
            </div>
          </div>
        );
      }
    } else if (props.accessType === WashDetailAccessType.CUSTOMER) {
      return (
        <div className="mt-6">
          <p className="text-primary-gray text-lg">BEFORE/AFTER PHOTOS</p>
          <div className="flex max-sm:flex-wrap">
            <div className="bg-primary-gray/[0.2] p-3 rounded-sm h-52 w-full mr-2 relative">
              {props.beforePhoto && (
                <Image src={props.beforePhoto} alt="before" fill />
              )}
            </div>
            <div className="bg-primary-gray/[0.2] p-3 rounded-sm h-52 w-full relative">
              {props.afterPhoto && (
                <Image src={props.afterPhoto} alt="before" fill />
              )}
            </div>
          </div>
        </div>
      );
    }
  };
  return (
    <Card className="h-full p-4 bg-white ">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-xl text-black">New Wash Request</h1>
        {props.washStatus === WashStatus.ACCEPTED &&
          props.paymentStatus === PaymentStatus.PAID && (
            <div className="p-1 text-sm rounded-md text-green-500 border-green-500 border-2 w-fit">
              Confirm & Paid
            </div>
          )}
      </div>

      <div className="flex items-start mt-4 max-md:flex-wrap max-md:items-center max-md:justify-center max-md:w-full">
        <div className="w-full mr-8 max-md:mr-0">
          <div>
            <Weather
              lat={props.addressDetail.geometry.location.lat}
              lng={props.addressDetail.geometry.location.lng}
            />
          </div>
          <Image
            alt="Tesla"
            src={props.modelDetail.img}
            width={300}
            height={300}
            className="mb-6 max-md:w-full"
          />
          <Map
            multipleCoordinates={[]}
            containerStyle={{
              width: "100%",
              height: "250px",
              borderRadius: "10px",
            }}
            coordinates={{
              lat: props.addressDetail.geometry.location.lat,
              lng: props.addressDetail.geometry.location.lng,
            }}
          />
        </div>
        <div className="w-full">
          <div className={rowStyle}>
            <p className={labelStyle}>Name</p>
            <p className={valueStyle}>{props.customerDetail.name}</p>
          </div>
          <div className={rowStyle}>
            <p className={labelStyle}>Tesla Model</p>
            <p className={valueStyle}>{props.modelDetail.name}</p>
          </div>
          <div className={rowStyle}>
            <p className={labelStyle}>Wash Package</p>
            <p className={valueStyle}>{props.packageDetail.name}</p>
          </div>
          <div className={rowStyle}>
            <p className={labelStyle}>Date</p>
            <p className={valueStyle}>{props.date}</p>
          </div>
          <div className={rowStyle}>
            <p className={labelStyle}>Time</p>
            <p className={valueStyle}>{props.time}</p>
          </div>
          <div className={rowStyle}>
            <p className={labelStyle}>Address</p>
            <p className={valueStyle}>
              {props.addressDetail.formatted_address}
            </p>
          </div>
          <div className={rowStyle}>
            <p className={labelStyle}>Snow Package</p>
            <p className={valueStyle}>
              {props.snowPackage === true ? "YES" : "NO"}
            </p>
          </div>
          <div className={rowStyle}>
            <p className={labelStyle}>Electrical Available</p>
            <p className={valueStyle}>
              {props.electricalAvailable === true ? "YES" : "NO"}
            </p>
          </div>
          <div className={rowStyle}>
            <p className={labelStyle}>Water Available</p>
            <p className={valueStyle}>
              {props.waterAvailable === true ? "YES" : "NO"}
            </p>
          </div>
          {props.accessType === WashDetailAccessType.USER &&
            props.washStatus === WashStatus.CREATED &&
            props.paymentStatus === PaymentStatus.UNPAID &&
            props.packageDetail && (
              <div
                className={`${rowStyle} bg-primary-gray/[0.1] rounded-md pt-24 px-2 pb-2`}
              >
                <p className={labelStyle}>Payout to you</p>
                <p className={`${valueStyle} font-md`}>
                  ${(props.payoutDetail * washerCut).toFixed(2)} + Tip
                </p>
              </div>
            )}
          {props.accessType === WashDetailAccessType.USER &&
            props.washStatus === WashStatus.COMPLETED &&
            props.paymentStatus === PaymentStatus.PAID &&
            props.packageDetail && (
              <div
                className={`${rowStyle} bg-primary-gray/[0.1] rounded-md pt-24 px-2 pb-2`}
              >
                <p className={labelStyle}>Payout to you</p>

                <p className={`${valueStyle} font-md`}>
                  ${(props.ledger.washerCharges / 100).toFixed(2)}
                  {props.ledger.tipAmount
                    ? `$+ ${(props.ledger.tipWasherCharges / 100).toFixed(
                        2
                      )} (tip)`
                    : ""}
                </p>
              </div>
            )}
          {props.washStatus === WashStatus.COMPLETED &&
            props.paymentStatus === PaymentStatus.PAID &&
            props.rating && (
              <div className={`${rowStyle} px-2 pb-2 !items-center mt-6`}>
                <p className={labelStyle}>Wash Rating</p>
                <p className={`${valueStyle} `}>
                  <Rate defaultValue={props.rating} disabled />
                </p>
              </div>
            )}
          {showBeforeAndAfterContainer()}
          {props.rescheduleData && (
            <div className="mt-8">
              <h1 className="font-semibold text-xl text-black">
                Reschedule Request Information
              </h1>
              <div className="w-full">
                <div className={rowStyle}>
                  <p className={labelStyle}>Created By</p>
                  <p className={valueStyle}>
                    {props.rescheduleData?.generatedBy?.businessName}
                  </p>
                </div>
                <div className={rowStyle}>
                  <p className={labelStyle}>Proposed Date</p>
                  <p className={valueStyle}>{props.rescheduleData?.date}</p>
                </div>
                <div className={rowStyle}>
                  <p className={labelStyle}>Proposed Time</p>
                  <p className={valueStyle}>{props.rescheduleData?.time}</p>
                </div>
              </div>
              <button
                onClick={props.onRescheduleRequest}
                className="!bg-primary-color pointer text-lg p-2 rounded-xl w-[180px] border-0 !text-white mt-8 float-right"
              >
                Accept Request
              </button>
            </div>
          )}{" "}
        </div>
      </div>

      <div className="mt-8">{getBottomBar()}</div>
    </Card>
  );
}

export default WashRequestDetail;
