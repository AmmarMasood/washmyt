"use client";

import { Table, Select } from "antd";
import React from "react";
import Button from "./Button";

// icons
import PlusIcon from "../../../public/imgs/plus-icon.svg";
import Image from "next/image";
import { on } from "events";

interface ITable {
  columns: any;
  data: any;
  heading: string;
  showSearch: boolean;
  showSelect?: boolean;
  showButton?: boolean;
  onAdd?: () => void;
  onSearch?: (value: any) => void;
  onRowClick?: (record: any) => void;
  pagination: any;
  size?: "small" | "middle" | "large";
  y?: number;
}
function CustomTable(props: ITable) {
  const {
    columns,
    data,
    heading,
    showSearch,
    showSelect,
    showButton,
    onSearch,
    pagination = false,
    onRowClick,
    size,
    y,
  } = props;
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-primary-gray font-semibold	text-base">{heading}</h1>
        {showSearch && (
          <div className="flex items-center justify-between">
            <input
              type="text"
              placeholder="Search"
              style={{
                width: "200px",
              }}
              onChange={(e) => {
                if (props.onSearch) {
                  props.onSearch(e.target.value);
                }
              }}
              className="text-primary-gray text-base font-medium px-3 py-1.5 w-full border focus:border-primary-color active:border-primary-color focus:outline-none bg-secondary-color rounded-xl w-[200px]"
            />
            {showSelect && (
              <Select
                className="text-secondary-color"
                value="New Payment"
                style={{ width: 200, margin: "0 10px" }}
                options={[{ id: "newPayment", value: "New Payment" }]}
              />
            )}

            {showButton && props.onAdd && (
              <Button
                disabled={false}
                onClick={props.onAdd}
                className="flex items-center ml-2 !w-fit pr-7"
              >
                <Image src={PlusIcon} alt="plus" />
                <span className="text-sm ml-1 !text-white"> Add</span>
              </Button>
            )}
          </div>
        )}
      </div>
      <Table
        columns={columns}
        size={size}
        dataSource={data}
        pagination={pagination}
        scroll={{
          y: y,
        }}
        onRow={(record, index) => {
          return {
            onClick: () => {
              if (onRowClick) {
                onRowClick(record);
              }
            },
          };
        }}
      />
    </>
  );
}

export default CustomTable;
