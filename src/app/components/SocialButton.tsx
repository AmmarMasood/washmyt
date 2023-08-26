"use client";
import React from "react";

interface ISocialButton {
  children: any;
  onClick: () => void;
}
function SocialButton(props: ISocialButton) {
  const { children, onClick } = props;
  return (
    <button
      onClick={onClick}
      className={`bg-white pointer rounded-xl py-2 px-3 shadow-[rgba(0,_0,_0,_0.25)_0px_25px_50px_-12px] w-20`}
    >
      {children}
    </button>
  );
}

export default SocialButton;
