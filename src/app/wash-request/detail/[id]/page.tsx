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
import RateTipMode from "./components/RateTipMode";
import {
  PaymentStatus,
  WashDetailAccessType,
  WashStatus,
} from "@/app/types/interface";

dayjs.extend(utc);
dayjs.extend(customParseFormat);

const model = modelsData;

function Page() {
  const { profile } = UserAuth() as any;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const params = useParams();

  const getData = async () => {
    setLoading(true);
    try {
      const res = await axiosApiInstance.get(
        `/api/wash-request?id=${params.id}`
      );
      setData({
        ...res.data,
        date: dayjs
          .utc(res.data.washDateAndTimeUTC)
          .local()
          .format("MM/DD/YYYY"),
        time: dayjs.utc(res.data.washDateAndTimeUTC).local().format("h:mm A"),
        address: JSON.parse(res.data.address),
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

  const openRateAndTipModal = () => {
    setShowModal(true);
  };

  const rateAndTip = async (data: any) => {
    setLoading(true);
    try {
      axiosApiInstance.put(
        `/api/wash-request/payment/rate-tip?id=${params.id}`,
        {
          ...data,
        }
      );
      message.success("Feedback Received. Thank you.");
      setShowModal(false);
      window.location.reload();
    } catch (err) {
      console.log(err);
      message.error("Something went wrong.");
    }
  };

  const onUpdateRateAndTip = (
    rating: any,
    tips: any,
    tipId?: any,
    tipAmount?: any
  ) => {
    if (rating <= 0) {
      message.error("Please rate the wash.");
      return;
    }
    if (tips <= 0) {
      rateAndTip({
        rating: rating,
      });
    } else if (tipId && tipAmount) {
      rateAndTip({
        rating: rating,
        tipPaid: true,
        tipStripeId: tipId,
        tipAmount: tipAmount,
      });
      // set
    }
  };

  useEffect(() => {
    if (params.id) {
      getData();
    }
  }, []);

  return (
    <>
      <Loading show={loading} />
      <RateTipMode
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={onUpdateRateAndTip}
        setLoading={setLoading}
        customer={data?.customer}
      />
      <div className="min-h-screen  bg-secondary-color p-6 relative">
        {data &&
          data.washStatus === WashStatus.COMPLETED &&
          data.paymentStatus === PaymentStatus.PAID && (
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
              openRateAndTipModal={openRateAndTipModal}
            />
          )}
      </div>
    </>
  );
}

export default withoutAuth(Page);
