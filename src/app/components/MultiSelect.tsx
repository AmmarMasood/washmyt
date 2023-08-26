"use client";
import Image from "next/image";
import React from "react";
import CrossIcon from "../../../public/imgs/cross-btn.svg";

export interface ISelectedValue {
  value: string;
  id: string;
}
interface IMultiSelect {
  onChange: (e: any) => void;
  label: string;
  value: string;
  placeholder?: string;
  name?: string;
  className?: string;
  fieldClassNames?: string;
  labelClassNames?: string;
  error?: boolean;
  errorMessage?: string;
  options: ISelectedValue[];
  selectedValues: ISelectedValue[];
  removeValue: (id: string) => void;
}
function MultiSelect(props: IMultiSelect) {
  const {
    label,
    onChange,
    value,
    name,
    className,
    labelClassNames,
    fieldClassNames,
    error,
    errorMessage,
    options,
    selectedValues,
    removeValue,
  } = props;
  return (
    <div className={className}>
      <label
        className={`block text-primary-black text-base font-semibold mb-1 ${labelClassNames}`}
      >
        {label}
      </label>
      <div className="flex items-center">
        <select
          name={name}
          className={`select select-solid select-xl	select-block text-primary-gray text-base font-medium p-3 w-full border focus:border-primary-color active:border-primary-color focus:outline-none bg-secondary-color rounded-xl border-[#e5e7eb] ${fieldClassNames} ${
            error ? "border-red-500" : ""
          }
      `}
          onChange={(e) =>
            onChange(options.filter((o) => o.id === e.target.value)[0])
          }
          value={value}
        >
          {options
            .filter(
              (item1) => !selectedValues.some((item2) => item2.id === item1.id)
            )
            .map((m, i) => (
              <option key={m.id} value={m.id}>
                {m.value}
              </option>
            ))}
        </select>

        {error && errorMessage && (
          <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
        )}
      </div>
      <div className="mt-2">
        {selectedValues.map((t, i) => (
          <span
            className="badge badge-lg mr-2 bg-primary-gray border-0"
            key={i}
          >
            <label className="text-[#fff]">{t.value}</label>
            <Image
              className="ml-2 cursor-pointer"
              src={CrossIcon}
              alt="cross-icon"
              onClick={() => removeValue(t.id)}
            />
          </span>
        ))}
      </div>
    </div>
  );
}

export default MultiSelect;
