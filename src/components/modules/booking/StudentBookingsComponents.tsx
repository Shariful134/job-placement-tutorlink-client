/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NMTable } from "@/components/ui/core/NMTable";
import { SkeletonLoading } from "@/components/ui/shared/SkeletonLoading";
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

  useEffect(() => {
    const dataFetch = async () => {
      setLoading(true);
      const AllBookingsData = await getAllBookings();
      setAllBookings(AllBookingsData?.data);
      setLoading(false);
    };
    dataFetch();
  }, []);

  const currentBookings = allBookings?.filter(
    (item: any) => item?.student?.email === user?.userEmail
  );

  const handleBookingCancel = async (id: string) => {
    setLoading(true);
    try {
      const res = await cancelBooking(id);
      if (res.success) {
        toast.success(res?.message);
        setAllBookings((prev) => prev.filter((booking) => booking?._id !== id));
        setLoading(false);
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnDef<TBooking>[] = [
    {
      accessorKey: "student",
      header: () => <div className="text-start w-46">Tutor Name</div>,
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage
              src={row?.original?.tutor?.profileImage}
              alt={row?.original?.tutor?.name}
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="text-start font-medium text-gray-800 dark:text-gray-200">
            {row?.original?.tutor?.name}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "subject",
      header: () => <div className="text-start w-66">Subjects</div>,
      cell: ({ row }) => {
        const subjects = row?.original?.tutor?.subjects;
        return (
          <div className="text-start font-medium text-gray-700 dark:text-gray-300">
            {subjects?.join(", ")}
          </div>
        );
      },
    },
    {
      accessorKey: "day",
      header: () => <div className="text-start w-66">Days</div>,
      cell: ({ row }) => {
        const days = row.original?.tutor?.availability?.map((d) => d.day);
        return (
          <div className="text-start font-medium text-gray-700 dark:text-gray-300">
            {days?.join(", ")}
          </div>
        );
      },
    },
    {
      accessorKey: "time",
      header: () => <div className="text-start w-66">Time</div>,
      cell: ({ row }) => {
        const times = row?.original?.tutor?.availability?.map(
          (item) => item.time
        );
        return (
          <div className="text-start font-medium text-gray-700 dark:text-gray-300">
            {times?.join(", ")}
          </div>
        );
      },
    },
    {
      accessorKey: "bookingRequest",
      header: () => <div className="text-start w-26">Request Status</div>,
      cell: ({ row }) => {
        return (
          <div className="text-start">
            {row?.original?.bookingRequest ? (
              <p className="text-green-600 dark:text-green-400 bg-green-200/30 dark:bg-green-600/20 px-2 rounded">
                Accepted
              </p>
            ) : (
              <p className="text-yellow-600 dark:text-yellow-400 bg-yellow-200/30 dark:bg-yellow-600/20 px-2 rounded">
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
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleBookingCancel(row?.original?._id)}
            className="px-2 py-1 h-6 text-sm border-0 rounded bg-red-200/30 dark:bg-red-600/20 text-red-700 dark:text-red-300 hover:bg-red-300/40 dark:hover:bg-red-600/40 transition"
          >
            Cancel
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <SkeletonLoading />
      </div>
    );
  }
  return (
    <div className="p-4 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Request for Bookings</h2>
      <div className="pt-5">
        <NMTable columns={columns} data={currentBookings || []} />
      </div>
    </div>
  );
};

export default StudentBookingsComponents;
