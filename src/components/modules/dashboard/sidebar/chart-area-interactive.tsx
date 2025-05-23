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

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
};

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c"];

const ChartAreaInteractive = () => {
  const [allBookings, setAllBookings] = React.useState<TBooking[] | []>([]);
  const { user } = useUser();
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("30d");

  React.useEffect(() => {
    const dataFetch = async () => {
      const AllBookingsData = await getAllBookings();
      setAllBookings(AllBookingsData?.data);
    };
    dataFetch();
  }, []);

  const currentBookings = allBookings?.filter(
    (item: any) => item?.student?.email === user?.userEmail
  );

  const chartData = React.useMemo(() => {
    const dataByDate: { [key: string]: number } = {};
    currentBookings?.forEach((booking: any) => {
      const bookingDate = new Date(booking.createdAt).toLocaleDateString();
      dataByDate[bookingDate] = (dataByDate[bookingDate] || 0) + 1;
    });
    return Object.entries(dataByDate).map(([date, count]) => ({
      date,
      bookings: count,
    }));
  }, [currentBookings]);

  const pieData = React.useMemo(() => {
    const subjectCount: { [key: string]: number } = {};
    currentBookings?.forEach((booking: any) => {
      const subject = booking?.subject || "Unknown";
      subjectCount[subject] = (subjectCount[subject] || 0) + 1;
    });
    return Object.entries(subjectCount).map(([subject, count]) => ({
      name: subject,
      value: count,
    }));
  }, [currentBookings]);

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date();
    let daysToSubtract = 90;
    if (timeRange === "30d") daysToSubtract = 30;
    else if (timeRange === "7d") daysToSubtract = 7;
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="@container/card dark:border-1 dark:border-white">
      <CardHeader className="relative">
        <CardTitle className="dark:text-gray-300">Total Bookings</CardTitle>
        <CardDescription className="dark:text-gray-300">
          Bookings in the selected time range
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Area Chart */}
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full dark dark:text-gray-300"
          >
            <AreaChart className="" data={filteredData}>
              <defs>
                <linearGradient id="fillBookings" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-desktop)"
                    stopOpacity={1}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-desktop)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
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
              <Tooltip
                content={<ChartTooltipContent />}
                isAnimationActive={false}
              />
              <Area
                className=""
                dataKey="bookings"
                type="natural"
                fill="url(#fillBookings)"
                stroke="var(--color-desktop)"
                stackId="a"
                name="Bookings"
              />
            </AreaChart>
          </ChartContainer>

          {/* Pie Chart */}
          <div className="flex justify-center items-center">
            <PieChart className="dark:text-gray-300" width={300} height={250}>
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

export default ChartAreaInteractive;
