import { Modal as AntdModal } from "antd";
import React from "react";

interface IModal {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  show: boolean;
  showCloseButton?: boolean;
  style?: React.CSSProperties;
  width?: number;
}
const Modal = (props: IModal) => {
  const {
    title,
    children,
    onClose,
    onConfirm,
    show,
    showCloseButton = true,
    style,
    width = 500,
  } = props;

  return (
    <AntdModal
      title={title}
      open={show}
      onOk={onConfirm}
      onCancel={onClose}
      closeIcon={showCloseButton}
      footer={null}
      width={width}
      style={style}
    >
      <>{children}</>
    </AntdModal>
  );
};

export default Modal;
