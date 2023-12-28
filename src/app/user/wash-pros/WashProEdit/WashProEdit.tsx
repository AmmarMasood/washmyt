import Modal from "@/app/components/Modal";
import {
  Image as AntdImage,
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  message,
} from "antd";
import React, { useEffect } from "react";
import LogoIcon from "../../../../../public/imgs/logo-icon.svg";
import EditIcon from "../../../../../public/imgs/edit-icon.svg";
import Image from "next/image";
import { servicesArr } from "@/app/onboard-user/getting-started/components/FourthPart";
import GoogleAutocomplete from "@/app/components/GoogleAutocomplete";
import GreenCheckmark from "../../../../../public/imgs/icons8-checkmark-30.png";
import axiosApiInstance from "@/app/utils/axiosClient";
import Loading from "@/app/components/Loading";

interface ICustomerDetailProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  washProDetail: any;
}

const rowClassName = `
   flex items-start justify-between text-right

`;
const keyClassName = `text-primary-gray mr-4`;
const valueClassName = `text-primary-black font-bold w-2/3 flex items-start justify-end flex-wrap`;

function WashProEdit(props: ICustomerDetailProps) {
  const { show, onClose, onConfirm, washProDetail } = props;
  const [loading, setLoading] = React.useState(false);
  const [businessAddress, setBusinessAddress] = React.useState<any>({});
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(washProDetail);
    setBusinessAddress(washProDetail.businessAddress);
  }, [washProDetail]);

  const onFinishForm = async (values: any) => {
    values.businessAddress = businessAddress;
    setLoading(true);
    try {
      await axiosApiInstance.patch(
        `/api/admin/wash-pros?id=${washProDetail.id}`,
        values
      );
      message.success("Wash Pro updated successfully");
      console.log("onConfirm 2");
      onConfirm();
      console.log("onConfirm 3");
    } catch (error) {
      console.log(error);
      message.error("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <Modal
      title=""
      show={show}
      onClose={onClose}
      onConfirm={onConfirm}
      showCloseButton={true}
      width={700}
    >
      <Loading show={loading} />
      <div className="flex items-center">
        <Image src={LogoIcon} alt="washmyt" />
        <h3 className="font-bold ml-4 text-lg">Edit Details</h3>
      </div>
      {washProDetail && (
        <Form form={form} onFinish={onFinishForm}>
          <div className="mt-6">
            <div className={rowClassName}>
              <p className={keyClassName}>Business Name</p>
              <div className={valueClassName}>
                <Form.Item
                  name="businessName"
                  rules={[
                    {
                      required: true,
                      message: "This field is required",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>
            </div>
            <div className={rowClassName}>
              <p className={keyClassName}>Contact Name</p>
              <div className={valueClassName}>
                <Form.Item
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "This field is required",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>
            </div>
            <div className={rowClassName}>
              <p className={keyClassName}>Phone</p>
              <div className={valueClassName}>
                <Form.Item
                  name="phoneNumber"
                  rules={[
                    {
                      required: true,
                      message: "This field is required",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>
            </div>
            <div className={rowClassName}>
              <p className={keyClassName}>Email</p>
              <div className={valueClassName}>
                <Form.Item
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "This field is required",
                    },
                  ]}
                >
                  <Input disabled />
                </Form.Item>
              </div>
            </div>
            <div className={rowClassName}>
              <p className={keyClassName}>Website</p>

              <div className={valueClassName}>
                <Form.Item
                  name="website"
                  rules={[
                    {
                      required: true,
                      message: "This field is required",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>
            </div>
            <div className={rowClassName}>
              <p className={keyClassName}>T-shirt size</p>

              <div className={valueClassName}>
                <Form.Item
                  name="tShirtSize"
                  rules={[
                    {
                      required: true,
                      message: "This field is required",
                    },
                  ]}
                >
                  <Select
                    style={{
                      width: 190,
                    }}
                  >
                    <Select.Option value="S">S</Select.Option>
                    <Select.Option value="M">M</Select.Option>
                    <Select.Option value="L">L</Select.Option>
                    <Select.Option value="XL">XL</Select.Option>
                    <Select.Option value="XXL">XXL</Select.Option>
                  </Select>
                </Form.Item>
              </div>
            </div>
            <div
              className={rowClassName}
              style={{
                marginBottom: "20px",
              }}
            >
              <p className={keyClassName}>Address</p>
              <div className={valueClassName}>
                <GoogleAutocomplete
                  label=""
                  onSelect={(place) => {
                    form.setFieldValue(
                      "businessAddress",
                      JSON.stringify(place || {})
                    );
                    setBusinessAddress(JSON.stringify(place || {}));
                  }}
                  className="!w-[350px] -mt-8"
                />
                {businessAddress && typeof businessAddress === "string" && (
                  <div className="flex items-center mt-2 ml-1">
                    <p className="text-primary-gray text-md font-medium  mr-2 ">
                      {JSON.parse(businessAddress)?.formatted_address}
                    </p>
                    <Image
                      src={GreenCheckmark}
                      alt="checkmark"
                      height={20}
                      width={20}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className={rowClassName}>
              <p className={keyClassName}>Radius</p>

              <div className={valueClassName}>
                <Form.Item
                  name="serviceRadius"
                  rules={[
                    {
                      required: true,
                      message: "This field is required",
                    },
                  ]}
                >
                  <InputNumber
                    style={{
                      width: 190,
                    }}
                  />
                </Form.Item>
              </div>
            </div>
            <div className={rowClassName}>
              <p className={keyClassName}>Services Offered</p>

              <div className={valueClassName}>
                <Form.Item
                  name="services"
                  rules={[
                    {
                      required: true,
                      message: "This field is required",
                    },
                  ]}
                >
                  <Select
                    mode="multiple"
                    allowClear
                    style={{ width: 190 }}
                    placeholder="Please select"
                    options={servicesArr.map((v) => ({
                      label: v.value,
                      value: v.id,
                    }))}
                  />
                </Form.Item>
              </div>
            </div>
            <div className={rowClassName}>
              <p className={keyClassName}>Mobile Water</p>

              <div className={valueClassName}>
                <Form.Item
                  name="mobileWaterCapability"
                  rules={[
                    {
                      required: true,
                      message: "This field is required",
                    },
                  ]}
                >
                  <Select
                    style={{
                      width: 190,
                    }}
                  >
                    <Select.Option value={true}>Yes</Select.Option>
                    <Select.Option value={false}>No</Select.Option>
                  </Select>
                </Form.Item>
              </div>
            </div>
            <div className={rowClassName}>
              <p className={keyClassName}>Mobile Electricity</p>
              <div className={valueClassName}>
                <Form.Item
                  name="mobileElectricCapability"
                  rules={[
                    {
                      required: true,
                      message: "This field is required",
                    },
                  ]}
                >
                  <Select
                    style={{
                      width: 190,
                    }}
                  >
                    <Select.Option value={true}>Yes</Select.Option>
                    <Select.Option value={false}>No</Select.Option>
                  </Select>
                </Form.Item>
              </div>
            </div>
            <div className={rowClassName}>
              <p className={keyClassName}>Documents Verified</p>
              <div className={valueClassName}>
                <Form.Item
                  name="documentsVerified"
                  rules={[
                    {
                      required: true,
                      message: "This field is required",
                    },
                  ]}
                >
                  <Select
                    style={{
                      width: 190,
                    }}
                  >
                    <Select.Option value={true}>Yes</Select.Option>
                    <Select.Option value={false}>No</Select.Option>
                  </Select>
                </Form.Item>
              </div>
            </div>
            <div className={rowClassName}>
              <p className={keyClassName}>Accepting Washes</p>

              <div className={valueClassName}>
                <Form.Item
                  name="acceptingWashes"
                  rules={[
                    {
                      required: true,
                      message: "This field is required",
                    },
                  ]}
                >
                  <Select
                    style={{
                      width: 190,
                    }}
                  >
                    <Select.Option value={true}>Yes</Select.Option>
                    <Select.Option value={false}>No</Select.Option>
                  </Select>
                </Form.Item>
              </div>
            </div>
          </div>

          <Form.Item className="flex items-center justify-end">
            <Button htmlType="submit" type="primary" className="bg-red-400">
              Save
            </Button>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
}

export default WashProEdit;
