"use client";

import React from "react";

import { UserAuth } from "@/app/context/AuthContext";
import Sidebar from "./Sidebar";
import Loading from "@/app/components/Loading";

interface ILayout {
  currentOption: number;
  children: React.ReactNode;
}
function Layout(props: ILayout) {
  const { loading } = UserAuth() as any;
  const { currentOption, children } = props;

  return (
    <div className="flex">
      <Loading show={loading} />
      <Sidebar currentOption={currentOption} />
      <div className="w-full mt-8 ml-7">{children}</div>
    </div>
  );
}

export default Layout;
