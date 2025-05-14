"use client";

import * as React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { TBooking } from "@/types/bookings";
import { useUser } from "@/context/UserContext";
import { getAllBookings } from "@/services/request";
import { ChartContainer } from "@/components/ui/chart";
import ChartTooltipContent from "./ChartTooltipContent";
import { getAllUsers } from "@/services/User";
import { ITutor } from "@/types/tutors";
import Loading from "@/components/ui/shared/Loading";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c"];

const TChartAreaInteractive = () => {
  const { user, setIsLoading, isLoading } = useUser();
  const isMobile = useIsMobile();
  const [bookings, setBookings] = React.useState<TBooking[]>([]);
  const [users, setUsers] = React.useState<ITutor[]>([]);
  const [timeRange, setTimeRange] = React.useState<"7d" | "30d" | "90d">("30d");

  React.useEffect(() => {
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
        console.error("Error fetching chart data:", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const currentTutor = users.find((item) => item.email === user?.userEmail);
  const BookingTutor = bookings.filter(
    (item) => item?.tutor?._id === currentTutor?._id
  );

  console.log("BookingTutor:", BookingTutor);
  const chartData = React.useMemo(() => {
    const dataByDate: { [key: string]: number } = {};
    BookingTutor.forEach((booking) => {
      const dateStr = new Date(booking.createdAt).toLocaleDateString();
      dataByDate[dateStr] = (dataByDate[dateStr] || 0) + 1;
    });
    return Object.entries(dataByDate).map(([date, count]) => ({
      date,
      bookings: count,
    }));
  }, [BookingTutor]);

  const pieData = React.useMemo(() => {
    const subjectCount: { [key: string]: number } = {};
    BookingTutor.forEach((booking: any) => {
      const subject = booking?.subject || "Unknown";
      subjectCount[subject] = (subjectCount[subject] || 0) + 1;
    });
    return Object.entries(subjectCount).map(([subject, count]) => ({
      name: subject,
      value: count,
    }));
  }, [BookingTutor]);

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = React.useMemo(() => {
    const referenceDate = new Date();
    const startDate = new Date(referenceDate);
    const daysToSubtract =
      timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    startDate.setDate(referenceDate.getDate() - daysToSubtract);

    return chartData.filter((item) => new Date(item.date) >= startDate);
  }, [chartData, timeRange]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loading></Loading>
      </div>
    );
  }
  return (
    <Card className="@container/card dark:border-1 dark:border-white">
      <CardHeader>
        <CardTitle className="dark:text-gray-300">Total Bookings</CardTitle>
        <CardDescription className="dark:text-gray-300">
          Bookings in the selected time range
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Area Chart */}
          <ChartContainer
            className="h-[250px] w-full dark:text-gray-300"
            config={{ visitors: { label: "Bookings" } }}
          >
            <AreaChart className="dark:text-gray-300" data={filteredData}>
              <defs>
                <linearGradient
                  className="dark:text-gray-300"
                  id="fillBookings"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={1} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid
                className="dark:text-gray-300"
                strokeDasharray="3 3"
              />
              <XAxis
                className="dark:text-gray-300"
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <Tooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="bookings"
                stroke="#8884d8"
                fill="url(#fillBookings)"
              />
            </AreaChart>
          </ChartContainer>

          {/* Pie Chart */}
          <div className="flex justify-center items-center">
            <PieChart width={300} height={250}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TChartAreaInteractive;
