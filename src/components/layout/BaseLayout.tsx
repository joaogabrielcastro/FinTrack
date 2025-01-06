import { useEffect, useState } from "react";
import Logo from "/images/image.png";

const BaseLayout = ({ children }: { children: React.ReactNode }) => {
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    const text = "Where Numbers Tell Your Success Story.";
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setTypedText(text.substring(0, currentIndex) + "|");
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 90);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex">
      <div className="bg-slate-300 w-1/2 h-screen bg-gradient-to-b from-[#99e2f3] to to-[#0e5265] shadow-lg flex flex-col">
        <div className="flex flex-col items-center mt-40">
          <img src={Logo} alt="logo" className="w-4/6" />
          <span className="text-5xl text-center text-white font-extrabold font-mono mb-7 mt-4">
            FINTRACK
          </span>
          <span className="text-3xl text-center text-white font-semibold" id="typedText">
            {typedText}
          </span>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center ml-auto w-1/2 bg-black/10">
        {children}
      </div>
    </div>
  );
};

export default BaseLayout;
