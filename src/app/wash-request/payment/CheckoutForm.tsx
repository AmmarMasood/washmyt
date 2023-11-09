"use client";

import Button from "@/app/components/Button";
import FormField from "@/app/components/FormField";
import Loading from "@/app/components/Loading";
import { PaymentStatus } from "@/app/types/interface";
import axiosApiInstance from "@/app/utils/axiosClient";
import {
  Elements,
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { message } from "antd";

import React, { useEffect, useRef, useState } from "react";

function CheckoutForm({
  id,
  paymentConfirmed,
  applyCoupon,
  couponApplied,
  couponInformation,
}: any) {
  const [isProcessing, setProcessing] = useState(false);
  const [showPaymentElement, setShowPaymentElement] = useState(true);
  const [couponCode, setCouponCode] = useState<any>("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<any>("");
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (paymentConfirmed) {
      setShowPaymentElement(false);
      setSuccess(true);
    }
  }, []);
  const handleSubmit = async () => {
    if (!stripe || !elements) {
      return;
    }
    setProcessing(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      setError(error.message);
      message.error("Unable to process payment");
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      console.log(paymentIntent);
      // const invoie = await stripe.upda
      setSuccess(true);
      setShowPaymentElement(false);
      await onPaymentConfirmation(paymentIntent.id, paymentIntent.amount);
    } else {
      message.error("Unable to process payment");
    }
    setProcessing(false);
  };

  const onPaymentConfirmation = async (paymentId: string, amount: any) => {
    const b = {
      stripeId: paymentId,
      chargedAmount: amount,
    } as any;
    if (couponApplied && couponInformation) {
      b.couponId = couponInformation.id;
    }
    try {
      await axiosApiInstance.put(
        `/api/wash-request/payment/complete?id=${id}`,
        b
      );
      message.success("Payment successful");
    } catch (error) {
      console.log(error);
      message.error("Unable to update wash request");
    }
  };

  return (
    <>
      <div>
        {showPaymentElement && (
          <>
            <PaymentElement />
            {error && <p className="my-4 text-red-500 text-md">{error}</p>}
            <FormField
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Coupon Code"
              disabled={couponApplied}
              className={`w-full mt-4`}
              label=""
              type="text"
              postField={
                <span
                  className="text-primary-color !cursor-pointer"
                  style={{
                    opacity: couponApplied ? "0" : "1",
                  }}
                  onClick={() => {
                    if (couponApplied) return;
                    applyCoupon(couponCode);
                  }}
                >
                  Apply
                </span>
              }
            />
          </>
        )}

        <Button
          disabled={isProcessing || success}
          onClick={handleSubmit}
          className={`mt-4`}
          style={{
            backgroundColor: success ? "#4CAF50 !important" : "",
          }}
        >
          {isProcessing
            ? "Processing..."
            : success
            ? "Payment Complete"
            : "Pay"}
        </Button>
      </div>
    </>
  );
}

export default CheckoutForm;
