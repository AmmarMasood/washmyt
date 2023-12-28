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
import { modelsData } from "@/app/utils/static-data";

interface ICustomerDetailProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  washDetail: any;
  setLoading: (loading: boolean) => void;
}

const rowClassName = `
   flex items-start justify-between text-right

`;
const keyClassName = `text-primary-gray mr-4`;
const valueClassName = `text-primary-black font-bold w-2/3 flex items-start justify-end flex-wrap`;

function WashEdit(props: ICustomerDetailProps) {
  const { show, onClose, onConfirm, washDetail, setLoading } = props;

  const [options, setOptions] = React.useState<any>([]);
  const [businessAddress, setBusinessAddress] = React.useState<any>({});
  const [form] = Form.useForm();

  const getModels = (packages: any) => {
    const matches = packages.map((carDetail: any) => {
      const match = carDetail.name.match(/\((Models: [^)]+)\)/);
      return match ? { ...carDetail, model: match[1] } : null;
    });
    return matches
      .map((m: any) => ({ ...m, model: m.model?.replace("Models: ", "") }))
      .map((model: any) => {
        const match = model.model.match(/(\w+)/g); // Extract individual words
        return match ? { ...model, model: `model${match.join("")}` } : null;
      });
  };

  const getPackages = async () => {
    const model = washDetail?.selectedModel;
    if (model && modelsData.filter((f) => f.id === model).length > 0) {
      setLoading(true);
      try {
        const response = await axiosApiInstance.get(
          "/api/wash-request/packages"
        );
        const mods = getModels(response.data.options);
        const filMods = mods.filter((f: any) =>
          f.model.includes(model.replace("model", ""))
        );
        console.log(filMods);
        setOptions(filMods);
      } catch (error) {
        console.log(error);
        message.error("Unable to get packages");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    form.setFieldsValue(washDetail);
    setBusinessAddress(washDetail.address);
    if (washDetail && washDetail.selectedModel && !options.length) {
      getPackages();
    }
  }, [washDetail]);

  const onFinishForm = async (values: any) => {
    // values.businessAddress = businessAddress;
    // setLoading(true);
    // try {
    //   await axiosApiInstance.patch(
    //     `/api/admin/wash-pros?id=${washProDetail.id}`,
    //     values
    //   );
    //   message.success("Wash Pro updated successfully");
    //   console.log("onConfirm 2");
    //   onConfirm();
    //   console.log("onConfirm 3");
    // } catch (error) {
    //   console.log(error);
    //   message.error("Something went wrong. Please try again.");
    // }
    // setLoading(false);
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
      <div className="flex items-center">
        <Image src={LogoIcon} alt="washmyt" />
        <h3 className="font-bold ml-4 text-lg">Edit Details</h3>
      </div>
      {washDetail && (
        <Form form={form} onFinish={onFinishForm}>
          <div className="mt-6">
            <div className={rowClassName}>
              <p className={keyClassName}>Package</p>
              <div className={valueClassName}>
                <Form.Item
                  name="packageId"
                  rules={[
                    {
                      required: true,
                      message: "This field is required",
                    },
                  ]}
                >
                  <Select
                    style={{
                      width: 350,
                    }}
                  >
                    {options.map((option: any) => (
                      <Select.Option value={option.id}>
                        {`${option.name} $ ${option.price}`}
                      </Select.Option>
                    ))}
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
                    form.setFieldValue("address", JSON.stringify(place || {}));
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
              <p className={keyClassName}>Electrical Hookup Available</p>
              <div className={valueClassName}>
                <Form.Item
                  name="electricalHookupAvailable"
                  rules={[
                    {
                      required: true,
                      message: "This field is required",
                    },
                  ]}
                >
                  <Select
                    style={{
                      width: 350,
                    }}
                  >
                    <Select.Option value={true}>Yes</Select.Option>
                    <Select.Option value={false}>No</Select.Option>
                  </Select>
                </Form.Item>
              </div>
            </div>
            <div className={rowClassName}>
              <p className={keyClassName}>Water Hookup Available</p>
              <div className={valueClassName}>
                <Form.Item
                  name="waterHookupAvailable"
                  rules={[
                    {
                      required: true,
                      message: "This field is required",
                    },
                  ]}
                >
                  <Select
                    style={{
                      width: 350,
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

export default WashEdit;
