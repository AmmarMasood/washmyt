"use client";

import Card from "@/app/components/Card";
import React from "react";
import ApplePay from "../../../../public/imgs/apple-pay.svg";
import Image from "next/image";
import FormField from "@/app/components/FormField";
import Button from "@/app/components/Button";
import MasterCard from "../../../../public/imgs/master-card.svg";
import ModalS from "../../../../public/imgs/big-model-x.svg";
import Checkmark from "../../../../public/imgs/checkmark.svg";
import InfoAlert from "../../../../public/imgs/info-alert.svg";
import LogoIcon from "../../../../public/imgs/logo-icon.svg";

function Payment() {
  const [payment, setPayment] = React.useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    discountCode: "",
  });

  const handleOnChange = (e: any) => {
    setPayment({
      ...payment,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-secondary-color px-12 py-12 relative max-md:p-2">
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
          <div>
            <h1 className="text-[#1E1E1E] text-2xl font-semibold">
              Ready for Payment
            </h1>
            <p className="text-primary-gray font-normal text-md mb-6">
              To move forward with your (wash/detail), please make payment in
              the next 24 hours.
            </p>
            <Image alt="apply-pay" src={ApplePay} />
            <div className="mt-4">
              <FormField
                label="Card Number"
                onChange={handleOnChange}
                name="cardNumber"
                value={payment.cardName}
                type="text"
                className="mb-3"
                placeholder="0000 0000 0000 0000"
                postField={
                  <Image src={MasterCard} alt="master-card" className="h-6" />
                }
              />
              <div className="mb-3 flex items-center w-full">
                <FormField
                  label="Expiry date"
                  onChange={handleOnChange}
                  name="expiryDate"
                  value={payment.expiryDate}
                  type="text"
                  placeholder="MM / YY"
                  className="w-full mr-8"
                />
                <FormField
                  label="CVV"
                  onChange={handleOnChange}
                  name="cvv"
                  value={payment.cvv}
                  type="number"
                  placeholder="0 0 0"
                  className="w-full"
                />
              </div>
              <FormField
                label="Discount Code"
                onChange={handleOnChange}
                name="discountCode"
                value={payment.discountCode}
                type="text"
                placeholder="00-00-0"
                postField={
                  <span className="text-primary-color text-md cursor-pointer">
                    Apply
                  </span>
                }
              />
              <Button
                onClick={() => console.log("ammar")}
                className="mt-8 !text-white"
              >
                Pay Now
              </Button>
            </div>
          </div>
          <div className="bg-[#1E1E1E]/[0.05] rounded-3xl p-5 flex flex-col justify-between">
            <div className="flex max-md:flex-wrap">
              <div className="w-[300px] mb-4">
                <div>
                  <h1 className="text-primary-gray text-md whitespace-nowrap mb-4">
                    Package Selected: Premier Detail +
                  </h1>
                  <h1 className="text-[#1E1E1E] text-4xl font-bold mb-6">
                    $320.20
                  </h1>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gridTemplateRows: "1fr 1fr",
                    gridGap: "20px",
                  }}
                >
                  <p className="text-primary-gray text-md">Address</p>
                  <p className="text-primary-gray text-md">Electrical: Yes</p>
                  <p className="text-primary-gray text-md">12.06 PM</p>
                  <p className="text-primary-gray text-md">Water: Yes</p>
                </div>
              </div>
              <Image src={ModalS} alt="modal" />
            </div>
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <Image src={Checkmark} alt="checkmark" />
                <span className="text-lg text-[#1E1E1E] ml-4">
                  Tailored to Your Tesla
                </span>
              </div>
              <p className="text-primary-gray text-sm">
                WashMyT is designed with the Tesla owner in mind. We understand
                your vehicle&aposs specific needs and cater our services to
                match.
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
                We’ll worry about all the transactions and payment. You can sit
                back and relax while you make your clients happy.
              </p>
            </div>
            <div className="bg-[#1E1E1E] rounded-xl p-4 flex items-center">
              <Image src={InfoAlert} alt="info-alert" className="mr-2 h-12" />
              <span className="text-sm !text-white">
                We are committed to delivering a high-quality service every
                time. If you&aposre not happy with the results, we&aposll make
                it right, guaranteed.
              </span>
            </div>
          </div>
        </div>
      </Card>
    </main>
  );
}

export default Payment;
