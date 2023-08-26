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
import Link from "next/link";

export default function Login() {
  const [inputValues, setInputValues] = useState({
    email: "",
    password: "",
  });

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleGoogleLogin = () => {};
  const handleFacebookLogin = () => {};
  const handleTwitterLogin = () => {};
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-secondary-color px-24 py-12 max-md:px-2">
      <Card className="p-10 w-[800px] max-md:w-full max-md:p-5">
        <div>
          <Image src={Logo} alt="wash-my-t-pro" className="mx-auto mb-10" />
          <p className="heading-1 text-center mb-5 max-md:text-md">
            LOG IN TO YOUR WASH PRO ACCOUNT
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
            className="mb-14"
          />
          <Link href={"/user/dashboard"}>
            <Button onClick={() => console.log("testing")}>Login</Button>
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-sm	text-primary-color mt-6">
            Tesla Owner?{" "}
            <span className="cursor-pointer text-primary-gray">Click Here</span>
          </p>
          <p className="paragraph-1 opacity-70 my-3">- Or sign in with -</p>
          <div className="flex items-center w-80 justify-around mb-8 mt-4">
            <SocialButton onClick={handleGoogleLogin}>
              <Image src={GoogleIcon} alt="login-google" className="mx-auto" />
            </SocialButton>
            <SocialButton onClick={handleFacebookLogin}>
              <Image
                src={FacebookIcon}
                alt="login-facebook"
                className="mx-auto"
              />
            </SocialButton>
            <SocialButton onClick={handleTwitterLogin}>
              <Image
                src={TwitterIcon}
                alt="login-twitter"
                className="mx-auto"
              />
            </SocialButton>
          </div>
          <p className="paragraph-1 ">
            Don&apost Have a Wash Pro Account?{" "}
            <Link href={"/onboard-user"}>
              <span className="cursor-pointer text-primary-color">Sign Up</span>
            </Link>
          </p>
        </div>
      </Card>
    </main>
  );
}
