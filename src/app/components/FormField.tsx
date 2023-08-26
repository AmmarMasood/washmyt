"use client";
import React, { ChangeEvent } from "react";

interface IFormField {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label: string;
  value: string;
  type: "number" | "text" | "password" | "email";
  placeholder?: string;
  name?: string;
  className?: string;
  fieldClassNames?: string;
  labelClassNames?: string;
  error?: boolean;
  errorMessage?: string;
  preField?: string;
  postField?: any;
}
function FormField(props: IFormField) {
  const {
    label,
    onChange,
    value,
    type,
    name,
    className,
    labelClassNames,
    fieldClassNames,
    placeholder,
    error,
    errorMessage,
    preField,
    postField,
  } = props;
  return (
    <div className={className}>
      <label
        className={`block text-primary-black text-base font-semibold mb-1 ${labelClassNames}`}
      >
        {label}
      </label>
      <div className="flex items-center">
        {preField && (
          <span className="text-primary-gray text-base	font-medium p-3 rounded-xl bg-secondary-color border border-r-0 rounded-r-none p-r-20">
            {preField}
          </span>
        )}
        <input
          className={`text-primary-gray text-base	font-medium p-3 w-full border focus:border-primary-color active:border-primary-color focus:outline-none bg-secondary-color ${fieldClassNames} ${
            error ? "border-red-500" : ""
          }
          ${preField ? "rounded-l-none rounded-r-xl" : "rounded-xl"}
          ${postField ? "rounded-r-none rounded-l-xl" : "rounded-xl"}
          `}
          type={type}
          value={value}
          onChange={onChange}
          name={name}
          placeholder={placeholder}
        />
        {postField && (
          <span className="text-primary-gray text-base	font-medium p-3 rounded-xl bg-secondary-color border border-l-0 rounded-l-none p-l-20">
            {postField}
          </span>
        )}
        {error && errorMessage && (
          <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
        )}
      </div>
    </div>
  );
}

export default FormField;
