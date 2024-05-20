import { Select } from "antd";
import React from "react";

interface ICardFilter {
  onHide: () => void;
  options: any;
  value: any;
  onChangeTime: (value: any) => void;
}
function CardFilter({ onHide, onChangeTime, value, options }: ICardFilter) {
  return (
    <div className="px-2 flex items-center justify-between mb-5">
      <Select
        className="text-secondary-color"
        defaultValue={value}
        style={{ width: 120 }}
        onChange={onChangeTime}
        bordered={false}
        options={options}
      />
      <p className="text-primary-color text-sm cursor-pointer" onClick={onHide}>
        Hide
      </p>
    </div>
  );
}

export default CardFilter;
