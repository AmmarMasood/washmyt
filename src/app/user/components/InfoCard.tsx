import Image from "next/image";
import React from "react";

interface IMultivalue {
  title: string;
  description: string;
}
interface IInfoCard {
  img: string;
  title?: string;
  description?: string;
  bottomDescription?: string;
  multiValues?: IMultivalue[];
}
function InfoCard(props: IInfoCard) {
  const { img, title, description, bottomDescription, multiValues } = props;
  return (
    <div
      className={`bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative ${
        bottomDescription && "pb-8"
      }`}
    >
      <div className="px-6 py-7 h-full flex flex-col justify-around">
        <Image src={img} alt={"about"} className="mb-5" />
        {multiValues ? (
          multiValues.map((v, i) => (
            <div key={i} className={i === multiValues.length - 1 ? "" : "pb-4"}>
              <h2 className="text-xl	font-bold text-black">{v.title}</h2>
              <h4 className="text-primary-gray text-base font-normal mt-0">
                {v.description}
              </h4>
            </div>
          ))
        ) : (
          <div>
            <h2
              className={`text-4xl	font-bold text-black mb-2 ${
                multiValues && "pt-32"
              }`}
            >
              {title}
            </h2>
            <h4 className="text-primary-gray text-base font-normal ">
              {description}
            </h4>
          </div>
        )}
      </div>
      {bottomDescription && (
        <div className="bg-primary-color/[0.1] py-3 px-4 rounded-b-3xl absolute bottom-0 w-full">
          <p className="text-sm	text-primary-color p-0 m-0">
            {bottomDescription}
          </p>
        </div>
      )}
    </div>
  );
}

export default InfoCard;
