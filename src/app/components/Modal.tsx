import { Modal as AntdModal } from "antd";

interface IModal {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  show: boolean;
  showCloseButton?: boolean;
}
const Modal = (props: IModal) => {
  const {
    title,
    children,
    onClose,
    onConfirm,
    show,
    showCloseButton = true,
  } = props;

  return (
    <AntdModal
      title={title}
      open={show}
      onOk={onConfirm}
      onCancel={onClose}
      closeIcon={showCloseButton}
      footer={null}
    >
      <>{children}</>
    </AntdModal>
  );
};

export default Modal;
