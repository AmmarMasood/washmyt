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
import { useRouter } from "next/router";
import Link from "next/link";

export default function OnboardUser() {
  const [inputValues, setInputValues] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleGoogleSignup = () => {};
  const handleFacebookSignup = () => {};
  const handleTwitterSignup = () => {};
  return (
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
          <Link href={"/onboard-user/getting-started"}>
            <Button onClick={() => ""}>Sign Up</Button>
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-sm	text-primary-color mt-6">
            Tesla Owner?{" "}
            <span className="cursor-pointer text-primary-gray">Click Here</span>
          </p>
          <p className="paragraph-1 opacity-70 my-3">- Or sign up with -</p>
          <div className="flex items-center w-80 justify-around mb-8 mt-4">
            <SocialButton onClick={handleGoogleSignup}>
              <Image src={GoogleIcon} alt="signup-google" className="mx-auto" />
            </SocialButton>
            <SocialButton onClick={handleFacebookSignup}>
              <Image
                src={FacebookIcon}
                alt="signup-facebook"
                className="mx-auto"
              />
            </SocialButton>
            <SocialButton onClick={handleTwitterSignup}>
              <Image
                src={TwitterIcon}
                alt="signup-twitter"
                className="mx-auto"
              />
            </SocialButton>
          </div>
          <p className="paragraph-1 ">
            Already have a Wash Pro Account?{" "}
            <span className="cursor-pointer text-primary-color">Login</span>
          </p>
        </div>
      </Card>
    </main>
  );
}
