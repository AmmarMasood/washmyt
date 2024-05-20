"use client";

import Button from "@/app/components/Button";
import FormField from "@/app/components/FormField";
import Loading from "@/app/components/Loading";
import axiosApiInstance from "@/app/utils/axiosClient";
import {
  Elements,
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { message } from "antd";

import React, { useEffect, useRef, useState } from "react";

function TipPayment({ onPaymentConfirmed }: any) {
  const [isProcessing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<any>("");
  const stripe = useStripe();
  const elements = useElements();

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
      setSuccess(true);
      await onPaymentConfirmed(paymentIntent.id, paymentIntent.amount);
    } else {
      message.error("Unable to process payment");
    }
    setProcessing(false);
  };

  return (
    <>
      <div>
        <>
          <PaymentElement />
          {error && <p className="my-4 text-red-500 text-md">{error}</p>}
        </>

        <Button
          disabled={isProcessing || success}
          onClick={handleSubmit}
          className={`mt-4 !text-white`}
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

export default TipPayment;
