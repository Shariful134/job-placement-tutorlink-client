/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// import Loading from "@/components/ui/shared/Loading";
import { useUser } from "@/context/UserContext";
import { getAllUsers } from "@/services/User";
import { IUsers } from "@/types";
import { TBooking } from "@/types/bookings";
import { useEffect, useState } from "react";

import { cancelBooking, getAllBookings } from "@/services/request";
import { toast } from "sonner";
import { BookingUpdateComponent } from "./BookingUpdateComponent";

const BookingsHistoryComponents = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [bookings, setBookings] = useState<TBooking[] | []>([]);

  const [reFetch, setReFectch] = useState<boolean>(false);

  const [loggedId, setLoggedId] = useState<string | "">("");

  const { user } = useUser();
  const email = user?.userEmail;
  console.log("email", email);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        //get User
        const allUsers = await getAllUsers();

        const loggedUser = allUsers?.data.find(
          (user: IUsers) => user.email === email
        );
        if (loggedUser) {
          setLoggedId(loggedUser?._id);
        }

        //get Booking
        const allbookings = await getAllBookings();
        const currentBookings = allbookings?.data?.filter(
          (booking: TBooking) =>
            booking.student?._id === loggedUser?._id && booking.duration
        );
        setBookings(currentBookings);
        setLoading(false);
        setReFectch(false);
      } catch (error) {
        console.log(error);
      }
    };

    if (email) {
      fetchData();
    }
  }, [email, reFetch]);

  const totalEarnings = bookings?.reduce((accu, booking) => {
    return accu + (Number(booking.totalPrice) || 0);
  }, 0);
  console.log("bookings: ", bookings);
  const invoices = bookings?.map((booking: TBooking) => ({
    name: booking.student?.name,
    tutorName: booking.tutor?.name,
    transactionID: booking?.transaction?.id,
    status: booking.status,
    tutor: booking.tutor?._id,
    address: booking.address,
    subjects: booking.tutor?.subjects,
    dateTime: booking.dateTime,
    duration: booking.duration,
    phone: booking.phone,
    totalPrice: booking.totalPrice,
    action: "",
    _id: booking._id,
  }));

  const handleBookingCancel = async (id: string) => {
    console.log(id);
    try {
      const res = await cancelBooking(id);
      if (res.success) {
        toast.success(res?.message);
        setBookings((prev) => prev.filter((booking) => booking?._id !== id));
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="pt-0 md:pt-5">
      <h2>BookingHistory</h2>
      <div className="pt-5 ">
        <section className="container px-4">
          <div className="flex flex-col">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle">
                <div className="overflow-hidden ">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 ">
                    <thead className="bg-gray-400/55 dark:bg-gray-800 border-b-black">
                      <tr className="">
                        <th
                          scope="col"
                          className="py-3.5 px-2  text-sm font-normal text-left rtl:text-right t0 dark:text-gray-400"
                        >
                          <div className="flex items-center gap-x-3">
                            <button className="flex items-center gap-x-2">
                              <span>StudentName</span>
                            </button>
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right  dark:text-gray-400"
                        >
                          Address
                        </th>

                        <th
                          scope="col"
                          className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right  dark:text-gray-400"
                        >
                          Phone
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right  dark:text-gray-400"
                        >
                          TutorName
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right  dark:text-gray-400"
                        >
                          TransactionID
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right  dark:text-gray-400"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right  dark:text-gray-400"
                        >
                          Subjects
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right  dark:text-gray-400"
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right  dark:text-gray-400"
                        >
                          Duration
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right  dark:text-gray-400"
                        >
                          TotalPrice
                        </th>
                        <th
                          scope="col"
                          className="px-4 pe-6 py-3.5 text-sm font-normal text-left rtl:text-right w-[25px]  dark:text-gray-400"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900 ">
                      {invoices?.map((booking, index) => (
                        <tr key={index} className="border-b-black bg-gray-100">
                          <td className="px-2 py-4 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                            <div className="inline-flex items-center gap-x-3">
                              <span>{booking.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                            {booking.address}
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                            <div className="inline-flex items-center  py-1 rounded-full gap-x-2 dark:bg-gray-800">
                              <h2 className="text-sm font-normal">
                                {" "}
                                {booking.phone}
                              </h2>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                            <div className="inline-flex items-center  py-1 rounded-full gap-x-2 dark:bg-gray-800">
                              {booking.tutorName}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                            <div className="inline-flex items-center  py-1 rounded-full gap-x-2 dark:bg-gray-800">
                              <h2 className="text-sm font-normal">
                                {" "}
                                {booking?.transactionID}
                              </h2>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                            <div className="inline-flex items-center py-1 rounded-full gap-x-2 dark:bg-gray-800">
                              <h2 className="text-sm font-normal">
                                {" "}
                                {booking?.status}
                              </h2>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                            <div className="inline-flex items-center py-1 rounded-full gap-x-2 dark:bg-gray-800">
                              <h2 className="text-sm font-normal">
                                {Array.isArray(booking?.subjects)
                                  ? booking.subjects.join(", ")
                                  : "No subjects"}
                              </h2>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                            <div className="inline-flex items-center  py-1 rounded-full gap-x-2 dark:bg-gray-800">
                              <h2 className="text-sm font-normal">
                                {booking.dateTime}
                              </h2>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                            <div className="flex items-center gap-x-2">
                              <p className="text-xs font-normal text-gray-600 dark:text-gray-400">
                                {booking.duration} <sub>hr</sub>
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                            {booking.totalPrice} BDT
                          </td>
                          <td className="px-4 py-4 text-sm whitespace-nowrap">
                            <div className="flex items-center gap-x-6">
                              <BookingUpdateComponent
                                setReFectch={setReFectch}
                                id={booking._id}
                              ></BookingUpdateComponent>
                              <button
                                onClick={() => handleBookingCancel(booking._id)}
                                className=" transition-colors cursor-pointer btn btn-sm duration-200  inline-flex items-center px-3 py-1 border-0  rounded-md gap-x-2 text-emerald-500 bg-emerald-100/60 dark:bg-gray-800 focus:outline-none"
                              >
                                Cancel
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {!Array.isArray(invoices) || invoices?.length === 0 ? (
                        ""
                      ) : (
                        <tr className="border-b-black text-start">
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td>{""}</td>
                          <td className="text-end pr-7 text-sm w-[25px] ">
                            <span className="font-semibold">SubTotal</span>:{" "}
                            {totalEarnings} BTD
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BookingsHistoryComponents;
