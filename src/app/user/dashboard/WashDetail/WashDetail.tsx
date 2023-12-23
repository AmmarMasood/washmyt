import Modal from "@/app/components/Modal";
import React from "react";

interface IWashDetailProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  washDetail: any;
}

function WashDetail(props: IWashDetailProps) {
  const { show, onClose, onConfirm } = props;
  return (
    <Modal
      title="Wash Detail"
      show={show}
      onClose={onClose}
      onConfirm={onConfirm}
      showCloseButton={false}
    >
      <p>Wasj Detail</p>
    </Modal>
  );
}

export default WashDetail;
