"use client";

import React, { useCallback } from "react";
import ImageUploadIcon from "../../../../../public/imgs/file-upload.svg";
import Image from "next/image";
import { useDropzone } from "react-dropzone";

interface IProfileImage {
  url: string;
  onChange: (file: any) => void;
}

function ProfileImage(props: IProfileImage) {
  const { url, onChange } = props;
  const onDrop = useCallback((acceptedFiles: any) => {
    onChange(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
    maxSize: 3000000,
    accept: {
      "image/png": [".png"],
    },
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className="relative bg-[#f5f5f5] h-28 w-28 rounded-full border border-black flex items-center justify-center cursor-pointer"
      >
        <input {...getInputProps()} className="p-3 w-full" type="" />

        {url && (
          <Image
            src={typeof url === "string" ? url : URL.createObjectURL(url)}
            alt="profile"
            fill={true}
            className="rounded-full"
          />
        )}
        <Image
          src={ImageUploadIcon}
          alt="upload"
          width={35}
          height={35}
          className="absolute bottom-0 right-0"
        />
      </div>
    </div>
  );
}

export default ProfileImage;
