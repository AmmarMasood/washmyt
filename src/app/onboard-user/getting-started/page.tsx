"use client";

import { useState } from "react";
import StartOnboarding from "./components/StartOnboarding";
import FirstPart from "./components/FirstPart";
import SecondPart from "./components/SecondPart";
import ThirdPart from "./components/ThirdPart";
import FourthPart from "./components/FourthPart";
import FifthPart from "./components/FifthPart";

export default function OnboardUser() {
  const [content, setContent] = useState(0);

  const onNext = () => {
    if (content < 5) {
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
      {content === 0 && <StartOnboarding onNext={onNext} />}
      {content === 1 && <FirstPart onNext={onNext} />}
      {content === 2 && <SecondPart onNext={onNext} />}
      {content === 3 && <ThirdPart onNext={onNext} />}
      {content === 4 && <FourthPart onNext={onNext} />}
      {content === 5 && <FifthPart />}
    </main>
  );
}
