"use client";

import { useState } from "react";
import PartOne from "./components/PartOne";
import PartTwo from "./components/PartTwo";
import PartThree from "./components/PartThree";
import PartFour from "./components/PartFour";
import PartTen from "./components/PartTen";
import PartNine from "./components/PartNine";
import PartSeven from "./components/PartSeven";
import PartSix from "./components/PartSix";
import PartFive from "./components/PartFive";
import PartEight from "./components/PartEight";
import { withoutAuth } from "../hoc/withoutAuth";
import axiosApiInstance from "../utils/axiosClient";
import { message } from "antd";
import Loading from "../components/Loading";
import { useRouter } from "next/navigation";

function WashRequest() {
  const [content, setContent] = useState(0);
  const [requestValues, setRequestValues] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onNext = async (values: any, final: boolean) => {
    if (final) {
      saveWashRequest({
        ...requestValues,
        ...values,
      });
      return;
    } else {
      setRequestValues((prev: any) => ({ ...prev, ...values }));
    }
    setContent((prev) => prev + 1);
  };

  const saveWashRequest = async (requestValues: any) => {
    setLoading(true);
    try {
      const res = await axiosApiInstance.post(
        "/api/wash-request",
        requestValues
      );
      router.push(`/wash-request/payment?wash=${res.data.requestId}`);
    } catch (error) {
      console.log(error);
      message.error("Unable to create wash request");
    }
    setLoading(false);
  };

  return (
    <>
      <Loading show={loading} />
      <main className="flex min-h-screen flex-col items-center justify-center bg-secondary-color px-24 py-12 relative max-md:p-2">
        {content === 0 && <PartOne onNext={onNext} />}
        {content === 1 && <PartTwo onNext={onNext} />}
        {content === 2 && <PartThree onNext={onNext} />}
        {content === 3 && <PartFour onNext={onNext} />}
        {content === 4 && <PartFive onNext={onNext} />}
        {content === 5 && <PartSix onNext={onNext} />}
        {content === 6 && <PartSeven onNext={onNext} />}
        {content === 7 && <PartEight onNext={onNext} />}
        {content === 8 && <PartNine onNext={onNext} />}
        {content === 9 && <PartTen onNext={onNext} />}
      </main>
    </>
  );
}

export default withoutAuth(WashRequest);
