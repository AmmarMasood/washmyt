"use client";

import Image from "next/image";
import Button from "../components/Button";
import FormField from "../components/FormField";
import { ChangeEvent, useState } from "react";
import Card from "../components/Card";
import Logo from "../../../public/imgs/logo.svg";
import SocialButton from "../components/SocialButton";
// icons
import TwitterIcon from "../../../public/imgs/twitter-icon.svg";
import FacebookIcon from "../../../public/imgs/facebook-icon.svg";
import GoogleIcon from "../../../public/imgs/google-icon.svg";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserAuth } from "../context/AuthContext";
import { mapAuthCodeToMessage } from "../utils/firebase-errors";
import axios from "axios";
import axiosApiInstance from "../utils/axiosClient";
import { withoutAuth } from "../hoc/withoutAuth";
import Loading from "../components/Loading";

function OnboardUser() {
  const [inputValues, setInputValues] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    loading: false,
    error: "",
  });
  const {
    googleSignIn,
    emailPasswordSignup,
    sendVerificationEmail,
    initializeUserProfile,
    setToken,
  } = UserAuth() as any;
  const router = useRouter();

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateEmailPassowrd = () => {
    if (!inputValues.email || !inputValues.password) {
      setInputValues((prev) => ({
        ...prev,
        error: "Please enter email and password",
      }));
      return false;
    }
    if (inputValues.password !== inputValues.confirmPassword) {
      setInputValues((prev) => ({
        ...prev,
        error: "Please make sure that passwords match",
      }));
      return false;
    }
    return true;
  };

  const initProfile = async (
    email: string,
    userId: string,
    photoUrl?: string
  ) => {
    try {
      await initializeUserProfile(userId, email, photoUrl);
    } catch (err) {
      setInputValues((prev) => ({
        ...prev,
        error: "Something went wrong, please try again",
      }));
    }
  };

  const handleEmailPasswordSignup = async () => {
    if (validateEmailPassowrd()) {
      setInputValues((prev) => ({ ...prev, error: "", loading: true }));
      try {
        const res = await emailPasswordSignup(
          inputValues.email,
          inputValues.password
        );
        await sendVerificationEmail();
        await initProfile(res.user.email, res.user.uid);
        await setToken(res.user.accessToken);
        router.push("/onboard-user/getting-started");
      } catch (error: any) {
        const err = mapAuthCodeToMessage(error?.message as any);
        setInputValues((prev) => ({ ...prev, error: err }));
      }
      setInputValues((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleGoogleSignup = async () => {
    setInputValues((prev) => ({ ...prev, loading: true }));
    try {
      const res = await googleSignIn();
      await initProfile(res.user.email, res.user.uid, res.user.photoURL);
      await setToken(res.user.accessToken);
      router.push("/onboard-user/getting-started");
    } catch (error: any) {
      const err = mapAuthCodeToMessage(error?.message as any);
      setInputValues((prev) => ({ ...prev, error: err }));
    }
    setInputValues((prev) => ({ ...prev, loading: false }));
  };
  return (
    <>
      <Loading show={inputValues.loading} />
      <main className="flex min-h-screen flex-col items-center justify-center bg-secondary-color px-24 py-12 max-md:px-2">
        <Card className="p-10 w-[800px] max-md:w-full max-md:p-5">
          <div>
            <Image src={Logo} alt="wash-my-t-pro" className="mx-auto mb-10" />
            <p className="heading-1 text-center mb-5 max-md:text-md">
              CREATE YOUR WASH PRO ACCOUNT
            </p>
            <FormField
              value={inputValues.email}
              onChange={handleOnChange}
              name="email"
              type="text"
              label="Email"
              placeholder="Email"
              className="mb-7"
            />
            <FormField
              value={inputValues.password}
              onChange={handleOnChange}
              name="password"
              type="password"
              label="Password"
              placeholder="Password"
              className="mb-7"
            />
            <FormField
              value={inputValues.confirmPassword}
              onChange={handleOnChange}
              name="confirmPassword"
              type="password"
              label="Re-type Password"
              placeholder="Confirm Password"
              className="mb-14"
            />
            {inputValues.error && (
              <p
                style={{
                  textAlign: "center",
                  color: "red",
                  marginTop: "-50px",
                  marginBottom: "20px",
                }}
              >
                {inputValues.error}
              </p>
            )}
            <Button
              onClick={handleEmailPasswordSignup}
              disabled={inputValues.loading}
              className="!text-white"
            >
              Sign Up
            </Button>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm	text-primary-color mt-6">
              Tesla Owner?{" "}
              <Link href={"/wash-request"}>
                <span className="cursor-pointer text-primary-gray">
                  Book a wash here.
                </span>
              </Link>
            </p>
            <p className="paragraph-1 opacity-70 my-3">- Or sign up with -</p>
            <div className="flex items-center w-80 justify-around mb-8 mt-4">
              <SocialButton onClick={handleGoogleSignup}>
                <Image
                  src={GoogleIcon}
                  alt="signup-google"
                  className="mx-auto"
                />
              </SocialButton>
            </div>
            <p className="paragraph-1 ">
              Already have a Wash Pro Account?{" "}
              <Link href={"/login"}>
                <span className="cursor-pointer text-primary-color">Login</span>
              </Link>
            </p>
          </div>
        </Card>
      </main>
    </>
  );
}

export default withoutAuth(OnboardUser);
