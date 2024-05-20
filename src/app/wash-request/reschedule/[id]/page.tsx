"use client";

import React, { useEffect, useState } from "react";

import { message } from "antd";
import { useParams, useRouter } from "next/navigation";
import { UserAuth } from "@/app/context/AuthContext";
import axiosApiInstance from "@/app/utils/axiosClient";
import Loading from "@/app/components/Loading";
import Layout from "@/app/user/components/Layout";
import { modelsData } from "@/app/utils/static-data";
import WashRequestDetail from "@/app/user/components/WashRequestDetail";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/app/lib/firebase";
import { withoutAuth } from "@/app/hoc/withoutAuth";
import {
  PaymentStatus,
  RescheduleRequestStatus,
  WashDetailAccessType,
  WashStatus,
} from "@/app/types/interface";

dayjs.extend(utc);
dayjs.extend(customParseFormat);

const model = modelsData;

function Page() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [rescheduleData, setRescheduleData] = useState<any>(null);

  const router = useRouter();
  const params = useParams();

  const getData = async () => {
    setLoading(true);
    try {
      const res = await axiosApiInstance.get(
        `/api/wash-request/reschedule?id=${params.id}`
      );

      const washRequest = res.data.washRequest;
      setData({
        ...washRequest,
        date: dayjs
          .utc(washRequest.washDateAndTimeUTC)
          .local()
          .format("MM/DD/YYYY"),
        time: dayjs
          .utc(washRequest.washDateAndTimeUTC)
          .local()
          .format("h:mm A"),
        address: JSON.parse(washRequest.address),
      });
      setRescheduleData({
        date: dayjs
          .utc(res.data.washDateAndTimeUTC)
          .local()
          .format("MM/DD/YYYY"),
        time: dayjs.utc(res.data.washDateAndTimeUTC).local().format("h:mm A"),
        generatedBy: res.data.generatedByUser,
        status: res.data.status,
      });
    } catch (error) {
      console.log(error);
      message.error("Unable to get data");
    }
    setLoading(false);
  };

  const onClickViewReceipt = async () => {
    setLoading(true);
    setLoading(false);
  };

  const onRescheduleRequest = async () => {
    setLoading(true);
    try {
      await axiosApiInstance.get(
        `/api/wash-request/reschedule/accept?id=${params.id}`
      );
      message.success("Reschedule request accepted");
      router.push(`/wash-request/payment?wash=${data.id}`);
    } catch (error: any) {
      message.error(
        error?.response?.data?.message || "Unable to accept reschedule request"
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    if (params.id) {
      getData();
    }
  }, []);

  return (
    <>
      <Loading show={loading} />
      <div className="min-h-screen  bg-secondary-color p-6 relative">
        {data &&
          rescheduleData &&
          data.washStatus === WashStatus.CREATED &&
          (rescheduleData.status === RescheduleRequestStatus.PENDING ||
            rescheduleData.status === RescheduleRequestStatus.NOTIFIED) && (
            // data.washStatus === WashStatus.COMPLETED &&
            // data.paymentStatus === PaymentStatus.PAID &&
            <WashRequestDetail
              accessType={WashDetailAccessType.CUSTOMER}
              modelDetail={model.filter((m) => m.id === data.selectedModel)[0]}
              packageDetail={data.package}
              snowPackage={data.snowPackage}
              date={data.date}
              time={data.time}
              addressDetail={data.address}
              electricalAvailable={data.electricalHookupAvailable}
              waterAvailable={data.waterHookupAvailable}
              payoutDetail={data.package.price}
              customerDetail={data.customer}
              washStatus={data.washStatus}
              paymentStatus={data.paymentStatus}
              tipPaid={data.tipPaid}
              tipStripeId={data.tipStripeId}
              tipAmount={data.tipAmount}
              rating={data.rating}
              washerDetail={data.washer}
              washId={params.id as string}
              beforePhoto={data.beforePhoto}
              afterPhoto={data.afterPhoto}
              onClickViewReceipt={onClickViewReceipt}
              rescheduleData={rescheduleData}
              onRescheduleRequest={onRescheduleRequest}
            />
          )}
      </div>
    </>
  );
}

export default withoutAuth(Page);
