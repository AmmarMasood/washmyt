import Modal from "@/app/components/Modal";
import { Image as AntdImage } from "antd";
import React, { useEffect } from "react";
import LogoIcon from "../../../../../public/imgs/logo-icon.svg";
import EditIcon from "../../../../../public/imgs/edit-icon.svg";
import Image from "next/image";
import WashProEdit from "../WashProEdit/WashProEdit";

interface ICustomerDetailProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  washProDetail: any;
}

const rowClassName = `
   flex items-start justify-between text-right
   mb-4
`;
const keyClassName = `text-primary-gray mr-4`;
const valueClassName = `text-primary-black font-bold w-2/3 flex items-start justify-end flex-wrap`;
const editIconClassName = `cursor-pointer ml-4 mt-1`;

function WashProDetail(props: ICustomerDetailProps) {
  const { show, onClose, onConfirm, washProDetail } = props;
  const [editModal, setEditModal] = React.useState(false);

  return (
    <Modal
      title=""
      show={show}
      onClose={onClose}
      onConfirm={() => {
        setEditModal(false);
      }}
      showCloseButton={true}
      width={700}
    >
      <WashProEdit
        show={editModal}
        onClose={() => setEditModal(false)}
        onConfirm={() => {
          setEditModal(false);
          onConfirm();
        }}
        washProDetail={washProDetail}
      />
      <div className="flex items-center">
        <Image src={LogoIcon} alt="washmyt" />
        <h3 className="font-bold ml-4 text-lg">Wash Pro</h3>
      </div>

      {washProDetail && (
        <>
          <div className="mt-6">
            <div className={rowClassName}>
              <p className={keyClassName}>Business Name</p>
              <div className={valueClassName}>
                <span> {washProDetail.businessName}</span>
                <Image
                  src={EditIcon}
                  alt="washmyt"
                  className={editIconClassName}
                  onClick={() => setEditModal(true)}
                />
              </div>
            </div>
            <div className={rowClassName}>
              <p className={keyClassName}>Contact Name</p>
              <div className={valueClassName}>
                <span>{washProDetail.name}</span>
                <Image
                  src={EditIcon}
                  alt="washmyt"
                  className={editIconClassName}
                  onClick={() => setEditModal(true)}
                />
              </div>
            </div>
            <div className={rowClassName}>
              <p className={keyClassName}>Phone</p>
              <div className={valueClassName}>
                <span>{washProDetail.phoneNumber}</span>
                <Image
                  src={EditIcon}
                  alt="washmyt"
                  className={editIconClassName}
                  onClick={() => setEditModal(true)}
                />
              </div>
            </div>
            <div className={rowClassName}>
              <p className={keyClassName}>Email</p>
              <div className={valueClassName}>
                <span>{washProDetail.email}</span>
                <Image
                  src={EditIcon}
                  alt="washmyt"
                  className={editIconClassName}
                  onClick={() => setEditModal(true)}
                />
              </div>
            </div>
            <div className={rowClassName}>
              <p className={keyClassName}>Website</p>

              <div className={valueClassName}>
                <span>{washProDetail.website}</span>
                <Image
                  src={EditIcon}
                  alt="washmyt"
                  className={editIconClassName}
                  onClick={() => setEditModal(true)}
                />
              </div>
            </div>
            <div className={rowClassName}>
              <p className={keyClassName}>T-shirt size</p>

              <div className={valueClassName}>
                <span>{washProDetail.tShirtSize}</span>
                <Image
                  src={EditIcon}
                  alt="washmyt"
                  className={editIconClassName}
                  onClick={() => setEditModal(true)}
                />
              </div>
            </div>
            <div className={rowClassName}>
              <p className={keyClassName}>Address</p>

              {washProDetail.businessAddress && (
                <div className={valueClassName}>
                  <span>
                    {
                      JSON.parse(washProDetail.businessAddress)
                        .formatted_address
                    }
                  </span>
                  <Image
                    src={EditIcon}
                    alt="washmyt"
                    className={editIconClassName}
                    onClick={() => setEditModal(true)}
                  />
                </div>
              )}
            </div>
            <div className={rowClassName}>
              <p className={keyClassName}>Radius</p>

              <div className={valueClassName}>
                <span>{washProDetail.serviceRadius}</span>
                <Image
                  src={EditIcon}
                  alt="washmyt"
                  className={editIconClassName}
                  onClick={() => setEditModal(true)}
                />
              </div>
            </div>
            <div className={rowClassName}>
              <p className={keyClassName}>Services Offered</p>

              <div className={valueClassName}>
                {washProDetail.services?.map((t: string, key: number) => (
                  <label key={key}>
                    {t.replaceAll("_", " ")}
                    {key !== washProDetail.services.length - 1 ? ",  " : ""}
                  </label>
                ))}

                <Image
                  src={EditIcon}
                  alt="washmyt"
                  className={editIconClassName}
                  onClick={() => setEditModal(true)}
                />
              </div>
            </div>
            <div className={rowClassName}>
              <p className={keyClassName}>Mobile Water</p>

              <div className={valueClassName}>
                <span className={valueClassName}>
                  {washProDetail.mobileWaterCapability ? (
                    <span className="text-green-600">Yes</span>
                  ) : (
                    <span className="text-red-400">No</span>
                  )}
                </span>
                <Image
                  src={EditIcon}
                  alt="washmyt"
                  className={editIconClassName}
                  onClick={() => setEditModal(true)}
                />
              </div>
            </div>
            <div className={rowClassName}>
              <p className={keyClassName}>Mobile Electricity</p>
              <div className={valueClassName}>
                <span className={valueClassName}>
                  {washProDetail.mobileElectricCapability ? (
                    <span className="text-green-600">Yes</span>
                  ) : (
                    <span className="text-red-400">No</span>
                  )}
                </span>
                <Image
                  src={EditIcon}
                  alt="washmyt"
                  className={editIconClassName}
                  onClick={() => setEditModal(true)}
                />
              </div>
            </div>
            <div className={rowClassName}>
              <p className={keyClassName}>Documents Verified</p>
              <div className={valueClassName}>
                <span className={valueClassName}>
                  {washProDetail.documentsVerified ? (
                    <span className="text-green-600">Yes</span>
                  ) : (
                    <span className="text-red-400">No</span>
                  )}
                </span>
                <Image
                  src={EditIcon}
                  alt="washmyt"
                  className={editIconClassName}
                  onClick={() => setEditModal(true)}
                />
              </div>
            </div>
            <div className={rowClassName}>
              <p className={keyClassName}>Accepting Washes</p>

              <div className={valueClassName}>
                <span className={valueClassName}>
                  {washProDetail.acceptingWashes ? (
                    <span className="text-green-600">Yes</span>
                  ) : (
                    <span className="text-red-400">No</span>
                  )}
                </span>
                <Image
                  src={EditIcon}
                  alt="washmyt"
                  className={editIconClassName}
                  onClick={() => setEditModal(true)}
                />
              </div>
            </div>
            <div className={rowClassName}>
              <p className={keyClassName}>Business License Image</p>
              <p className={valueClassName}>
                <AntdImage
                  width={200}
                  src={washProDetail.businessLicenseImage}
                />
              </p>
            </div>
            <div className={rowClassName}>
              <p className={keyClassName}>Insurance Image</p>
              <p className={valueClassName}>
                <AntdImage width={200} src={washProDetail.insuranceImage} />
              </p>
            </div>
            {/* documentsVerified, businessLicenseImage, insuranceImage, acceptingWashes */}
          </div>
        </>
      )}
    </Modal>
  );
}

export default WashProDetail;
