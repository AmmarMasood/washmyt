import Button from "@/app/components/Button";
import Modal from "@/app/components/Modal";
import React, { useEffect, useState } from "react";
import { Rate } from "antd";
import FormField from "@/app/components/FormField";
import { loadStripe } from "@stripe/stripe-js";
import axiosApiInstance from "@/app/utils/axiosClient";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/app/wash-request/payment/CheckoutForm";
import TipPayment from "./TipPayment";

function RateTipMode({ show, onClose, onSave, setLoading, customer }: any) {
  const [ratings, setRatings] = useState(0);
  const [tips, setTips] = useState("0");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [stripePromise, setStripePromise] = useState<any>(null);
  const [stripeSecret, setStripeSecret] = useState<any>(null);

  useEffect(() => {
    return () => {
      setStripePromise(null);
      setStripeSecret(null);
      setShowPaymentForm(false);
    };
  }, []);

  const handleStripeInit = async () => {
    setLoading(true);
    const s = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY as string);
    setStripePromise(s);
    setLoading(false);
  };

  const getPaymentIntent = async (price: any) => {
    setLoading(true);
    const res = await axiosApiInstance.post("/api/wash-request/payment", {
      amount: parseFloat((price * 100).toFixed(2)), // in cents because of stripe
      customer: customer.stripeId,
    });
    setStripeSecret(res.data.clientSecret);
    setLoading(false);
  };

  const handleStripeConfig = () => {
    if (tips !== "0") {
      const tip = parseFloat(tips);
      handleStripeInit();
      getPaymentIntent(tip);
      setShowPaymentForm(true);
    } else {
      onSave(ratings, tips);
    }
  };

  const onPaymentConfirmed = (id: any, amount: any) => {
    onSave(ratings, tips, id, amount);
  };

  const tipsDetails = [
    { value: "0", name: "No Tip" },
    { value: "10", name: "$ 10" },
    { value: "20", name: "$ 20" },
    { value: "50", name: "$ 50" },
  ];

  return (
    <Modal
      title=""
      show={show}
      onClose={onClose}
      onConfirm={onClose}
      showCloseButton={true}
    >
      {showPaymentForm && stripeSecret && stripePromise ? (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret: stripeSecret,
          }}
          key={stripeSecret}
        >
          <TipPayment onPaymentConfirmed={onPaymentConfirmed} />
        </Elements>
      ) : (
        <>
          <h1 className="text-lg font-bold text-center">Rate & Tip</h1>
          <div className="text-center mt-6 mb-2">
            <p className="text-sm text-primary-gray text-left">ADD TIP</p>
            <div className="grid grid-cols-5 gap-2 items-center mt-4 bg-primary-gray/[0.05] rounded-lg px-2">
              {tipsDetails.map((item, key) => (
                <span
                  className={`${
                    tips === item.value && "bg-primary-color text-white"
                  } font-semibold text-lg text-primary-gray text-center py-2 rounded-lg cursor-pointer`}
                  key={key}
                  onClick={() => setTips(item.value)}
                >
                  {item.name}
                </span>
              ))}
              <span
                className={` font-semibold text-lg text-primary-gray text-center py-2 rounded-lg cursor-pointer`}
                key={tipsDetails.length + 10}
              >
                <FormField
                  label=""
                  value={tips}
                  className="font-semibold text-lg text-primary-gray -mt-2"
                  type="number"
                  onChange={(e: any) => setTips(e.target.value)}
                />
              </span>
            </div>
          </div>
          <div className="text-center mt-6">
            <p className="text-sm text-primary-gray text-left">RATE HERE</p>
            <Rate
              onChange={(s) => setRatings(s)}
              style={{
                fontSize: "60px",
              }}
            />
          </div>
          <Button
            onClick={handleStripeConfig}
            className="text-white text-sm font-semibold bg-primary-color w-full mt-4"
            disabled={false}
          >
            Done
          </Button>
        </>
      )}
    </Modal>
  );
}

export default RateTipMode;
