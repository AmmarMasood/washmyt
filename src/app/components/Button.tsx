"use client";
import React from "react";

interface IButton {
  children: any;
  onClick: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}
function Button(props: IButton) {
  const { children, onClick, className, type } = props;
  return (
    <button
      onClick={onClick}
      className={`bg-primary-color font-white pointer text-lg p-2 rounded-xl w-full	border-0 cursor-pointer ${className}`}
      type={type}
    >
      {children}
    </button>
  );
}

export default Button;
