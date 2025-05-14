"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useUser } from "@/context/UserContext";
import { getAllUsers } from "@/services/User";
import { cancelBooking, getAllBookings } from "@/services/request";
import { IUsers } from "@/types";
import { TBooking } from "@/types/bookings";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button"; // Make sure this path is correct
import { SkeletonLoading } from "@/components/ui/shared/SkeletonLoading";

const TutorBookingsHistoryComponents = () => {
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<TBooking[]>([]);
  const [loggedId, setLoggedId] = useState<string>("");
  const { user } = useUser();
  const email = user?.userEmail;

  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const allUsers = await getAllUsers();
        const loggedUser = allUsers?.data?.find(
          (u: IUsers) => u.email === email
        );
        if (loggedUser) {
          setLoggedId(loggedUser._id);
        }

        const allBookings = await getAllBookings();
        setBookings(allBookings?.data || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [email]);

  const currentBookings = bookings.filter(
    (booking) => booking.tutor?.email === email && booking.duration
  );

  const totalEarnings = currentBookings.reduce(
    (acc, curr) => acc + Number(curr.totalPrice || 0),
    0
  );

  const handleBookingCancel = async (id: string) => {
    try {
      const res = await cancelBooking(id);
      if (res.success) {
        toast.success(res.message);
        setBookings((prev) => prev.filter((booking) => booking._id !== id));
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  const invoices = currentBookings.map((booking) => ({
    name: booking.student?.name,
    tutorName: booking.tutor?.name,
    transactionID: booking.transaction?.id,
    status: booking.status,
    tutor: booking.tutor?._id,
    address: booking.address,
    subjects: booking.tutor?.subjects,
    dateTime: booking.dateTime,
    duration: booking.duration,
    phone: booking.phone,
    totalPrice: booking.totalPrice,
    _id: booking._id,
  }));

  const totalPages = Math.ceil(invoices.length / pageSize);

  const paginatedInvoices = useMemo(() => {
    const start = pageIndex * pageSize;
    return invoices.slice(start, start + pageSize);
  }, [pageIndex, invoices]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <SkeletonLoading />
      </div>
    );
  }
  return (
    <div className="px-4 py-6 text-gray-800 dark:text-gray-100">
      <h2 className="text-2xl font-semibold mb-6">Booking History</h2>
      <div className="overflow-x-auto rounded-lg shadow bg-white dark:bg-gray-900">
        <table className="min-w-full text-sm table-auto divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            <tr>
              {[
                "Student",
                "Address",
                "Phone",
                "Tutor",
                "Transaction",
                "Status",
                "Subjects",
                "Date",
                "Duration",
                "Price",
                "Action",
              ].map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedInvoices.length === 0 ? (
              <tr>
                <td
                  colSpan={11}
                  className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                >
                  No booking history found.
                </td>
              </tr>
            ) : (
              paginatedInvoices.map((booking, idx) => (
                <tr key={idx} className="bg-white dark:bg-gray-950">
                  <td className="px-4 py-3 whitespace-nowrap">
                    {booking.name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {booking.address}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {booking.phone}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {booking.tutorName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {booking.transactionID || "N/A"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {booking.status}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {Array.isArray(booking.subjects)
                      ? booking.subjects.join(", ")
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {booking.dateTime}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {booking.duration} hr
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {booking.totalPrice} BDT
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      onClick={() => handleBookingCancel(booking._id)}
                      className=" px-2 py-1 rounded text-black dark:text-white dark:border-green-600 dark:bg-red-500/25  bg-red-600/75 hover:bg-red-600 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))
            )}
            {paginatedInvoices.length > 0 && (
              <tr className="bg-gray-100 dark:bg-gray-800 font-medium text-right text-gray-700 dark:text-gray-300">
                <td colSpan={11} className="px-4 py-3 text-right">
                  Subtotal:{" "}
                  <span className="font-semibold">{totalEarnings} BDT</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between py-4 flex-wrap gap-4">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Page {pageIndex + 1} of {totalPages}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex((p) => Math.max(p - 1, 0))}
            disabled={pageIndex === 0}
          >
            Previous
          </Button>

          {Array.from({ length: totalPages }, (_, index) => {
            const isCurrent = pageIndex === index;
            return (
              <Button
                key={index}
                variant={isCurrent ? "default" : "outline"}
                size="sm"
                className={
                  isCurrent ? "bg-blue-600 text-white hover:bg-blue-700" : ""
                }
                onClick={() => setPageIndex(index)}
              >
                {index + 1}
              </Button>
            );
          })}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex((p) => Math.min(p + 1, totalPages - 1))}
            disabled={pageIndex >= totalPages - 1}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TutorBookingsHistoryComponents;
