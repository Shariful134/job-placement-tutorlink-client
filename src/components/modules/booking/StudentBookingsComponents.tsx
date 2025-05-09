/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NMTable } from "@/components/ui/core/NMTable";
import { useUser } from "@/context/UserContext";
import { cancelBooking, getAllBookings } from "@/services/request";
import { TBooking } from "@/types/bookings";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const StudentBookingsComponents = () => {
  const [allBookings, setAllBookings] = useState<TBooking[] | []>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useUser();

  //data fetching
  useEffect(() => {
    const dataFetch = async () => {
      const AllBookingsData = await getAllBookings();
      setAllBookings(AllBookingsData?.data);
    };
    dataFetch();
  }, []);

  const currentBookings = allBookings?.filter(
    (item: any) => item?.student?.email === user?.userEmail
  );

  //handle Booking cancel
  const handleBookingCancel = async (id: string) => {
    setLoading(true);
    try {
      const res = await cancelBooking(id);
      if (res.success) {
        toast.success(res?.message);
        setAllBookings((prev) => prev.filter((booking) => booking?._id !== id));
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const columns: ColumnDef<TBooking>[] = [
    {
      accessorKey: "student",
      header: () => <div className="text-start  w-46 ">TutorName</div>,
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage
                src={row?.original?.tutor?.profileImage}
                alt={row?.original?.tutor?.name}
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="text-start font-medium ">
              {row?.original?.tutor?.name}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "subject",
      header: () => <div className="text-start w-66">Subjects</div>,
      cell: ({ row }) => {
        const subjects = row?.original?.tutor?.subjects;

        return (
          <div className="flex items-center space-x-3">
            <div className="text-right font-medium ">
              {subjects?.join(", ")}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "day",
      header: () => <div className="text-start  w-66">Days</div>,
      cell: ({ row }) => {
        const days = row.original?.tutor?.availability?.map((days) => days.day);

        return (
          <div className="flex items-center space-x-3">
            <div className="text-right font-medium">{days?.join(", ")}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "time",
      header: () => <div className="text-start  w-66">Time</div>,
      cell: ({ row }) => {
        const times = row?.original?.tutor?.availability?.map(
          (item) => item.time
        );

        return (
          <div className="flex items-center space-x-3">
            <div className="text-right font-medium ">{times?.join(", ")}</div>
          </div>
        );
      },
    },

    {
      accessorKey: "bookingRequest",
      header: () => <div className="text-start w-26 ">Request Status</div>,
      cell: ({ row }) => {
        return (
          <div className="flex items-center  space-x-3">
            {row?.original?.bookingRequest ? (
              <p className="text-green-500 bg-green-300/25 px-2  rounded">
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
      header: () => <div className="text-start w-4">Action</div>,
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-2">
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
          <NMTable columns={columns} data={currentBookings || []}></NMTable>
        </div>
      </div>
    </div>
  );
};

export default StudentBookingsComponents;
