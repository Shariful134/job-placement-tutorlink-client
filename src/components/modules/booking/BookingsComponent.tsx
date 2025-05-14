/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUser } from "@/context/UserContext";
import { getAllStudent, getAllTutors } from "@/services/User";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { IUsers } from "@/types";
import { confirmBooking, getAllBookings } from "@/services/request";
import { TBooking } from "@/types/bookings";
import { SkeletonLoading } from "@/components/ui/shared/SkeletonLoading";

const BookingsComponent = ({ tutorId }: { tutorId: string }) => {
  const [student, setStudent] = useState<IUsers[] | []>([]);
  const [currentBookingStudent, setCurrentBookingStudent] =
    useState<TBooking | null>(null);
  const [bookings, setBookings] = useState<TBooking[] | []>([]);
  const [tutor, setTutor] = useState<IUsers | undefined>(undefined);
  const [studentId, setStudentId] = useState("");
  const { user, isLoading } = useUser();
  const [time, setTime] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm({
    defaultValues: {
      address: "",
      phone: "",
      dateTime: new Date().toISOString(),
      duration: "",
      totalPrice: totalPrice,
    },
  });
  const {
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setLoading(true);
        const [tutorData, studentData, bookingsData] = await Promise.all([
          getAllTutors(),
          getAllStudent(),
          getAllBookings(),
        ]);
        const foundStudent = studentData?.data?.filter(
          (student: IUsers) => student.email === user?.userEmail
        );
        const foundTutor = tutorData?.data?.filter(
          (tutor: IUsers) => tutor._id === tutorId
        );
        setStudent(foundStudent);

        if (foundTutor?.length > 0) {
          setTutor(foundTutor[0]);
        }
        if (foundStudent?.length > 0) {
          setStudentId(foundStudent[0]?._id);
        }
        if (bookingsData?.data) {
          setBookings(bookingsData?.data);
        }
        setLoading(false);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchTutors();
  }, [user?.userEmail, tutorId]);

  useEffect(() => {
    if (bookings?.length > 0 && studentId) {
      const foundBooking = bookings?.find(
        (booking) =>
          booking.student._id === studentId && booking.tutor._id === tutorId
      );
      setCurrentBookingStudent(foundBooking || null);
    }
  }, [bookings, studentId, tutorId]);
  //calculate totalPrice
  useEffect(() => {
    const newPrice = Number(tutor?.hourlyRate) * time;
    setCalculatedPrice(newPrice);
    setTotalPrice(calculatedPrice);
    form.setValue("totalPrice", newPrice);
  }, [time, calculatedPrice, tutor, form]);

  const currentBookingId = currentBookingStudent?._id ?? "";
  // console.log("currentBookingStudent: ", currentBookingStudent);
  const onSubmit = async (data: FieldValues) => {
    const orderData = {
      ...data,
      tutor: tutorId,
      totalPrice,
      student: studentId,
    };
    // console.log("orderData", orderData);
    // console.log("user", user);
    const toastId = toast.loading("Booking Processing...");
    try {
      const res = await confirmBooking(orderData, currentBookingId);

      if (res?.success) {
        toast.success(res?.message, { id: toastId });
        setTimeout(() => {
          window.location.href = res?.data?.checkout_url;
        }, 3000);
      } else {
        toast.error(res?.message, { id: toastId });
      }
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <SkeletonLoading />
      </div>
    );
  }
  return (
    <div className="flex flex-col md:flex-row px-10 gap-5 justify-center mb-15">
      <div className="pt-5 p-5 shadow-sm bg-white text-gray-900 dark:bg-gray-800 dark:text-white transition-colors duration-300">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-2">
              {/* Address */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-white">
                      Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-white">
                      Phone
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* Date */}
              <FormField
                control={form.control}
                name="dateTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-gray-900 dark:text-white">
                      Date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-left font-normal text-gray-900 dark:text-white pl-3",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="dark:text-gray-300 w-auto p-0 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Duration */}
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-white">
                      Duration (hr)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        {...field}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          setTime(value);
                          field.onChange(value);
                        }}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* Total Price */}
              <FormField
                control={form.control}
                name="totalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-white">
                      Total Price $
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <div className="w-full flex flex-grow flex-col space-y-1 mt-2">
              <Button
                disabled={!currentBookingStudent?.bookingRequest}
                className="cursor-pointer border-0 hover:border bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white"
                type="submit"
              >
                {isSubmitting ? "Booking..." : "Booking Confirm"}
              </Button>

              {/* Conditional messages */}
              {currentBookingStudent ? (
                !currentBookingStudent?.bookingRequest && (
                  <p className="text-red-500 text-sm">
                    Please Wait for the Tutor Approval
                  </p>
                )
              ) : currentBookingStudent === null ? (
                <p className="text-red-500 text-sm">
                  Please Send a Request to This Tutor
                </p>
              ) : null}
            </div>
          </form>
        </Form>
      </div>

      <div>
        <div className="p-5 card bg-white text-black dark:bg-gray-900 dark:text-white mx-auto min-w-[70%] max-w-4xl h-full flex flex-col md:flex-row justify-center items-center shadow-sm transition-colors duration-300">
          <div className="flex flex-col justify-center items-center">
            <Image
              src={tutor?.profileImage || "/default-profile.png"}
              width={300}
              height={200}
              alt={tutor?.name || "Tutor Profile"}
              className="rounded-md"
            />
            <span className="text-sm text-center text-gray-600 dark:text-gray-400">
              {tutor?.email}
            </span>
            <div className="flex gap-1 text-sm md:text-sm lg:text-lg justify-center text-yellow-500 mt-1">
              <FaStar />
              <FaStar />
              <FaStarHalfAlt />
              <FaRegStar />
            </div>
          </div>

          <div className="card-body ps-0 sm:ps-5">
            <div className="flex justify-center items-center gap-2">
              <h2 className="card-title text-xl">{tutor?.name}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                ( {tutor?.gradeLevel} )
              </p>
            </div>

            <p className="text-sm md:text-sm lg:text-lg text-gray-700 dark:text-gray-300">
              <span className="font-semibold dark:text-white">Subject:</span>{" "}
              {tutor?.subjects?.join(", ")}
            </p>

            <p className="text-sm md:text-sm lg:text-lg text-gray-700 dark:text-gray-300">
              <span className="font-semibold dark:text-white">
                Hourly Rate:
              </span>{" "}
              {tutor?.hourlyRate} $
            </p>

            <p className="text-sm md:text-sm lg:text-lg text-gray-700 dark:text-gray-300">
              <span className="font-semibold dark:text-white">Category:</span>{" "}
              {tutor?.category}
            </p>

            <p className="text-sm md:text-sm lg:text-lg text-gray-700 dark:text-gray-300">
              <span className="font-semibold dark:text-white">Phone:</span>{" "}
              {tutor?.phoneNumber}
            </p>

            <p className="text-sm md:text-sm lg:text-lg text-gray-700 dark:text-gray-300">
              <span className="font-semibold dark:text-white">
                Availability:
              </span>{" "}
              {tutor?.availability
                ?.map(
                  (avail: { day: string; time: string }) =>
                    `${avail.day}: ${avail.time}`
                )
                .join(", ")}
            </p>

            <p className="text-sm md:text-sm lg:text-lg text-gray-700 dark:text-gray-300">
              <span className="font-semibold dark:text-white">Details:</span>{" "}
              {tutor?.bio}
            </p>

            {/* Optional Action Buttons */}
            {/*
    <div className="card-actions justify-between items-center mt-4">
      <Link href={`/tutors/${tutor._id}`}>
        <Button className="rounded-full cursor-pointer hover:text-gray-900 border-0 bg-gray-200 text-black dark:bg-gradient-to-r dark:from-indigo-500 dark:via-purple-500 dark:to-pink-500 dark:text-white">
          Home
        </Button>
      </Link>
      <Link href={"/#"}>
        <Button className="rounded-full cursor-pointer hover:text-gray-900 border-0 bg-gray-200 text-black dark:bg-gradient-to-r dark:from-indigo-500 dark:via-purple-500 dark:to-pink-500 dark:text-white">
          Booking
        </Button>
      </Link>
    </div>
    */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingsComponent;
