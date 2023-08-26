"use client";

import React from "react";

interface IStepperBar {
  current: number;
  total: number;
}
function StepperBar(props: IStepperBar) {
  const { total, current } = props;
  return (
    <div
      className={`grid gap-4`}
      style={{
        gridTemplateColumns: `repeat(${total}, 1fr)`,
      }}
    >
      {Array(total)
        .fill(0)
        .map((t, i) => (
          <div
            key={i}
            className={`h-2  ${
              i === current ? "bg-primary-color" : "bg-primary-black opacity-20"
            }`}
          ></div>
        ))}
    </div>
  );
}

export default StepperBar;
