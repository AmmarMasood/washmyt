"use client";

import { Table } from "antd";
import React from "react";
import Button from "./Button";

// icons
import PlusIcon from "../../../public/imgs/plus-icon.svg";
import Image from "next/image";
import Select from "./Select";

interface ITable {
  columns: any;
  data: any;
  heading: string;
  showSearch: boolean;
  showSelect?: boolean;
}
function CustomTable(props: ITable) {
  const { columns, data, heading, showSearch, showSelect } = props;
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-primary-gray font-semibold	text-base">{heading}</h1>
        {showSearch && (
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search"
              className="text-primary-gray text-base font-medium px-3 py-1.5 w-full border focus:border-primary-color active:border-primary-color focus:outline-none bg-secondary-color rounded-xl w-[200px]"
            />

            <Button
              onClick={() => console.log("test")}
              className="flex items-center ml-2 !w-fit pr-7"
            >
              <Image src={PlusIcon} alt="plus" />
              <span className="text-sm ml-1"> Add</span>
            </Button>
          </div>
        )}
      </div>
      <Table columns={columns} dataSource={data} pagination={false} />
    </>
  );
}

export default CustomTable;