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
import stripe from "../lib/stripe";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

function WashRequest() {
  const [content, setContent] = useState(0);
  const [requestValues, setRequestValues] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onNext = async (values: any, final: boolean) => {
    if (final) {
      delete requestValues.washD;
      delete requestValues.washT;
      delete values.washD;
      delete values.washT;
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

  const goBack = () => {
    if (content === 0) {
    } else {
      setContent((prev) => prev - 1);
    }
  };

  const createCustomer = async (values: any) => {
    let d: any = {
      name: values.customerName,
      email: values.customerEmail,
      phoneNumber: `+1${values.customerPhoneNumber}`,
    };
    try {
      const stripeCustomer = await stripe.customers.create(
        {
          email: d.email,
          phone: d.phoneNumber,
          name: d.name,
        },
        {
          apiKey: process.env.NEXT_PUBLIC_STRIPE_SECRET,
        }
      );
      d.stripeId = stripeCustomer.id;
      const res = await axiosApiInstance.post("/api/customer", d);
      return res.data.customer.id;
    } catch (error) {
      console.log(error);
      message.error("Unable to create customer");
      throw error;
    }
  };

  const saveWashRequest = async (requestValues: any) => {
    setLoading(true);
    try {
      const customer = await createCustomer(requestValues);
      const d = {
        ...requestValues,
        customerId: customer,
      };
      delete d.customerName;
      delete d.customerEmail;
      delete d.customerPhoneNumber;
      const res = await axiosApiInstance.post("/api/wash-request", d);
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
        {/* {content > 0 && (
          <div className="w-full text-left mb-6">
            <span
              className="text-primary-color font-md  cursor-pointer"
              onClick={goBack}
            >
              Back
            </span>
          </div>
        )} */}
        <GoogleReCaptchaProvider
          reCaptchaKey={process.env.NEXT_PUBLIC_GOOGLE_CAPTCHA_KEY as string}
        >
          {content === 0 && <PartOne onNext={onNext} />}
          {content === 1 && (
            <PartTwo onNext={onNext} onBack={goBack} values={requestValues} />
          )}
          {content === 2 && (
            <PartThree onNext={onNext} onBack={goBack} values={requestValues} />
          )}
          {content === 3 && (
            <PartFive onNext={onNext} onBack={goBack} values={requestValues} />
          )}
          {content === 4 && (
            <PartFour onNext={onNext} onBack={goBack} values={requestValues} />
          )}

          {content === 5 && (
            <PartSix onNext={onNext} onBack={goBack} values={requestValues} />
          )}
          {content === 6 && (
            <PartSeven onNext={onNext} onBack={goBack} values={requestValues} />
          )}
          {content === 7 && (
            <PartEight onNext={onNext} onBack={goBack} values={requestValues} />
          )}
          {content === 8 && (
            <PartNine onNext={onNext} onBack={goBack} values={requestValues} />
          )}
          {content === 9 && (
            <PartTen onNext={onNext} onBack={goBack} values={requestValues} />
          )}
        </GoogleReCaptchaProvider>
      </main>
    </>
  );
}

export default WashRequest;
