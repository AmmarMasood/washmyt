import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

interface ILoading {
  show: boolean;
}
const antIcon = (
  <LoadingOutlined style={{ fontSize: 64, color: "#FF4A4A" }} spin />
);

function Loading(props: ILoading) {
  const { show } = props;
  return show ? (
    <div className="h-[100vh] w-[100vw] absolute flex items-center justify-center z-[100000]  top-0 left-0">
      <Spin indicator={antIcon} />
    </div>
  ) : null;
}

export default Loading;
