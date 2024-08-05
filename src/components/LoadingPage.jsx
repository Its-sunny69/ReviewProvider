import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

function LoadingPage() {
  return (
    <>
      <div className="w-full h-dvh">
        <div className="w-full h-svh flex justify-center items-center sm:px-24 py-6">
          <DotLottieReact
            src="https://lottie.host/f2952074-fcac-4053-8dce-652f87934957/dfcpntNUPO.json"
            loop
            autoplay
          />
        </div>
      </div>
    </>
  );
}

export default LoadingPage;
