"use client";
import { useDropzone } from "react-dropzone";
import React, { useCallback, useState } from "react";

interface IUploadImage {
  label: string;
  onUpload: (files: any) => void;
  className?: string;
}
function UploadImage(props: IUploadImage) {
  const { label, onUpload, className } = props;
  const onDrop = useCallback((acceptedFiles: any) => {
    // Do something with the files
    console.log(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

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
        <input {...getInputProps()} className="p-3 w-full" />
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
    </div>
  );
}

export default UploadImage;
