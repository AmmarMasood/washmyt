import Modal from "@/app/components/Modal";
import React, { useState } from "react";

interface INewLedger {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
}
function NewLedger(props: INewLedger) {
  const { show, onClose, onConfirm } = props;

  return (
    <Modal
      title="Create new entry"
      show={show}
      onClose={onClose}
      onConfirm={onConfirm}
      showCloseButton={false}
    >
      <p>New Entry Details</p>
    </Modal>
  );
}

export default NewLedger;
