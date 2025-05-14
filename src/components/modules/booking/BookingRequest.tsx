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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SkeletonLoading } from "@/components/ui/shared/SkeletonLoading";

const BookingRequest = () => {
  const { user, setIsLoading, isLoading } = useUser();
  const [bookings, setBookings] = useState<TBooking[]>([]);
  const [users, setUsers] = useState<ITutor[]>([]);

  const handleBookingRequest = async (id: string) => {
    await acceptBooking(id);
    const updated = await getAllBookings();
    setBookings(updated?.data || []);
  };

  const handleBookingCancel = async (id: string) => {
    await cancelBooking(id);
    setBookings((prev) => prev.filter((booking) => booking?._id !== id));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [usersData, bookingsData] = await Promise.all([
          getAllUsers(),
          getAllBookings(),
        ]);

        setUsers(usersData?.data || []);
        setBookings(bookingsData?.data || []);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const currentTutor = users.find((item) => item.email === user?.userEmail);
  const BookingTutor = bookings.filter(
    (item) => item?.tutor?._id === currentTutor?._id
  );

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "student",
      header: "Student",
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage
              src={row.original.student.profileImage}
              alt={row.original.student.name}
            />
            <AvatarFallback>
              {row.original.student.name?.[0] ?? "S"}
            </AvatarFallback>
          </Avatar>
          <span>{row.original.student.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "subjects",
      header: "Subjects",
      cell: ({ row }) => <div>{row.original.tutor?.subjects?.join(", ")}</div>,
    },
    {
      accessorKey: "bookingRequest",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded text-sm font-medium ${
            row.original.bookingRequest
              ? "bg-green-100 text-green-700 dark:bg-green-800/30 dark:text-green-300"
              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-800/30 dark:text-yellow-300"
          }`}
        >
          {row.original.bookingRequest ? "Accepted" : "Requested"}
        </span>
      ),
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          {!row.original.bookingRequest && (
            <Button
              onClick={() => handleBookingRequest(row.original._id)}
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900"
            >
              Accept
            </Button>
          )}
          <Button
            onClick={() => handleBookingCancel(row.original._id)}
            variant="destructive"
            className="text-black dark:text-white dark:border-green-600 dark:bg-red-500/25  bg-red-600/75 hover:bg-red-600 cursor-pointer"
          >
            Cancel
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <SkeletonLoading />
      </div>
    );
  }
  return (
    <Card className="w-full shadow-lg dark:bg-gray-900 dark:text-white">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">
          Booking Requests
        </CardTitle>
      </CardHeader>
      <CardContent>
        {BookingTutor.length > 0 ? (
          <div className="pt-5">
            <NMTable columns={columns} data={BookingTutor} />
          </div>
        ) : (
          <p className="text-center text-muted-foreground dark:text-gray-400">
            No booking requests found.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingRequest;
