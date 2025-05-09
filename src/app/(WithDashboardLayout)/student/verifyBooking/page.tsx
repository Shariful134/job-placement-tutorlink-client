"use client";
import dynamic from "next/dynamic";

const VerifyBookingComponent = dynamic(
  () => import("@/components/modules/booking/VerifyBookingComponent"),
  {
    ssr: false,
  }
);

const VerifyBookingPage = () => {
  return (
    <div>
      <VerifyBookingComponent />
    </div>
  );
};

export default VerifyBookingPage;
