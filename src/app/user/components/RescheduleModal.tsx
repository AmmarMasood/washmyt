import { Button, Card, DatePicker, Modal, TimePicker, message } from "antd";
import React, { useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";
import CaldendarIcon from "../../../../public/imgs/calendar-icon.svg";
import Image from "next/image";

dayjs.extend(utc);
dayjs.extend(customParseFormat);

function RescheduleModal({ open, onClose, onSubmit }: any) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleDateChange = (e: any) => {
    setDate(e);
  };

  const handleTime = (e: any) => {
    setTime(e);
  };

  const joinDateAndTime = (date: any, time: any) => {
    const d = dayjs(date.$d).format("DD-MM-YYYY");
    const t = dayjs(time.$d).format("H:mm:ss");

    const dateTime = dayjs(`${d} ${t} `, "DD-MM-YYYY H:mm:ss");

    return dateTime.utc().format();
  };

  const verifyFields = () => {
    if (!date || !time) {
      message.error("Please select date and time.");
      return false;
    }
    return true;
  };

  const onSubmitClick = () => {
    if (!verifyFields()) return;
    onSubmit(joinDateAndTime(date, time));
  };

  return (
    <Modal open={open} onCancel={onClose} onOk={onSubmit} footer={false}>
      <>
        <div className="p-4 mt-4 flex flex-col items-center justfiy-center  max-md:p-0 ">
          <h4 className="text-black text-lg text-center mb-6">
            Select a date & time to create a reschedule request
          </h4>
          <div>
            <div className="flex items-center justify-center">
              <DatePicker
                size="large"
                suffixIcon={false}
                picker="month"
                format={"MM"}
                value={date ? dayjs(date, "MM") : null}
                onChange={handleDateChange}
                placeholder="MM"
                allowClear={false}
                className="p-5 mb-6 !w-[90px] rounded-xl border-1 border-black text-black text-lg mr-3"
              />

              <DatePicker
                size="large"
                suffixIcon={false}
                format={"DD"}
                value={date ? dayjs(date, "D") : null}
                onChange={handleDateChange}
                placeholder="DD"
                allowClear={false}
                className="p-5 mb-6 !w-[90px] rounded-xl border-1 border-black text-black text-lg mr-3"
              />

              <DatePicker
                size="large"
                suffixIcon={false}
                format={"YYYY"}
                picker="year"
                value={date ? dayjs(date, "YYYY") : null}
                onChange={handleDateChange}
                placeholder="YYYY"
                allowClear={false}
                className="p-5 mb-6 !w-[90px] rounded-xl border-1 border-black text-black text-lg mr-3"
              />

              <Image src={CaldendarIcon} alt="caldendar" className="-mt-7" />
            </div>
            <div className="flex items-center justify-center">
              <TimePicker
                allowClear={false}
                className="p-5 mb-6 !w-[90px] rounded-xl border-1 border-black text-black text-lg mr-3"
                placeholder="HH"
                size="large"
                showNow={false}
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
                    };
                  }
                }
                hideDisabledOptions={true}
                changeOnBlur={true}
                suffixIcon={false}
                onChange={handleTime}
                value={time ? dayjs(time, "h") : null}
                format={"H"}
              />
              {/* <Input
                  name="hh"
                  placeholder="HH"
                  onChange={handleOnChange}
                  className="p-4 mb-6 !w-[90px] rounded-xl border-1 border-black text-black text-lg mr-3"
                /> */}
              <span className="mb-7 text-black">:</span>
              <TimePicker
                allowClear={false}
                className="p-5 mb-6 !w-[90px] rounded-xl border-1 border-black text-black text-lg ml-3"
                placeholder="MM"
                size="large"
                showNow={false}
                disabledTime={
                  // disable minute with interval of 30
                  () => {
                    return {
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
                onChange={handleTime}
                value={time ? dayjs(time, "m") : null}
                format={"m"}
              />
              {/* <Input
                  name="min"
                  placeholder="MM"
                  onChange={handleOnChange}
                  className="p-4 mb-6 !w-[90px] rounded-xl border-1 border-black text-black text-lg ml-3"
                /> */}
            </div>
          </div>
        </div>
      </>
      <div className="flex w-full justify-end">
        <Button
          type="primary"
          className="bg-primary-color"
          onClick={onSubmitClick}
        >
          Create Request
        </Button>
      </div>
    </Modal>
  );
}

export default RescheduleModal;
