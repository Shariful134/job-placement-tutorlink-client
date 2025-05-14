/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useUser } from "@/context/UserContext";
import { getAllUsers } from "@/services/User";
import { IUsers } from "@/types";
import { TBooking } from "@/types/bookings";
import { useEffect, useState } from "react";

import { cancelBooking, getAllBookings } from "@/services/request";
import { toast } from "sonner";
import { BookingUpdateComponent } from "./BookingUpdateComponent";
import { Button } from "@/components/ui/button";
import { SkeletonLoading } from "@/components/ui/shared/SkeletonLoading";

const BookingsHistoryComponents = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [bookings, setBookings] = useState<TBooking[] | []>([]);
  const [reFetch, setReFectch] = useState<boolean>(false);
  const [loggedId, setLoggedId] = useState<string | "">("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(2); // Show 2 items per page by default

  const { user } = useUser();
  const email = user?.userEmail;
  console.log("email", email);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Get User
        const allUsers = await getAllUsers();
        const loggedUser = allUsers?.data.find(
          (user: IUsers) => user.email === email
        );

        if (loggedUser) {
          setLoggedId(loggedUser?._id);
        }

        // Get Booking
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

  // Pagination: Get current bookings for the current page
  const indexOfLastBooking = currentPage * itemsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - itemsPerPage;
  const currentBookings = invoices?.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );

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

  // Pagination buttons
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(invoices?.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <SkeletonLoading />
      </div>
    );
  }
  return (
    <div className="pt-0 md:pt-5 dark:bg-gray-900 p-5">
      <h2 className="text-xl font-semibold dark:text-gray-200 text-gray-800">
        Booking History
      </h2>
      <div className="pt-5">
        <section className="container px-4">
          <div className="flex flex-col">
            <div className=" -my-2 overflow-x-auto sm:-mx-6 ">
              <div className="inline-block min-w-full py-2 align-middle">
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 dark:text-gray-100">
                    <thead className="bg-gray-400/55 dark:bg-gray-800 border-b-black dark:border-b-white">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 px-2 text-sm font-normal text-left dark:text-gray-400"
                        >
                          Student Name
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-sm font-normal text-left dark:text-gray-400"
                        >
                          Address
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-sm font-normal text-left dark:text-gray-400"
                        >
                          Phone
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-sm font-normal text-left dark:text-gray-400"
                        >
                          Tutor Name
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-sm font-normal text-left dark:text-gray-400"
                        >
                          Transaction ID
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-sm font-normal text-left dark:text-gray-400"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-sm font-normal text-left dark:text-gray-400"
                        >
                          Subjects
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-sm font-normal text-left dark:text-gray-400"
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-sm font-normal text-left dark:text-gray-400"
                        >
                          Duration
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-sm font-normal text-left dark:text-gray-400"
                        >
                          Total Price
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-sm font-normal text-left w-[25px] dark:text-gray-400"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                      {currentBookings?.map((booking, index) => (
                        <tr
                          key={index}
                          className="border-b-black dark:border-b-white bg-gray-100 dark:bg-gray-900"
                        >
                          <td className="px-2 py-4 text-sm font-medium text-gray-700 dark:text-gray-200">
                            {booking.name}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300">
                            {booking.address}
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-200">
                            {booking.phone}
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-200">
                            {booking.tutorName}
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-200">
                            {booking.transactionID}
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-200">
                            {booking.status}
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-200">
                            {booking.subjects.join(", ")}
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-200">
                            {booking.dateTime}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300">
                            {booking.duration} hr
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300">
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
                                className="transition-colors cursor-pointer btn btn-sm duration-200 inline-flex items-center px-3 py-1 border-0 rounded-md gap-x-2 text-emerald-500 bg-emerald-100/60 dark:bg-gray-800 focus:outline-none"
                              >
                                Cancel
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {invoices?.length === 0 && (
                        <tr>
                          <td
                            colSpan={11}
                            className="text-center text-gray-500 dark:text-gray-300"
                          >
                            No bookings available
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td colSpan={11} className="text-right pr-7 text-sm">
                          <span className="font-semibold">SubTotal</span>:{" "}
                          {totalEarnings} BDT
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="flex items-center justify-between py-4 flex-wrap gap-4">
          {/* Page info */}
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Page {currentPage} of {pageNumbers.length}
          </div>

          {/* Pagination controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Previous Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="dark:bg-gray-400 dark:hover:bg-gray-500"
            >
              Previous
            </Button>

            {/* Page Numbers */}
            {pageNumbers.map((number) => {
              const isCurrent = currentPage === number;
              return (
                <Button
                  key={number}
                  variant={isCurrent ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(number)}
                  className={`transition-colors duration-150 ${
                    isCurrent
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {number}
                </Button>
              );
            })}

            {/* Next Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === pageNumbers.length}
              className="dark:bg-gray-400 dark:hover:bg-gray-500"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingsHistoryComponents;

// /* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { NMTable } from "@/components/ui/core/NMTable";
// import { useUser } from "@/context/UserContext";
// import { cancelBooking, getAllBookings } from "@/services/request";
// import { getAllUsers } from "@/services/User";
// import { IUsers } from "@/types";
// import { TBooking } from "@/types/bookings";
// import { ColumnDef } from "@tanstack/react-table";
// import { useEffect, useState } from "react";
// import { toast } from "sonner";

// const BookingsHistoryComponents = () => {
//   const [loading, setLoading] = useState<boolean>(false);
//   const [bookings, setBookings] = useState<TBooking[] | []>([]);
//   const [reFetch, setReFectch] = useState<boolean>(false);
//   const [loggedId, setLoggedId] = useState<string | "">("");
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [itemsPerPage] = useState<number>(2);

//   const { user } = useUser();
//   const email = user?.userEmail;

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const allUsers = await getAllUsers();
//         const loggedUser = allUsers?.data.find(
//           (user: IUsers) => user.email === email
//         );
//         if (loggedUser) setLoggedId(loggedUser?._id);

//         const allbookings = await getAllBookings();
//         const currentBookings = allbookings?.data?.filter(
//           (booking: TBooking) =>
//             booking.student?._id === loggedUser?._id && booking.duration
//         );
//         setBookings(currentBookings);
//         setLoading(false);
//         setReFectch(false);
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     if (email) {
//       fetchData();
//     }
//   }, [email, reFetch]);

//   const columns: ColumnDef<any>[] = [
//     {
//       accessorKey: "student",
//       header: () => <div className="text-start w-36">Student Name</div>,
//       cell: ({ row }) => (
//         <div className="text-start font-medium text-gray-800 dark:text-gray-200">
//           {row.original?.student?.name}
//         </div>
//       ),
//     },
//     {
//       accessorKey: "tutor",
//       header: () => <div className="text-start w-46">Tutor Name</div>,
//       cell: ({ row }) => (
//         <div className="flex items-center space-x-3">
//           <Avatar>
//             <AvatarImage
//               src={row?.original?.tutor?.profileImage}
//               alt={row?.original?.tutor?.name}
//             />
//             <AvatarFallback>CN</AvatarFallback>
//           </Avatar>
//           <div className="text-start font-medium text-gray-800 dark:text-gray-200">
//             {row?.original?.tutor?.name}
//           </div>
//         </div>
//       ),
//     },
//     {
//       accessorKey: "subjects",
//       header: () => <div className="text-start w-64">Subjects</div>,
//       cell: ({ row }) => (
//         <div className="text-start font-medium text-gray-700 dark:text-gray-300">
//           {row?.original?.tutor?.subjects?.join(", ")}
//         </div>
//       ),
//     },
//     {
//       accessorKey: "days",
//       header: () => <div className="text-start w-64">Days</div>,
//       cell: ({ row }) => {
//         const days = row.original?.tutor?.availability?.map((d: any) => d.day);
//         return (
//           <div className="text-start font-medium text-gray-700 dark:text-gray-300">
//             {days?.join(", ")}
//           </div>
//         );
//       },
//     },
//     {
//       accessorKey: "time",
//       header: () => <div className="text-start w-64">Time</div>,
//       cell: ({ row }) => {
//         const times = row.original?.tutor?.availability?.map(
//           (t: any) => t.time
//         );
//         return (
//           <div className="text-start font-medium text-gray-700 dark:text-gray-300">
//             {times?.join(", ")}
//           </div>
//         );
//       },
//     },
//     {
//       accessorKey: "transactionID",
//       header: () => <div className="text-start w-52">Transaction ID</div>,
//       cell: ({ row }) => (
//         <div className="text-start text-gray-700 dark:text-gray-300">
//           {row.original?.transaction?.id || "N/A"}
//         </div>
//       ),
//     },
//     {
//       accessorKey: "address",
//       header: () => <div className="text-start w-64">Address</div>,
//       cell: ({ row }) => (
//         <div className="text-start text-gray-700 dark:text-gray-300">
//           {row.original?.address}
//         </div>
//       ),
//     },
//     {
//       accessorKey: "dateTime",
//       header: () => <div className="text-start w-64">Date & Time</div>,
//       cell: ({ row }) => (
//         <div className="text-start text-gray-700 dark:text-gray-300">
//           {new Date(row.original?.dateTime).toLocaleString()}
//         </div>
//       ),
//     },
//     {
//       accessorKey: "duration",
//       header: () => <div className="text-start w-36">Duration</div>,
//       cell: ({ row }) => (
//         <div className="text-start text-gray-700 dark:text-gray-300">
//           {row.original?.duration} mins
//         </div>
//       ),
//     },
//     {
//       accessorKey: "phone",
//       header: () => <div className="text-start w-36">Phone</div>,
//       cell: ({ row }) => (
//         <div className="text-start text-gray-700 dark:text-gray-300">
//           {row.original?.phone}
//         </div>
//       ),
//     },
//     {
//       accessorKey: "totalPrice",
//       header: () => <div className="text-start w-36">Total Price</div>,
//       cell: ({ row }) => (
//         <div className="text-start text-gray-700 dark:text-gray-300">
//           ${row.original?.totalPrice}
//         </div>
//       ),
//     },
//     {
//       accessorKey: "bookingRequest",
//       header: () => <div className="text-start w-36">Request Status</div>,
//       cell: ({ row }) => (
//         <div className="text-start">
//           {row?.original?.bookingRequest ? (
//             <p className="text-green-600 dark:text-green-400 bg-green-200/30 dark:bg-green-600/20 px-2 rounded">
//               Accepted
//             </p>
//           ) : (
//             <p className="text-yellow-600 dark:text-yellow-400 bg-yellow-200/30 dark:bg-yellow-600/20 px-2 rounded">
//               Requested
//             </p>
//           )}
//         </div>
//       ),
//     },
//     {
//       accessorKey: "action",
//       header: () => <div className="text-start w-28">Action</div>,
//       cell: ({ row }) => (
//         <div className="flex space-x-2">
//           <button
//             onClick={() => {
//               toast.info("Cancel action clicked!");
//               // cancelBooking(row.original._id);
//             }}
//             className="text-red-600 hover:underline"
//           >
//             Cancel
//           </button>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="p-4 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded shadow">
//       <h2 className="text-lg font-semibold mb-4">Request for Bookings</h2>
//       <div className="pt-5">
//         <NMTable columns={columns} data={bookings || []} />
//       </div>
//     </div>
//   );
// };

// export default BookingsHistoryComponents;
