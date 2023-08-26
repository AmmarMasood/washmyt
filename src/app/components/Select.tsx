"use client";
import React, { ChangeEventHandler } from "react";

interface ISelectedValue {
  value: string;
  id: string;
}
interface ISelect {
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
}
function Select(props: ISelect) {
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
          onChange={onChange}
          value={value}
        >
          {options.map((m, i) => (
            <option key={m.id} value={m.id}>
              {m.value}
            </option>
          ))}
        </select>

        {error && errorMessage && (
          <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
        )}
      </div>
    </div>
  );
}

export default Select;
