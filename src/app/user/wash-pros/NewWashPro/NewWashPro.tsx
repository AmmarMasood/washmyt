import Modal from "@/app/components/Modal";
import React from "react";

interface INewWashProProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function NewWashPro(props: INewWashProProps) {
  const { show, onClose, onConfirm } = props;
  return (
    <Modal
      title="New Wash Pro"
      show={show}
      onClose={onClose}
      onConfirm={onConfirm}
      showCloseButton={false}
    >
      <p>New Wash Pro</p>
    </Modal>
  );
}

export default NewWashPro;
