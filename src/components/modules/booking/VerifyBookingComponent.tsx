"use client";

import { verifyPayment } from "@/services/request";
import { PaymentVerificationArray } from "@/types/verify";
import Image from "next/image";

import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

import logo from "../../../app/assest/images/tutorlin-logo.png";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/shared/Loading";

const VerifyBookingComponent = () => {
  const searchParams = useSearchParams();
  const order_id = searchParams.get("order_id") as string;
  const [bookingData, setBookingData] = useState<PaymentVerificationArray>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: `Invoice_${order_id}`,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const verifyData = await verifyPayment(order_id);
        setBookingData(verifyData?.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [order_id]);

  if (isLoading) {
    return (
      <div className="pt-20 flex justify-center">
        <Loading />
      </div>
    );
  }
  return (
    <div className="px-10 ">
      <div
        ref={contentRef}
        className="w-[240px] sm:w-[550px] max-w-[793px] bg-gray-100/50 p-5 pt-10 mx-auto"
      >
        <div className="flex justify-between ">
          <div>
            <Image
              width={80}
              height={80}
              priority={true}
              src={logo}
              alt="logo"
              className="hidden sm:inline"
            ></Image>
          </div>
          <div className="text-end">
            <h3 className="text-cyan-600 text-2xl">AcademyNest </h3>
            <p className="text-xs sm:text-sm">
              Haque Tower,10th Floor JA-28/8/D,Mohakhali C/A Dhaka
            </p>
            <p className="text-xs sm:text-sm">(+880) 964-3207001</p>
            <p className="text-xs sm:text-sm">(+880) 1885-022022</p>
            <p className="text-xs sm:text-sm">info@shurjopay.com.bd</p>
          </div>
        </div>
        <hr className="text-gray-400 my-2" />
        {bookingData?.map((booking, index) => (
          <div key={index}>
            <div className="flex flex-col md:flex-row justify-between ">
              <div className=" sm:text-start mb-2 sm:mb-0">
                <h3 className="text-sm sm:text-lg ">Invoice To: </h3>
                <p className=" text-xs sm:text-md ">{booking.name}</p>
                <p className="text-xs sm:text-sm">{booking.address}</p>
                <p className="text-xs sm:text-sm text-cyan-600">
                  {booking.email}
                </p>
              </div>
              <div className="text-end">
                <h3 className="text-xs sm:text-2xl text-cyan-600 ">
                  INVOICE No: {booking.invoice_no}{" "}
                </h3>
                <p className="text-xs sm:text-sm">Date: {booking.date_time}</p>
              </div>
            </div>
            <div className="mt-5">
              <div className="text-xs sm:text-sm border-b-1 border-b-white text-center bg-gray-100 py-2  w-full">
                <p>PAYMENT SUMMERY</p>
              </div>
              <div className=" grid grid-cols-2 sm:grid-cols-4 px-2 text-xs sm:text-sm border-b-1 border-b-white bg-gray-100 py-2  w-full">
                <p>Payment Status:</p>
                <p>{booking.bank_status}</p>
                <p>Method:</p>
                <p>{booking.method}</p>
              </div>
              <div className=" grid grid-cols-2 sm:grid-cols-4 px-2 text-xs sm:text-sm border-b-1 border-b-white bg-gray-100 py-2  w-full">
                <p>Amount:</p>
                <p>{booking.amount} BDT</p>
                <p>Currency:</p>
                <p>{booking.currency}</p>
              </div>
              <div className=" grid grid-cols-2 sm:grid-cols-4 px-2 text-xs sm:text-sm border-b-1 border-b-white bg-gray-100 py-2  w-full">
                <p>Card_number:</p>
                <p>{booking.card_number} BDT</p>
              </div>
            </div>
            <div>
              <p className="text-end text-xs sm:text-sm">
                SubTotal:{booking.amount} BDT
              </p>{" "}
              <p className="text-start mt-5 text-xs sm:text-sm">Thank you!</p>{" "}
              <p className="text-start text-xs sm:text-sm">NOTICE:</p>{" "}
              <p className="text-start text-xs sm:text-sm">
                A finance charge of 1.5 to 3% will be made on unpaid balances
                after 7 working days.
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center max-w-3xl mx-auto">
        <Button
          onClick={() => reactToPrintFn()}
          variant="outline"
          className="roudend-full cursor-pointer border-0 bg-gray-300 text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ..."
        >
          Download
        </Button>
      </div>
    </div>
  );
};

export default VerifyBookingComponent;
