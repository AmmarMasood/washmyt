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
  } = props;

  return (
    <AntdModal
      title={title}
      open={show}
      onOk={onConfirm}
      onCancel={onClose}
      closeIcon={showCloseButton}
      footer={null}
      style={style}
    >
      <>{children}</>
    </AntdModal>
  );
};

export default Modal;
