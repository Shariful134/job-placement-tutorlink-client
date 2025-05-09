"use client";
import { useUser } from "@/context/UserContext";
import { getAllUsers } from "@/services/User";
import { useEffect, useState } from "react";

import { ITutor } from "../home/page";
import { NMTable } from "@/components/ui/core/NMTable";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TBooking } from "@/types/bookings";
import {
  acceptBooking,
  cancelBooking,
  getAllBookings,
} from "@/services/request";

const BookingRequest = () => {
  const { user, setIsLoading } = useUser();
  const [bookings, setBookings] = useState<TBooking[] | []>([]);
  const [users, setUsers] = useState<ITutor[] | []>([]);

  const handleBookingRequest = async (id: string) => {
    await acceptBooking(id);
    const databooking = await getAllBookings();
    setBookings(databooking?.data);
  };

  //handle Booking cancel
  const handleBookingCancel = async (id: string) => {
    await cancelBooking(id);
    setBookings((prev) => prev?.filter((booking) => booking?._id !== id));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [usersData, bookingsData] = await Promise.all([
          getAllUsers(),
          getAllBookings(),
        ]);

        setUsers(usersData?.data);
        setBookings(bookingsData?.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const currentTutor = users?.find((item) => item.email === user?.userEmail);

  const BookingTutor = bookings?.filter(
    (item) => item?.tutor?._id === currentTutor?._id
  );

  console.log(BookingTutor);
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "student",
      header: () => <div className="text-right w-8">Name</div>,
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage
                src={row.original.student.profileImage}
                alt={row.original.student.name}
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="text-right font-medium w-8">
              {row.original.student.name}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "tutor",
      header: () => <div className="text-right w-8">Subjects</div>,
      cell: ({ row }) => {
        const subjects = row.original.tutor?.subjects;

        return (
          <div className="flex items-center space-x-3">
            <div className="text-right font-medium w-8">
              {subjects?.join(", ")}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "bookingRequest",
      header: () => <div className="text-start w-8 ">Request Status</div>,
      cell: ({ row }) => {
        return (
          <div className="flex items-center  space-x-3">
            {row.original.bookingRequest ? (
              <p className="btn text-green-500 bg-green-300/25 font-normal px-2 py-1 h-6 border-0 rounded">
                Accepted
              </p>
            ) : (
              <p className="text-green-500 bg-green-300/25 px-2  rounded">
                Requested
              </p>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "Action",
      header: () => <div className="text-">Action</div>,
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-2">
            {!row.original.bookingRequest && (
              <button
                onClick={() => handleBookingRequest(row?.original?._id)}
                className="btn text-green-500 bg-green-300/25 font-normal px-2 py-1 h-6 border-0 rounded"
              >
                Accepted
              </button>
            )}

            <button
              onClick={() => handleBookingCancel(row?.original?._id)}
              className="btn text-green-500 bg-green-300/25 font-normal px-2 py-1 h-6 border-0 rounded"
            >
              Cancel
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      Request for Bookings
      <div>
        <div className="pt-5">
          <NMTable columns={columns} data={BookingTutor || []}></NMTable>
        </div>
      </div>
    </div>
  );
};

export default BookingRequest;
