"use client";

import React from "react";

import { UserAuth } from "@/app/context/AuthContext";
import Sidebar from "./Sidebar";
import Loading from "@/app/components/Loading";
import { lgScreenSize } from "@/contants";

interface ILayout {
  currentOption: number;
  children: React.ReactNode;
}
function Layout(props: ILayout) {
  const { loading } = UserAuth() as any;
  const [open, setOpen] = React.useState(false);
  const [isMobileMode, setIsMobileMode] = React.useState(false);
  const { currentOption, children } = props;
  const size = lgScreenSize.size;

  React.useEffect(() => {
    if (window.innerWidth < size) {
      setIsMobileMode(true);
    }
    window.addEventListener("resize", () => {
      if (window.innerWidth < size) {
        setIsMobileMode(true);
      } else {
        setIsMobileMode(false);
      }
    });
  }, []);

  return (
    <div className="flex">
      <Loading show={loading} />

      {isMobileMode ? (
        <Sidebar
          currentOption={currentOption}
          className={`max-md:absolute max-md:bg-white max-md:h-full max-md:z-10 max-md:top-0 max-md:left-0 max-md:p-6  ease-in-out		${
            open ? "translate-x-0" : "-translate-x-[255px]"
          }`}
          showMobileButton={true}
          mobileButtonOnClick={() => setOpen(!open)}
        />
      ) : (
        <Sidebar currentOption={currentOption} />
      )}

      <div className="w-full mt-8 ml-7 max-sm:ml-0">{children}</div>
    </div>
  );
}

export default Layout;
