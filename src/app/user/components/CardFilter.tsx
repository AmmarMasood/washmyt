import { Select } from "antd";
import React from "react";

interface ICardFilter {
  onHide: () => void;
}
function CardFilter({ onHide }: ICardFilter) {
  return (
    <div className="px-2 flex items-center justify-between mb-5">
      <Select
        className="text-secondary-color"
        defaultValue="7days"
        style={{ width: 120 }}
        bordered={false}
        options={[
          { value: "7days", label: "Last 7 Days" },
          { value: "14days", label: "Last 14 Days" },
          { value: "30days", label: "Last 30 Days" },
        ]}
      />
      <p className="text-primary-color text-sm cursor-pointer" onClick={onHide}>
        Hide
      </p>
    </div>
  );
}

export default CardFilter;
