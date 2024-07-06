"use client";

import React, { useEffect, useState } from "react";
import { message } from "antd";
import { withAuth } from "@/app/hoc/withAuth";
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
import { WashDetailAccessType } from "@/app/types/interface";
import { WashStatus } from "@prisma/client";
import { convertFromCent } from "@/app/utils/helpers";
import RescheduleModal from "../../components/RescheduleModal";
import posthog from "posthog-js";
import {
  washRequestEvents,
  washRequestInterations,
} from "@/app/providers/posthog_events";
import WasherChat from "@/app/components/WasherChat/WasherChat";

dayjs.extend(utc);
dayjs.extend(customParseFormat);

const model = modelsData;

function Page() {
  const { profile, user } = UserAuth() as any;
  const [loading, setLoading] = useState(false);
  const [rescheduleModal, setRescheduleModal] = useState(false);
  const [data, setData] = useState<any>(null);
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
        isNotWashTime: dayjs.utc(res.data.washDateAndTimeUTC).local().isAfter(),
      });
    } catch (error) {
      console.log(error);
      message.error("Unable to get data");
    }
    setLoading(false);
  };

  const onAcceptRequest = async () => {
    setLoading(true);
    try {
      await axiosApiInstance.get(
        `/api/user/wash-request/accept?id=${params.id}`
      );
      posthog.capture(washRequestInterations.WASH_ACCEPTED, {
        acceptedBy: profile.userId,
        requestId: params.id,
      });
      message.success("Request accepted successfully");
      message.info(
        "We have notified the customer. Please wait for the customer to confirm the request."
      );
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    } catch (error: any) {
      console.log;
      message.error(
        error?.response?.data?.message || "Unable to accept request"
      );
    }
    setLoading(false);
  };

  const onCompleteRequest = async () => {
    setLoading(true);
    try {
      await axiosApiInstance.get(
        `/api/user/wash-request/complete?id=${params.id}`
      );
      posthog.capture(washRequestInterations.WASH_COMPLETED, {
        completedBy: profile.userId,
        requestId: params.id,
      });
      message.success("Completed successfully");
      window.location.reload();
    } catch (error) {
      console.log(error);
      message.error("Unable to complete request");
    }
    setLoading(false);
  };

  const onStartRequest = async () => {
    setLoading(true);
    try {
      await axiosApiInstance.get(
        `/api/user/wash-request/start?id=${params.id}`
      );
      posthog.capture(washRequestInterations.WASH_STARTED, {
        startedBy: profile.userId,
        requestId: params.id,
      });
      message.success("Started successfully");
      window.location.reload();
    } catch (error) {
      console.log(error);
      message.error("Unable to start request");
    }
    setLoading(false);
  };

  const updateUser = async (data: any) => {
    try {
      const res = await axiosApiInstance.put(
        `/api/user/wash-request?id=${params.id}`,
        data
      );
      return res.data;
    } catch (error) {
      console.log(error);
      message.error("Unable to update user");
    }
  };

  const uploadBeforeImage = async (files: any[]) => {
    setLoading(true);
    if (files.length <= 0 || !params.id) return;

    try {
      const fileRef = ref(
        storage,
        `${profile.userId}/washes/${params.id}/before`
      );
      const uploadTask = await uploadBytes(fileRef, files[0]);
      const link = await getDownloadURL(uploadTask.ref);
      await updateUser({ beforePhoto: link });
      getData();
    } catch (error) {
      console.log(error);
      message.error("Unable to upload file. Please try again.");
    }
    setLoading(false);
  };

  const uploadAfterImage = async (files: any[]) => {
    setLoading(true);
    if (files.length <= 0 || !params.id) return;

    try {
      const fileRef = ref(
        storage,
        `${profile.userId}/washes/${params.id}/after`
      );
      const uploadTask = await uploadBytes(fileRef, files[0]);
      const link = await getDownloadURL(uploadTask.ref);
      await updateUser({ afterPhoto: link });
      getData();
    } catch (error) {
      console.log(error);
      message.error("Unable to upload file. Please try again.");
    }
    setLoading(false);
  };

  const onCreateRescheduleRequest = async (date: any) => {
    setLoading(true);
    try {
      await axiosApiInstance.post(
        `/api/user/wash-request/reschedule/create?id=${params.id}`,
        {
          rescheduleDateAndTimeUTC: date,
        }
      );
      posthog.capture(washRequestInterations.WASH_RESCHEDULE_INITIATED, {
        initiatedBy: profile.userId,
        requestId: params.id,
      });
      message.success("Reschedule request created successfully");
      setRescheduleModal(false);
    } catch (error: any) {
      console.log(error.response.data.message);
      message.error(
        error.response.data.message || "Unable to create reschedule request"
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    if (params.id) {
      getData();
    }
  }, []);

  // const initConversation = async () => {
  //   await client.createConversation({
  //     attributes: {},
  //     friendlyName: "new conversation",
  //     uniqueName: "new conversation",
  //   });
  // };

  // useEffect(() => {
  //   initConversation();
  // }, []);

  return (
    <>
      <Loading show={loading} />
      <RescheduleModal
        open={rescheduleModal}
        onClose={() => setRescheduleModal(false)}
        onSubmit={(value: any) => {
          onCreateRescheduleRequest(value);
        }}
      />
      <div className="min-h-screen  bg-secondary-color p-6 relative max-md:p-0">
        <Layout currentOption={0}>
          {data && (
            <WashRequestDetail
              accessType={WashDetailAccessType.USER}
              modelDetail={model.filter((m) => m.id === data.selectedModel)[0]}
              packageDetail={data.package}
              date={data.date}
              time={data.time}
              addressDetail={data.address}
              electricalAvailable={data.electricalHookupAvailable}
              waterAvailable={data.waterHookupAvailable}
              payoutDetail={data.package.price + (data.snowPackage ? 79 : 0)}
              receivedAmount={convertFromCent(data.chargedAmount)}
              receivedTip={convertFromCent(data.tipAmount)}
              customerDetail={data.customer}
              onAcceptRequest={onAcceptRequest}
              onCompleteRequest={onCompleteRequest}
              onStartRequest={onStartRequest}
              openRescheduleModal={() => setRescheduleModal(true)}
              washerDetail={data.washer}
              washId={params.id as string}
              onUploadBeforeImage={uploadBeforeImage}
              onUploadAfterImage={uploadAfterImage}
              beforePhoto={data.beforePhoto}
              afterPhoto={data.afterPhoto}
              washStatus={data.washStatus}
              paymentStatus={data.paymentStatus}
              rating={data.rating}
              isNotWashTime={data.isNotWashTime}
              snowPackage={data.snowPackage}
              ledger={data.ledger}
            />
          )}

          {data?.washStatus === WashStatus.ACCEPTED &&
            data?.washer?.userId === user?.uid && (
              <div>
                <WasherChat
                  washId={params.id as string}
                  userEmail={data?.washer?.email}
                  customerName={data?.customer?.name}
                />
              </div>
            )}
        </Layout>
      </div>
    </>
  );
}

export default withAuth(Page);
