"use client";

import { useContext, createContext, useState, useEffect } from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import axios from "axios";
import axiosApiInstance from "../utils/axiosClient";
import { useRouter } from "next/navigation";
import { message } from "antd";

const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const emailPasswordSignup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const emailPasswordSignin = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };
  const sendVerificationEmail = () => {
    return sendEmailVerification(auth.currentUser);
  };

  const initializeUserProfile = (userId, email) => {
    return axios.post("/api/onboard/signup", {
      userId,
      email,
    });
  };

  const setToken = (token) => {
    localStorage.setItem("auth", token);
  };
  const getToken = () => {
    return localStorage.getItem("auth");
  };
  const logOut = async () => {
    await signOut(auth);
    localStorage.removeItem("auth");
    setUser(null);
    setProfile(null);
    router.push("/");
  };

  const getUser = async (force) => {
    const token = getToken();
    if (!token) return;
    if (profile && force !== true) return;
    setLoading(true);
    try {
      const res = await axiosApiInstance.get(`/api/user`);
      const { data } = res;
      setProfile(data.user);
      if (data.user.onboardingCompleted !== true) {
        router.push("/onboard-user/getting-started");
      }
    } catch (err) {
      console.log(err);
      message.error("Something went wrong");
    }
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      getUser();
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        googleSignIn,
        logOut,
        emailPasswordSignup,
        emailPasswordSignin,
        sendVerificationEmail,
        initializeUserProfile,
        setToken,
        loading,
        setLoading,
        getUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
