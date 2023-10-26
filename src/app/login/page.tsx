"use client";

import Image from "next/image";
import Button from "../components/Button";
import FormField from "../components/FormField";
import { ChangeEvent, useContext, useState } from "react";
import Card from "../components/Card";
import Logo from "../../../public/imgs/logo.svg";
import SocialButton from "../components/SocialButton";
// icons
import TwitterIcon from "../../../public/imgs/twitter-icon.svg";
import FacebookIcon from "../../../public/imgs/facebook-icon.svg";
import GoogleIcon from "../../../public/imgs/google-icon.svg";
import Link from "next/link";
import { UserAuth } from "../context/AuthContext";
import { mapAuthCodeToMessage } from "../utils/firebase-errors";
import { useRouter } from "next/navigation";
import { withoutAuth } from "../hoc/withoutAuth";
import Loading from "../components/Loading";

function Login() {
  const [inputValues, setInputValues] = useState({
    email: "",
    password: "",
    error: "",
    loading: false,
  });
  const router = useRouter();
  const { googleSignIn, emailPasswordSignin, setToken, initializeUserProfile } =
    UserAuth() as any;

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const initProfile = async (email: string, userId: string) => {
    try {
      await initializeUserProfile(userId, email);
    } catch (err) {
      setInputValues((prev) => ({
        ...prev,
        error: "Something went wrong, please try again",
      }));
    }
  };

  const validateEmailPassowrd = () => {
    if (!inputValues.email || !inputValues.password) {
      setInputValues((prev) => ({
        ...prev,
        error: "Please enter email and password",
      }));
      return false;
    }
    return true;
  };
  const handleEmailPasswordLogin = async () => {
    if (validateEmailPassowrd()) {
      setInputValues((prev) => ({ ...prev, error: "", loading: true }));
      try {
        const res = await emailPasswordSignin(
          inputValues.email,
          inputValues.password
        );

        await setToken(res.user.accessToken);
        router.push("/user/dashboard");
      } catch (error: any) {
        const err = mapAuthCodeToMessage(error?.message as any);
        setInputValues((prev) => ({ ...prev, error: err }));
      }
      setInputValues((prev) => ({ ...prev, loading: false }));
    }
  };
  const handleGoogleLogin = async () => {
    setInputValues((prev) => ({ ...prev, loading: true }));
    try {
      const res = await googleSignIn();
      await initProfile(res.user.email, res.user.uid);
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
              onClick={handleEmailPasswordLogin}
              disabled={inputValues.loading}
            >
              Login
            </Button>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm	text-primary-color mt-6">
              Tesla Owner?{" "}
              <Link href={"/wash-request"}>
                <span className="cursor-pointer text-primary-gray">
                  Click Here
                </span>
              </Link>
            </p>
            <p className="paragraph-1 opacity-70 my-3">- Or sign in with -</p>
            <div className="flex items-center w-80 justify-around mb-8 mt-4">
              <SocialButton onClick={handleGoogleLogin}>
                <Image
                  src={GoogleIcon}
                  alt="login-google"
                  className="mx-auto"
                />
              </SocialButton>
            </div>
            <p className="paragraph-1 ">
              Dont have Have a Wash Pro Account?{" "}
              <Link href={"/onboard-user"}>
                <span className="cursor-pointer text-primary-color">
                  Sign Up
                </span>
              </Link>
            </p>
          </div>
        </Card>
      </main>
    </>
  );
}

export default withoutAuth(Login);
