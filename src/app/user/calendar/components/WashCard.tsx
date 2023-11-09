import { Tag } from "antd";
import Image from "next/image";
import React from "react";

interface IWashCard {
  className?: string;
  img: string;
  title: string;
  date: string;
  washType?: string;
  schedule: string;
  scheduleColor: string;
}
function WashCard(props: IWashCard) {
  const { className, img, title, date, washType, schedule, scheduleColor } =
    props;

  return (
    <div className={`bg-white rounded-3xl p-4 ${className}`}>
      <div className="flex items-start justify-between mb-2">
        <Image src={img} alt={"wash"} height={50} />
        <p className="font-medium text-primary-gray text-sm">{date}</p>
      </div>
      <h1 className="font-semibold text-xl text-black">{title}</h1>
      <div className="flex items-center mt-2 justify-between">
        <div className="flex items-center">
          <span
            className={`inline-block h-2 w-2 rounded-full mr-2 `}
            style={{
              backgroundColor: scheduleColor,
            }}
          ></span>
          <span className="font-medium text-primary-gray text-sm">
            {schedule}
          </span>
        </div>
        {washType && (
          <Tag color="red" style={{ fontSize: "10px" }}>
            {washType}
          </Tag>
        )}
      </div>
    </div>
  );
}

export default WashCard;
