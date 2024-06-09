import stripe from "@/app/lib/stripe";
import { sendSms } from "@/app/lib/twilio";
import { stripeCharges, washerCut } from "@/contants";
import { PaymentStatus, PrismaClient, WashStatus } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(request: any) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const res = await request.json();

  if (!res.rating) {
    return NextResponse.json(
      { message: "Missing some fields" },
      { status: 400 }
    );
  }

  try {
    const washRequest = await prisma.washRequest.findUnique({
      where: {
        id: id as string,
      },
    });

    if (!washRequest) {
      throw new Error("Wash request not found");
    }

    const customer = await prisma.customer.findUnique({
      where: {
        id: washRequest.customerId,
      },
    });

    const washer = await prisma.userProfile.findUnique({
      where: {
        userId: washRequest.washerId || "",
      },
    });

    if (!customer) {
      throw new Error("Customer not found");
    }

    if (!washer) {
      throw new Error("Washer not assigned");
    }

    if (
      !washer.stripeAccountId ||
      !washer.chargesEnabled ||
      !washer.transfersEnabled
    ) {
      throw new Error("Stripe account not found");
    }

    if (!washRequest.chargedAmount) {
      throw new Error("Charged amount not found");
    }
    if (washRequest.washStatus !== WashStatus.COMPLETED) {
      throw new Error("Wash request is not completed yet");
    }

    // const r = await prisma.washRequest.update({
    //   where: {
    //     id: id as string,
    //   },
    //   data: {
    //     rating: res.rating,
    //     tipPaid: res.tipPaid === true ? true : false,
    //     tipAmount: res.tipPaid === true ? res.tipAmount : null,
    //     tipStripeId: res.tipPaid === true ? res.tipStripeId : null,
    //   },
    // });

    // user only rated
    if (res.tipPaid) {
      await prisma.washRequest.update({
        where: {
          id: id as string,
        },
        data: {
          rating: res.rating,
          tipPaid: res.tipPaid === true ? true : false,
          tipAmount: res.tipPaid === true ? res.tipAmount : null,
          tipStripeId: res.tipPaid === true ? res.tipStripeId : null,
        },
      });

      const tipAmount = res.tipAmount;
      const stripeCharge = Math.round(tipAmount * stripeCharges);
      const receivedAmountTip = tipAmount - stripeCharge;
      const washerCu = Math.round(receivedAmountTip * washerCut);
      const ourCut = receivedAmountTip - washerCu;

      await prisma.washRequestLedger.update({
        where: {
          washRequestId: washRequest.id,
        },
        data: {
          tipAmount: tipAmount,
          tipStripeCharges: stripeCharge,
          tipReceivedAmount: ourCut,
          tipWasherCharges: washerCu,
        },
      });

      await stripe.transfers.create({
        amount: washerCu, //convert to cents
        currency: "usd",
        destination: washer.stripeAccountId,
      });

      await sendSms(
        washer.phoneNumber as string, //set customer number here later, rightnow hardcoding mine
        `Hi ${washer.name},
      \n\n
      Wash request have been reviewed and tip of $${
        washerCu / 100
      } has been added by the customer.
      \n\n\n
      https://app.washmyt.com/user/wash-detail/${washRequest.id}
      \n\n- WashMyT Team`
      );
    } else {
      await prisma.washRequest.update({
        where: {
          id: id as string,
        },
        data: {
          rating: res.rating,
        },
      });

      await sendSms(
        washer.phoneNumber as string, //set customer number here later, rightnow hardcoding mine
        `Hi ${washer.name}, \n\nWash request have been reviewed by the customer.\n\n\nhttps://app.washmyt.com/user/wash-detail/${washRequest.id} \n\n- WashMyT Team`
      );
    }
    // user rated and tipped

    return NextResponse.json({ message: "Rating and tip added" });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 400 }
    );
  }
}
