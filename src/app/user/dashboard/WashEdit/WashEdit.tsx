import Modal from "@/app/components/Modal";
import {
  Image as AntdImage,
  Button,
  DatePicker,
  Form,
  Select,
  TimePicker,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import LogoIcon from "../../../../../public/imgs/logo-icon.svg";
import EditIcon from "../../../../../public/imgs/edit-icon.svg";
import Image from "next/image";
import { servicesArr } from "@/app/onboard-user/getting-started/components/FourthPart";
import GoogleAutocomplete from "@/app/components/GoogleAutocomplete";
import GreenCheckmark from "../../../../../public/imgs/icons8-checkmark-30.png";
import axiosApiInstance from "@/app/utils/axiosClient";
import Loading from "@/app/components/Loading";
import { modelsData } from "@/app/utils/static-data";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { WashStatus } from "@/app/types/interface";

dayjs.extend(utc);
dayjs.extend(customParseFormat);

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
  const [form] = Form.useForm();
  const { show, onClose, onConfirm, washDetail, setLoading } = props;

  const [options, setOptions] = useState<any>([]);
  const [washProps, setWashProps] = useState<any>([]);
  const [businessAddress, setBusinessAddress] = useState<any>({});
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

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

  const getWashPros = async () => {
    setLoading(true);
    try {
      const response = await axiosApiInstance.get("/api/admin/wash-pros/all");
      setWashProps(response.data.washpros);
    } catch (error) {
      console.log(error);
      message.error("Unable to get wash pros");
    }
    setLoading(false);
  };

  const addWashProToWashRequest = async (washId: string, washerId: string) => {
    setLoading(true);
    try {
      await axiosApiInstance.post(`/api/admin/wash-pros/accept`, {
        washId,
        washerId,
      });
      message.success("Wash updated successfully");
      onConfirm();
    } catch (error) {
      console.log(error);
      message.error(
        "Something went wrong. Unable to add washer to washRequst Please try again."
      );
    }
    setLoading(false);
  };

  const joinDateAndTime = (date: any, time: any) => {
    const d = dayjs(date.$d).format("DD-MM-YYYY");
    const t = dayjs(time.$d).format("H:mm:ss");

    const dateTime = dayjs(`${d} ${t} `, "DD-MM-YYYY H:mm:ss");

    return dateTime.utc().format();
  };

  useEffect(() => {
    if (washDetail && washDetail.selectedModel && !options.length) {
      form.setFieldsValue(washDetail);
      setBusinessAddress(washDetail?.address);
      getWashPros();
      getPackages();
      setTime(dayjs(washDetail?.washDateAndTimeUTC).format("H:mm:ss"));
      setDate(dayjs(washDetail?.washDateAndTimeUTC).format("DD-MM-YYYY"));
    }
  }, [washDetail]);

  const onFinishForm = async (values: any) => {
    values.address = businessAddress;
    values.washDateAndTimeUTC = joinDateAndTime(date, time);

    if (values.washerId) {
      await addWashProToWashRequest(washDetail.id, values.washerId);
    }
    delete values.washerId;

    setLoading(true);
    try {
      await axiosApiInstance.patch(
        `/api/admin/wash-request?id=${washDetail.id}`,
        values
      );
      message.success("Wash updated successfully");
      onConfirm();
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
                    {options.map((option: any, key: number) => (
                      <Select.Option value={option.id} key={key}>
                        {`${option.name} $ ${option.price}`}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>

            <div className={rowClassName}>
              <p className={keyClassName}>Wash Pro</p>
              <div className={valueClassName}>
                <Form.Item name="washerId">
                  <Select
                    style={{
                      width: 350,
                    }}
                  >
                    {washProps.map((option: any, key: number) => (
                      <Select.Option value={option.userId} key={key}>
                        {`${option.name} - ${option.email}`}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>

            <div className={rowClassName}>
              <p className={keyClassName}>Date</p>
              <div className={valueClassName}>
                <div className="flex items-center justify-center">
                  <DatePicker
                    size="middle"
                    suffixIcon={false}
                    format={"DD-MM-YYYY"}
                    value={date ? dayjs(date, "DD-MM-YYYY") : null}
                    onChange={(e: any) => setDate(e)}
                    placeholder="DD-MM-YYYY"
                    allowClear={false}
                    className="!w-[350px]"
                  />
                </div>
              </div>
            </div>

            <div className={`${rowClassName} mt-4 mb-2`}>
              <p className={keyClassName}>Time</p>
              <div className={valueClassName}>
                <div className="flex items-center justify-center">
                  <TimePicker
                    allowClear={false}
                    // className="p-5 mb-6 !w-[90px] rounded-xl border-1 border-black text-black text-lg mr-3"
                    placeholder="HH"
                    size="middle"
                    showNow={false}
                    // className="mt-6"
                    disabledTime={
                      // disable all times between 8am and 6pm
                      () => {
                        return {
                          disabledHours: () => {
                            const hours: number[] = [];
                            for (let i = 0; i < 8; i++) {
                              hours.push(i);
                            }
                            for (let i = 19; i < 24; i++) {
                              hours.push(i);
                            }
                            return hours;
                          },
                          disabledMinutes: () => {
                            const minutes: number[] = [];
                            for (let i = 0; i < 60; i++) {
                              if (i % 30 !== 0) {
                                minutes.push(i);
                              }
                            }
                            return minutes;
                          },
                        };
                      }
                    }
                    hideDisabledOptions={true}
                    changeOnBlur={true}
                    suffixIcon={false}
                    onChange={(e: any) => setTime(e)}
                    value={time ? dayjs(time, "HH:mm") : null}
                    format={"HH:mm"}
                  />
                </div>
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
            <Button
              htmlType="submit"
              type="primary"
              className="bg-red-400 !text-white"
            >
              Save
            </Button>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
}

export default WashEdit;
