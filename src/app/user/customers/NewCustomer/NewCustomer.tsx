import Modal from "@/app/components/Modal";
import React from "react";

interface INewCustomerProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function NewCustomer(props: INewCustomerProps) {
  const { show, onClose, onConfirm } = props;
  return (
    <Modal
      title="New Customer"
      show={show}
      onClose={onClose}
      onConfirm={onConfirm}
      showCloseButton={false}
    >
      <p>New Customer</p>
    </Modal>
  );
}

export default NewCustomer;
