import React from "react";

interface IChip {
  text: string;
  className?: string;
}
function Chip({ text, className }: IChip) {
  return (
    <div
      className={`bg-black rounded-full px-[5px] py-[5px] text-xs ${className}`}
    >
      {text}
    </div>
  );
}

export default Chip;
