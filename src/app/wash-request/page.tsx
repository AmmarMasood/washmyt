"use client";

import { useState } from "react";
import PartOne from "./components/PartOne";
import PartTwo from "./components/PartTwo";
import PartThree from "./components/PartThree";
import PartFour from "./components/PartFour";
import PartTen from "./components/PartTen";
import PartNine from "./components/PartNine";
import PartSeven from "./components/PartSeven";
import PartSix from "./components/PartSix";
import PartFive from "./components/PartFive";
import PartEight from "./components/PartEight";

export default function OnboardUser() {
  const [content, setContent] = useState(0);

  const onNext = () => {
    if (content < 10) {
      setContent((prev) => prev + 1);
    } else {
    }
  };

  const onPrev = () => {
    if (content > 0) {
      setContent((prev) => prev - 1);
    } else {
    }
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-secondary-color px-24 py-12 relative max-md:p-2">
      {content === 0 && <PartOne onNext={onNext} />}
      {content === 1 && <PartTwo onNext={onNext} />}
      {content === 2 && <PartThree onNext={onNext} />}
      {content === 3 && <PartFour onNext={onNext} />}
      {content === 4 && <PartFive onNext={onNext} />}
      {content === 5 && <PartSix onNext={onNext} />}
      {content === 6 && <PartSeven onNext={onNext} />}
      {content === 7 && <PartEight onNext={onNext} />}
      {content === 8 && <PartNine onNext={onNext} />}
      {content === 9 && <PartTen onNext={onNext} />}
    </main>
  );
}
