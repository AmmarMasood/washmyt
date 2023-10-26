"use client";
import React from "react";

interface IButton {
  children: any;
  onClick: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled: boolean;
  style?: React.CSSProperties;
}
function Button(props: IButton) {
  const { children, onClick, className, type, disabled, style } = props;
  return (
    <button
      onClick={onClick}
      className={`!bg-primary-color !font-white pointer text-lg p-2 rounded-xl w-full	border-0 ${
        disabled === false && "cursor-pointer"
      } ${className} ${disabled ? "!bg-gray-600" : ""}`}
      type={type}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  );
}

export default Button;
