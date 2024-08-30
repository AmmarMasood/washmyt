"use client";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import CameraIcon from "../../../public/imgs/icons8-camera-100.png";
import { Upload, message } from "antd";

interface IUploadImage {
  label: string;
  onUpload: (files: any) => void;
  className?: string;
  file?: any;
}

const beforeUploadWithoutErrors = (file: any) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  const isLt2M = file.size / 1024 / 1024 < 5;
  return isJpgOrPng && isLt2M;
};

const beforeUpload = (file: any) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 5;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }

  return false;
};

function UploadImage(props: IUploadImage) {
  const { label, onUpload, className, file } = props;
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (typeof file === "string") {
      setImageUrl(file);
    }
  }, [file]);

  const handleChange = (acceptedFiles: any) => {
    console.log("reached bere 1", acceptedFiles);
    const file = acceptedFiles.file;
    if (beforeUploadWithoutErrors(file)) {
      // Convert file to Base64
      console.log("reached bere");
      //
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        console.log("base64", base64String);
        setImageUrl(base64String); // Set the Base64 string to state
        onUpload([file]);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <div className={className}>
      <div className={`block text-primary-black text-base font-semibold mb-1`}>
        {label}
      </div>
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader !w-full"
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="avatar"
            style={{
              width: "100%",
            }}
          />
        ) : (
          uploadButton
        )}
      </Upload>
    </div>
  );
}

export default UploadImage;
