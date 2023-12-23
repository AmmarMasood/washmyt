import Modal from "@/app/components/Modal";
import React from "react";

interface INewWashProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
}
function NewWash(props: INewWashProps) {
  const { show, onClose, onConfirm } = props;
  return (
    <Modal
      title="Create new wash request"
      show={show}
      onClose={onClose}
      onConfirm={onConfirm}
      showCloseButton={false}
    >
      <p>New Wash Request</p>
    </Modal>
  );
}

export default NewWash;
