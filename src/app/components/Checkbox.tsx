"use client";

import { ChangeEvent } from "react";

interface ICheckbox {
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label: string;
  name: string;
  className?: string;
}

function Checkbox(props: ICheckbox) {
  const { checked, onChange, label, name, className } = props;

  return (
    <div className={`flex items-center ${className}`}>
      <input
        checked={checked}
        type="checkbox"
        onChange={onChange}
        name={name}
        className="checkbox checkbox-bordered-error form-checkbox h-5 w-5 text-[#FF4A4A] transition duration-150 ease-in-out bg-white border border-[#FF4A4A] rounded focus:ring-[#FF4A4A] focus:border-[#FF4A4A] checked:bg-[#FF4A4A] checked:border-[#FF4A4A] z-10"
      />
      <label className="text-[#1E1E1E] text-sm ml-2">{label}</label>
    </div>
  );
}

export default Checkbox;
