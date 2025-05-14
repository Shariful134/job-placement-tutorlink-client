"use client";
import { IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { TBooking } from "@/types/bookings";
import { useUser } from "@/context/UserContext";
import { getAllBookings } from "@/services/request";
import React, { useEffect, useState } from "react";

export function TSectionCards() {
  const [allBookings, setAllBookings] = useState<TBooking[] | []>([]);
  const { user } = useUser();

  useEffect(() => {
    const dataFetch = async () => {
      const AllBookingsData = await getAllBookings();
      setAllBookings(AllBookingsData?.data || []);
    };
    dataFetch();
  }, []);

  const currentBookings = allBookings?.filter(
    (item: any) => item?.tutor?.email === user?.userEmail
  );
  console.log("currentBookingsss:", currentBookings);
  const paidBookings = currentBookings.filter((item) => item.status === "Paid");

  const totalRevenue = paidBookings.reduce(
    (sum, booking) => sum + Number(booking.totalPrice || 0),
    0
  );

  const totalOrders = paidBookings.length;

  const totalRequests = currentBookings.filter(
    (item) => item.bookingRequest === true
  ).length;

  const accepteRequests = currentBookings.filter(
    (item) => item.bookingRequest === false
  ).length;

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Total Revenue */}
      <Card className="bg-white dark:bg-gray-900 shadow-md">
        <CardHeader>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            Total Revenue
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums text-gray-900 dark:text-gray-100">
            ${totalRevenue.toFixed(2)}
          </CardTitle>
          <Badge
            variant="outline"
            className="text-green-600 border-green-600 dark:text-green-400 dark:border-green-400"
          >
            <IconTrendingUp />
            +12.5%
          </Badge>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm text-gray-600 dark:text-gray-300">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Visitors for the last 6 months
          </div>
        </CardFooter>
      </Card>

      {/* Total Orders */}
      <Card className="bg-white dark:bg-gray-900 shadow-md">
        <CardHeader>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            Total Orders
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums text-gray-900 dark:text-gray-100">
            {totalOrders}
          </CardTitle>
          <Badge
            variant="outline"
            className="text-blue-600 border-blue-600 dark:text-blue-400 dark:border-blue-400"
          >
            <IconTrendingUp />
            +8.2%
          </Badge>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm text-gray-600 dark:text-gray-300">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Consistent bookings <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Orders in the current cycle
          </div>
        </CardFooter>
      </Card>

      {/* Booking Requests */}
      <Card className="bg-white dark:bg-gray-900 shadow-md">
        <CardHeader>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            Requests Accepted
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums text-gray-900 dark:text-gray-100">
            {accepteRequests}
          </CardTitle>
          <Badge
            variant="outline"
            className="text-yellow-600 border-yellow-600 dark:text-yellow-400 dark:border-yellow-400"
          >
            <IconTrendingUp />
            +5.0%
          </Badge>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm text-gray-600 dark:text-gray-300">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Requests pending confirmation <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Awaiting tutor approval</div>
        </CardFooter>
      </Card>

      {/* Static Growth Rate */}
      <Card className="bg-white dark:bg-gray-900 shadow-md">
        <CardHeader>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            Total Requests
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums text-gray-900 dark:text-gray-100">
            {totalRequests}
          </CardTitle>
          <Badge
            variant="outline"
            className="text-green-600 border-green-600 dark:text-green-400 dark:border-green-400"
          >
            <IconTrendingUp />
            +4.5%
          </Badge>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm text-gray-600 dark:text-gray-300">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total requeted for booking <IconTrendingUp className="size-4" />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
