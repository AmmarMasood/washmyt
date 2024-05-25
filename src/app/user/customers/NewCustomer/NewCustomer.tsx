import Modal from "@/app/components/Modal";
import { Button, Form, Input, message } from "antd";
import Image from "next/image";
import React from "react";
import LogoIcon from "../../../../../public/imgs/logo-icon.svg";
import stripe from "../../../lib/stripe";
import axiosApiInstance from "@/app/utils/axiosClient";
interface INewCustomerProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
}
const rowClassName = `
   flex items-start justify-between text-right

`;
const keyClassName = `text-primary-gray mr-4`;
const valueClassName = `text-primary-black font-bold w-2/3 flex items-start justify-end flex-wrap`;

function NewCustomer(props: INewCustomerProps) {
  const { show, onClose, onConfirm } = props;

  const [form] = Form.useForm();

  const onFinishForm = async (values: any) => {
    try {
      const stripeCustomer = await stripe.customers.create(
        {
          email: values.email,
          phone: values.phoneNumber,
          name: values.name,
        },
        {
          apiKey: process.env.NEXT_PUBLIC_STRIPE_SECRET,
        }
      );
      values.stripeId = stripeCustomer.id;

      const { data } = await axiosApiInstance.post(
        "/api/admin/customers",
        values
      );
      message.success("Customer created successfully");
      form.resetFields();
      onConfirm();
    } catch (error) {
      console.log(error);
      message.error("Unable to create customer");
    }
  };
  return (
    <Modal
      title=""
      show={show}
      onClose={onClose}
      onConfirm={onConfirm}
      showCloseButton={false}
    >
      <div className="flex items-center">
        <Image src={LogoIcon} alt="washmyt" />
        <h3 className="font-bold ml-4 text-lg">New Customer</h3>
      </div>
      <Form form={form} onFinish={onFinishForm} layout="vertical">
        <div className="mt-6">
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "This field is required",
              },
              {
                type: "email",
                message: "Please enter a valid email",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Name"
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

          <Form.Item
            label="Phone Number"
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

        <Form.Item className="flex items-center justify-end">
          <Button
            htmlType="submit"
            type="primary"
            className="bg-red-400 !text-white"
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default NewCustomer;
