"use client";

import Image from "next/image";
import React from "react";
import PaymentPageImage from "../../../../../public/imgs/payment-page.svg";

function Payment() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-secondary-color px-24 py-12 relative">
      <Image src={PaymentPageImage} alt="payment" />
    </main>
  );
}

export default Payment;
