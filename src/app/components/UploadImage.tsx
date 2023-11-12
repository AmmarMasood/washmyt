"use client";
import { useDropzone } from "react-dropzone";
import React, { useCallback, useState } from "react";

interface IUploadImage {
  label: string;
  onUpload: (files: any) => void;
  className?: string;
  file?: any;
}
function UploadImage(props: IUploadImage) {
  const { label, onUpload, className, file } = props;
  const onDrop = useCallback((acceptedFiles: any) => {
    // Do something with the files
    onUpload(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
    maxSize: 3000000,
    accept: {
      "image/png": [".png", ".jpg", ".jpeg"],
    },
  });

  return (
    <div className={className}>
      <label
        className={`block text-primary-black text-base font-semibold mb-1`}
      >
        {label}
      </label>
      <div
        {...getRootProps()}
        className="bg-[#f5f5f5] h-32 rounded-xl border-dotted border-black flex items-center justify-center cursor-pointer"
      >
        <input {...getInputProps()} className="p-3 w-full" type="" />
        {isDragActive ? (
          <p className="text-primary-gray text-base	font-medium">
            Drop the files here ...
          </p>
        ) : (
          <p className="text-primary-gray text-base	font-medium">
            Drag and drop some files here, or click to select files
          </p>
        )}
      </div>
      <div>
        <p className="text-primary-gray text-xs font-medium mt-2 text-center">
          File must be in PNG format and no larger than 3MB
        </p>

        {file && (
          <p className="text-primary-gray text-md font-medium mt-2 overflow-hidden">
            {typeof file === "string" ? file : file.name}
          </p>
        )}
      </div>
    </div>
  );
}

export default UploadImage;
