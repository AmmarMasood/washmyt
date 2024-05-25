"use client";

import Button from "../../../components/Button";
import { ChangeEvent, useCallback, useRef, useState } from "react";
import Card from "../../../components/Card";
import StepperBar from "@/app/components/StepperBar";
import Select from "@/app/components/Select";
import UploadImage from "@/app/components/UploadImage";
import { storage } from "@/app/lib/firebase";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { UserAuth } from "@/app/context/AuthContext";
import axiosApiInstance from "@/app/utils/axiosClient";
import { useRouter } from "next/navigation";
import { message } from "antd";
import posthog from "posthog-js";
import { onboardingEvents } from "@/app/providers/posthog_events";
import StripeImage from "../../../../../public/imgs/pngegg.png";
import Image from "next/image";
import stripe from "../../../lib/stripe";

export default function FifthPart() {
  const { profile, user, setLoading, getUser } = UserAuth() as any;
  const router = useRouter();
  const profileRef = useRef(profile);
  profileRef.current = profile;

  const [inputValues, setInputValues] = useState({
    businessInsurance: profile.ownInsurance === false ? "no" : "yes",
  });
  const [file, setFile] = useState(null);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const updateData = async (file: File) => {
    if (!file) return;

    try {
      const fileRef = ref(storage, `${profile.userId}/insurance/${file.name}`);
      const uploadTask = await uploadBytes(fileRef, file);
      const link = await getDownloadURL(uploadTask.ref);
      return link;
    } catch (error) {
      console.log(error);
      message.error("Unable to upload file. Please try again.");
    }
  };

  const onUpload = (file: any) => {
    setFile(file[0]);
  };

  const verifyFields = () => {
    if (inputValues.businessInsurance === "yes" && !file) {
      return false;
    }
    return true;
  };

  const handleStripeRedirect = useCallback(async () => {
    // first make an api call to stripe to create a connected account of type express
    const stripeAccount = await stripe.accounts.create(
      {
        type: "express",
        email: profile.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: "individual",
        individual: {
          email: profile.email,
        },
        business_profile: {
          mcc: "7299",
          name: profile.businessName,
          url: profile.website,
          support_email: profile.email,
          support_phone: `+1${profile.phoneNumber}`,
        },
        default_currency: "usd",
      },
      {
        apiKey: process.env.NEXT_PUBLIC_STRIPE_PROD_SECRET,
      }
    );

    console.log("stripeAccount", stripeAccount);

    // create a link using stripe id, to redirect the user to stripe onboarding
    const accountLink = await stripe.accountLinks.create(
      {
        account: stripeAccount.id,
        refresh_url: `https://washmyt.vercel.app/user/profile`,
        return_url: `https://washmyt.vercel.app/user/profile`,
        type: "account_onboarding",
        collect: "eventually_due",
      },
      {
        apiKey: process.env.NEXT_PUBLIC_STRIPE_PROD_SECRET,
      }
    );

    console.log("accountLink", accountLink);
    // save the stripe id in the user profile
    await axiosApiInstance.post("/api/onboard/complete-profile", {
      stripeAccountId: stripeAccount.id,
    });

    // redirect the user to stripe onboarding
    window.open(accountLink.url, "_blank")?.focus();
  }, []);

  const onClickNext = async () => {
    if (!verifyFields()) {
      message.error("Please fill all the required fields.");
      return;
    }
    setLoading(true);

    const link =
      typeof file === "string" ? file : await updateData(file as any);
    try {
      await axiosApiInstance.post("/api/onboard/complete-profile", {
        ownInsurance: inputValues.businessInsurance === "yes" ? true : false,
        insuranceImage: inputValues.businessInsurance === "yes" ? link : "",
        // onboardingCompleted: true,
      });
      posthog.capture(onboardingEvents.ONBOARDING_COMPLETED, {
        email: profile?.email,
      });
      await getUser(true);

      handleStripeRedirect();
      // router.push("/user/profile");
    } catch (error) {
      console.log(error);
      message.error("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="max-md:w-full">
      <Card className="p-12 w-[800px] max-md:w-full max-md:p-6">
        <>
          <StepperBar current={4} total={5} />
          <div className="p-4 mt-4">
            <Select
              name="businessInsurance"
              label="Does your business have General Liability insurance?"
              placeholder="yes"
              onChange={handleOnChange}
              value={inputValues.businessInsurance}
              className="mt-8"
              options={[
                {
                  id: "yes",
                  value: "yes",
                },
                {
                  id: "no",
                  value: "no",
                },
              ]}
            />

            <UploadImage
              file={file}
              label="Please take a photo of your insurance"
              onUpload={onUpload}
              className="mt-8"
            />

            <div className="flex text-black bg-primary-color/10 p-3 rounded-lg mt-6">
              <p className="text-primary-gray text-md">
                We use Stripe to make sure you get paid on time and to keep your
                personal bank and details secure. Click Save and continue to set
                up your payments on Stripe.
              </p>

              <Image src={StripeImage} alt="Stripe" />
            </div>

            <Button
              disabled={false}
              onClick={onClickNext}
              className="mt-10 !text-white"
            >
              Save and Continue
            </Button>
          </div>
        </>
      </Card>
    </div>
  );
}
