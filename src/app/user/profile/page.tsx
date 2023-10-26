"use client";

import Card from "@/app/components/Card";
import { withAuth } from "@/app/hoc/withAuth";
import Layout from "../components/Layout";
import React, { useEffect, useState } from "react";
import { UserAuth } from "@/app/context/AuthContext";
import Chip from "@/app/components/Chip";
import { Switch, message } from "antd";
import GoogleAutocomplete from "@/app/components/GoogleAutocomplete";
import FormField from "@/app/components/FormField";
import Button from "@/app/components/Button";
import Loading from "@/app/components/Loading";
import axiosApiInstance from "@/app/utils/axiosClient";
import ProfileImage from "./components/ProfileImage";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/app/lib/firebase";

const label = `text-md text-primary-gray mr-4`;
const value = `text-md text-primary-black text-right`;
const row = `flex items-center justify-between mb-4`;
const heading = `text-lg text-primary-color uppercase mb-4`;

function Page() {
  const { profile, getUser } = UserAuth() as any;
  const [acceptingWashes, setAcceptingWashes] = useState<any>(false);
  const [businessAddress, setBusinessAddress] = useState<any>(null);
  const [radius, setRadius] = useState<any>(0);
  const [profileImage, setProfileImage] = useState<any>(null);
  const [loading, setLoading] = useState<any>(false);

  useEffect(() => {
    if (profile) {
      setAcceptingWashes(profile.acceptingWashes);
      setBusinessAddress(profile.businessAddress);
      setRadius(profile.serviceRadius);
      setProfileImage(profile.profileImage);
    }
  }, [profile]);

  const verifyFields = () => {
    if (!businessAddress || !radius) {
      return false;
    }
    return true;
  };

  const uploadData = async () => {
    if (!profileImage) return;
    if (profileImage === profile.profileImage) return;

    try {
      const fileRef = ref(
        storage,
        `${profile.userId}/displayPicture/${profileImage.name}`
      );
      const uploadTask = await uploadBytes(fileRef, profileImage);
      const link = await getDownloadURL(uploadTask.ref);
      return link;
    } catch (error) {
      console.log(error);
      message.error("Unable to upload file. Please try again.");
    }
  };

  const updateData = async () => {
    setLoading(true);
    try {
      const link = await uploadData();
      await axiosApiInstance.post("/api/onboard/complete-profile", {
        acceptingWashes,
        businessAddress,
        serviceRadius: parseFloat(radius),
        profileImage: link,
      });
      message.success("Profile updated successfully.");
      await getUser(true);
    } catch (error) {
      console.log(error);
      message.error("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <>
      <Loading show={loading} />
      <div className="min-h-screen  bg-secondary-color p-6 relative">
        <Layout currentOption={-1}>
          <Card className="h-full p-4 bg-white !p-6">
            <h1 className="text-xl font-semibold mb-14 text-black">
              Wash Pro Settings
            </h1>
            {profile && (
              <div className="grid-cols-2 grid gap-14">
                {/*  */}
                <div>
                  <div className="mb-14 flex items-center">
                    <ProfileImage
                      url={profileImage}
                      onChange={(file) => setProfileImage(file)}
                    />
                    <div className="ml-4">
                      <p className="text-lg text-black font-bold ">
                        {profile.name}
                      </p>
                      <p className="text-sm text-primary-gray">
                        {profile.email}
                      </p>
                    </div>
                  </div>
                  <div className={row}>
                    <p className={label}>Accepting Washes</p>
                    <p className={value}>
                      <Switch
                        checked={acceptingWashes}
                        onChange={(checked) => setAcceptingWashes(checked)}
                        checkedChildren="Yes"
                        unCheckedChildren="No"
                      />
                    </p>
                  </div>
                  <div className={row}>
                    <p className={label}>Address</p>
                    <p className={value}>
                      <GoogleAutocomplete
                        label=""
                        onSelect={(place) => {
                          setBusinessAddress(JSON.stringify(place || {}));
                        }}
                        className="!w-[350px] -mt-8"
                      />
                      {businessAddress &&
                        typeof businessAddress === "string" && (
                          <p className="text-primary-gray text-md font-medium mt-2">
                            {JSON.parse(businessAddress)?.formatted_address}
                          </p>
                        )}
                    </p>
                  </div>
                  <div className={row}>
                    <p className={label}>Fence Radius</p>
                    <p className={value}>
                      <FormField
                        type="number"
                        name="radius"
                        label=""
                        placeholder="0 miles"
                        onChange={(e) => setRadius(e.target.value)}
                        value={radius}
                        className="!w-[350px]"
                      />
                    </p>
                  </div>
                  <Button
                    disabled={loading}
                    onClick={updateData}
                    className="mt-10"
                  >
                    Save
                  </Button>
                  <p className="text-base text-primary-gray mt-20">
                    Questions? Email
                    <span className="text-primary-color ml-4">
                      washmyteslamail@example.com
                    </span>
                  </p>
                </div>
                {/*  */}
                <div>
                  <div>
                    <p className={heading}>Contact</p>
                    <div className={row}>
                      <p className={label}>Name</p>
                      <p className={value}>{profile.name}</p>
                    </div>
                    <div className={row}>
                      <p className={label}>Phone</p>
                      <p className={value}>{profile.phoneNumber}</p>
                    </div>
                    <div className={row}>
                      <p className={label}>Email</p>
                      <p className={value}>{profile.email}</p>
                    </div>
                    <div className={row}>
                      <p className={label}>Business Name</p>
                      <p className={value}>{profile.businessName}</p>
                    </div>
                  </div>
                  <div className="mt-10">
                    <p className={`${heading} `}>Services</p>
                    <div className={row}>
                      <p className={label}>Water</p>
                      <p className={value}>
                        {profile.mobileWaterCapability === true ? "YES" : "NO"}
                      </p>
                    </div>
                    <div className={row}>
                      <p className={label}>Electricity</p>
                      <p className={value}>
                        {profile.mobileElectricCapability === true
                          ? "YES"
                          : "NO"}
                      </p>
                    </div>
                    <div className={row}>
                      <p className={label}>License/ Insurance Details</p>
                      <p className={value}>
                        <Chip
                          className={
                            profile.documentsVerified === true
                              ? "bg-[#178f51] text-white px-3 py-1"
                              : "bg-primary-color text-white px-3 py-1"
                          }
                          text={
                            profile.documentsVerified === true
                              ? "Checked"
                              : "In Progress"
                          }
                        />
                      </p>
                    </div>
                    <div className={row}>
                      <p className={label}>Business Name</p>
                      <p className={value}>{profile.businessName}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </Layout>
      </div>
    </>
  );
}

export default withAuth(Page);
