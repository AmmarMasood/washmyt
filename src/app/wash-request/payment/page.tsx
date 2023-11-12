"use client";

import Card from "@/app/components/Card";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import ModalS from "../../../../public/imgs/big-model-x.svg";
import Checkmark from "../../../../public/imgs/checkmark.svg";
import InfoAlert from "../../../../public/imgs/info-alert.svg";
import LogoIcon from "../../../../public/imgs/logo-icon.svg";
import { loadStripe } from "@stripe/stripe-js";
import axiosApiInstance from "@/app/utils/axiosClient";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { useSearchParams } from "next/navigation";
import { message } from "antd";
import Loading from "@/app/components/Loading";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { modelsData } from "@/app/utils/static-data";
import { withoutAuth } from "@/app/hoc/withoutAuth";
import { PaymentStatus, WashStatus } from "@/app/types/interface";

dayjs.extend(utc);
dayjs.extend(customParseFormat);

function Payment() {
  const query = useSearchParams();
  const id = query.get("wash");

  const [loading, setLoading] = useState(false);
  const [stripePromise, setStripePromise] = useState<any>(null);
  const [stripeSecret, setStripeSecret] = useState<any>(null);
  const [washInfo, setWashInfo] = useState<any>(null);
  const [couponApplied, setCouponApplied] = useState<any>(false);
  const [couponInformation, setCouponInformtion] = useState(null);

  const handleStripeInit = async () => {
    const s = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY as string);
    setStripePromise(s);
  };

  const getPaymentIntent = async (price: any, customer: any) => {
    const res = await axiosApiInstance.post("/api/wash-request/payment", {
      amount: parseFloat((price * 100).toFixed(2)), // in cents because of stripe
      customer: customer.stripeId,
    });
    setStripeSecret(res.data.clientSecret);
  };

  const getRequestInfo = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await axiosApiInstance.get("/api/wash-request?id=" + id);
      setWashInfo({
        ...res.data,
        address: JSON.parse(res.data.address),
        modelImage: modelsData.find(
          (model) => model.id === res.data.selectedModel
        )?.img,
        washDateAndTimeUTC: dayjs
          .utc(res.data.washDateAndTimeUTC)
          .local()
          .format("MM/DD/YY h:mm A"),
        package: {
          ...res.data.package,
          price:
            res.data.paymentStatus === PaymentStatus.PAID
              ? res.data.chargedAmount / 100
              : res.data.package.price + res.data.snowPackage,
        },
      });
      if (res.data.paymentCompleted) {
        setLoading(false);
        return;
      }
      let price = res.data.package.price;
      if (res.data.snowPackage === true) {
        price = price + 79;
      }
      await getPaymentIntent(price, res.data.customer);
      await handleStripeInit();
    } catch (error) {
      console.log(error);
      message.error("Unable to get wash request");
    }
    setLoading(false);
  };

  const applyCoupon = async (value: string) => {
    setLoading(true);
    try {
      const res = await axiosApiInstance.get(`/api/coupon?name=${value}`);
      if (res.data.isValid) {
        const newPrice = parseFloat(
          (
            washInfo.package.price -
            washInfo.package.price * res.data.discountPercentage
          ).toFixed(2)
        );
        setWashInfo((prev: any) => ({
          ...prev,
          package: {
            ...prev.package,
            price: newPrice,
          },
        }));
        console.log(newPrice);

        await getPaymentIntent(newPrice, washInfo.customer);
        setCouponApplied(true);
        setCouponInformtion(res.data);
        message.success("Coupon applied!");
      } else {
        message.error("Invalid Coupon");
      }
    } catch (error) {
      console.log(error);
      message.error("Unable to apply coupon");
    }
    setLoading(false);
  };

  useEffect(() => {
    getRequestInfo();
  }, []);

  return (
    <>
      <Loading show={loading} />

      <main className="flex min-h-screen flex-col items-center justify-center bg-secondary-color px-12 py-12 relative max-md:p-2">
        {washInfo && (
          <Card className="py-8 px-14 rounded-3xl w-full relative max-md:p-10">
            <Image
              src={LogoIcon}
              alt="washmyt"
              className="absolute top-3 right-5"
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(550px, 1fr))",
                gridGap: "30px",
              }}
              className="mt-6 max-md:!flex max-md:flex-col max-md:items-center max-md:justify-center"
            >
              {washInfo.paymentCompleted ? (
                <p className="text-black text-xl font-bold text-center">
                  Payment Completed. Thank you!
                </p>
              ) : washInfo.washStatus === WashStatus.ACCEPTED &&
                washInfo.paymentStatus === PaymentStatus.UNPAID ? (
                <div>
                  <h1 className="text-[#1E1E1E] text-2xl font-semibold">
                    Ready for Payment
                  </h1>
                  <p className="text-primary-gray font-normal text-md mb-6">
                    To move forward with your (wash/detail), please make payment
                    in the next 24 hours.
                  </p>
                  {/* PAYMENT COMPONENT START */}
                  {stripePromise && stripeSecret && (
                    <Elements
                      stripe={stripePromise}
                      options={{
                        clientSecret: stripeSecret,
                      }}
                      key={stripeSecret}
                    >
                      <CheckoutForm
                        id={id}
                        paymentConfirmed={washInfo.paymentCompleted}
                        applyCoupon={applyCoupon}
                        couponApplied={couponApplied}
                        couponInformation={couponInformation}
                      />
                    </Elements>
                  )}
                  {/* PAYMENT COMPONENT END */}
                </div>
              ) : (
                <p className="text-black text-xl font-bold text-center">
                  Please wait for the wash pros to accept your request. We will
                  notify you once they accept.
                </p>
              )}
              <div className="bg-[#1E1E1E]/[0.05] rounded-3xl p-5 flex flex-col justify-between">
                <div className="flex max-md:flex-wrap">
                  <div className="w-[300px] mb-4">
                    <div>
                      <h1 className="text-primary-gray text-md whitespace-nowrap mb-4">
                        {washInfo?.package?.name.split("+")[0]}+
                      </h1>
                      <h1 className="text-[#1E1E1E] text-4xl font-bold mb-6">
                        $ {washInfo?.package?.price}{" "}
                        {washInfo.snowPackage && "+ $79"}
                      </h1>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr",
                        gridTemplateRows: "1fr",
                        gridGap: "10px",
                      }}
                    >
                      <p className="text-primary-gray text-md">
                        {washInfo?.address.formatted_address}
                      </p>
                      <p className="text-primary-gray text-md mt-4">
                        {washInfo?.washDateAndTimeUTC}
                      </p>

                      <p className="text-primary-gray text-md mt-4">
                        Snow Package:{" "}
                        {washInfo?.snowPackage === true ? "Yes" : "No"}
                      </p>
                      <p className="text-primary-gray text-md">
                        Electrical:{" "}
                        {washInfo?.electricalHookupAvailable === true
                          ? "Yes"
                          : "No"}
                      </p>

                      <p className="text-primary-gray text-md">
                        Water:{" "}
                        {washInfo?.waterHookupAvailable === true ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
                  <Image
                    src={washInfo?.modelImage}
                    alt="modal"
                    className="h-fit"
                  />
                </div>
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <Image src={Checkmark} alt="checkmark" />
                    <span className="text-lg text-[#1E1E1E] ml-4">
                      Tailored to Your Tesla
                    </span>
                  </div>
                  <p className="text-primary-gray text-sm">
                    WashMyT is designed with the Tesla owner in mind. We
                    understand your vehicle&aposs specific needs and cater our
                    services to match.
                  </p>
                </div>
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <Image src={Checkmark} alt="checkmark" />
                    <span className="text-lg text-[#1E1E1E] ml-4">
                      On-Demand Excellence
                    </span>
                  </div>
                  <p className="text-primary-gray text-sm">
                    We’ll worry about all the transactions and payment. You can
                    sit back and relax while you make your clients happy.
                  </p>
                </div>
                <div className="bg-[#1E1E1E] rounded-xl p-4 flex items-center">
                  <Image
                    src={InfoAlert}
                    alt="info-alert"
                    className="mr-2 h-12"
                  />
                  <span className="text-sm !text-white">
                    We are committed to delivering a high-quality service every
                    time. If you&apos;re not happy with the results, we&apos;ll
                    make it right, guaranteed.
                  </span>
                </div>
              </div>
            </div>
          </Card>
        )}
      </main>
    </>
  );
}

export default withoutAuth(Payment);
