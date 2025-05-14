"use client";

import { verifyPayment } from "@/services/request";
import { PaymentVerificationArray } from "@/types/verify";
import Image from "next/image";

import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

import logo from "../../../app/assest/images/tutorlogo.png";
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
        setIsLoading(false);
      }
    };
    fetchData();
  }, [order_id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-10 py-6 text-black dark:text-white transition-colors duration-300">
      <div
        ref={contentRef}
        className="w-full sm:max-w-3xl lg:max-w-[793px] bg-gray-100 dark:bg-gray-900 rounded-md p-5 pt-10 mx-auto shadow-md transition-colors duration-300"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Image
              width={80}
              height={80}
              priority={true}
              src={logo}
              alt="logo"
              className="hidden sm:inline"
            />
          </div>
          <div className="text-end">
            <h3 className="text-cyan-600 text-xl sm:text-2xl">AcademyNest</h3>
            <p className="text-xs sm:text-sm">
              Haque Tower, 10th Floor JA-28/8/D, Mohakhali C/A Dhaka
            </p>
            <p className="text-xs sm:text-sm">(+880) 964-3207001</p>
            <p className="text-xs sm:text-sm">(+880) 1885-022022</p>
            <p className="text-xs sm:text-sm">info@shurjopay.com.bd</p>
          </div>
        </div>

        <hr className="my-4 border-gray-300 dark:border-gray-700" />

        {bookingData?.map((booking, index) => (
          <div key={index}>
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-5">
              <div className="sm:text-start">
                <h3 className="text-sm sm:text-lg font-semibold">
                  Invoice To:
                </h3>
                <p className="text-xs sm:text-sm">{booking.name}</p>
                <p className="text-xs sm:text-sm">{booking.address}</p>
                <p className="text-xs sm:text-sm text-cyan-600">
                  {booking.email}
                </p>
              </div>
              <div className="text-end">
                <h3 className="text-xs sm:text-2xl text-cyan-600 font-semibold">
                  INVOICE No: {booking.invoice_no}
                </h3>
                <p className="text-xs sm:text-sm">Date: {booking.date_time}</p>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="mt-5">
              <div className="text-xs sm:text-sm text-center font-medium bg-gray-200 dark:bg-gray-800 py-2 rounded-t-md">
                PAYMENT SUMMARY
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 px-2 text-xs sm:text-sm bg-gray-100 dark:bg-gray-800 py-2">
                <p>Payment Status:</p>
                <p>{booking.bank_status}</p>
                <p>Method:</p>
                <p>{booking.method}</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 px-2 text-xs sm:text-sm bg-gray-100 dark:bg-gray-800 py-2">
                <p>Amount:</p>
                <p>{booking.amount} BDT</p>
                <p>Currency:</p>
                <p>{booking.currency}</p>
              </div>
              <div className="grid grid-cols-2 px-2 text-xs sm:text-sm bg-gray-100 dark:bg-gray-800 py-2 rounded-b-md">
                <p>Card Number:</p>
                <p>{booking.card_number}</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-end text-xs sm:text-sm font-semibold">
                Subtotal: {booking.amount} BDT
              </p>
              <p className="mt-5 text-xs sm:text-sm">Thank you!</p>
              <p className="text-xs sm:text-sm font-semibold">NOTICE:</p>
              <p className="text-xs sm:text-sm">
                A finance charge of 1.5 to 3% will be made on unpaid balances
                after 7 working days.
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center max-w-3xl mx-auto mt-6">
        <Button
          onClick={() => reactToPrintFn()}
          variant="outline"
          className="rounded-full cursor-pointer border-0 text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 transition"
        >
          Download
        </Button>
      </div>
    </div>
  );
};

export default VerifyBookingComponent;
