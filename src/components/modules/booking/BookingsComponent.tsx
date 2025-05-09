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
      <div className="pt-20 flex justify-center">
        <SkeletonLoading />
      </div>
    );
  }
  return (
    <div className="flex flex-col md:flex-row px-10 gap-5 justify-center mb-15">
      <div className="pt-5 p-5 shadow-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1  gap-2">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="border border-gray-400 "
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>

                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="border border-gray-400 "
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>

                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "border-gray-400 pl-3 text-left font-normal",
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
                        className="w-auto p-0 bg-white border-gray-400"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          // selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (hr)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="border border-gray-400"
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
              <FormField
                control={form.control}
                name="totalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>TotalPrice $</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="border border-gray-400 "
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>

                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full flex flex-grow flex-col space-y-1  mt-2">
              <Button
                disabled={!currentBookingStudent?.bookingRequest}
                className=" cursor-pointer border-0 hover:border btn bg-gray-300 text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ..."
                type="submit"
              >
                {isSubmitting ? "Booking..." : "Booking Confirm"}
              </Button>
              {currentBookingStudent
                ? !currentBookingStudent?.bookingRequest && (
                    <p className="text-red-600 text-sm ">
                      Please Wait for the Tutor Approval
                    </p>
                  )
                : currentBookingStudent === null && (
                    <p className="text-red-600 text-sm ">
                      Please Send a Request to This Tutor
                    </p>
                  )}
            </div>
          </form>
        </Form>
      </div>
      <div>
        <div className=" p-5 card bg-base-100 mx-auto min-w-[70%] max-w-4xl h-full flex flex-col md:flex-row justify-center items-center shadow-xl">
          <div className="flex flex-col justify-center">
            <Image
              src={tutor?.profileImage || "/default-profile.png"}
              width={300}
              height={200}
              alt={tutor?.name || "Tutor Profile"}
              className="rounded-md"
            ></Image>
            <span className="text-sm text-center">{tutor?.email}</span>
            <div className="flex gap-1 text-sm md:text-sm lg:text-lg justify-center text-gray-700">
              <FaStar className="text-yellow-500" />
              <FaStar className="text-yellow-500" />
              <FaStarHalfAlt className="text-yellow-500" />
              <FaRegStar className="text-yellow-500" />
            </div>
          </div>
          <div className="card-body ps-0 sm:ps-5">
            <div className="flex justify-center items-center">
              <h2 className="card-title text-xl ">{tutor?.name} </h2>
              <p className=" text-sm md:text-sm  text-gray-700 ">
                ( {tutor?.gradeLevel})
              </p>
            </div>
            <p className=" text-sm md:text-sm lg:text-lg text-gray-700 ">
              <span className="text-gray-900">Subject: </span>{" "}
              {tutor?.subjects?.join(", ")}
            </p>
            <p className=" text-sm md:text-sm lg:text-lg text-gray-700 ">
              <span className="text-gray-900">HourlyRatelity:</span>{" "}
              {tutor?.hourlyRate} $
            </p>
            <p className=" text-sm md:text-sm lg:text-lg text-gray-700 ">
              Category: {tutor?.category}
            </p>

            <p className=" text-sm md:text-sm lg:text-lg text-gray-700 ">
              Phone: {tutor?.phoneNumber}
            </p>

            <p className=" text-sm md:text-sm lg:text-lg text-gray-700 ">
              <span className="text-gray-900"> Avilability:</span>{" "}
              {tutor?.availability
                ?.map(
                  (avail: { day: string; time: string }) =>
                    `${avail.day}: ${avail.time}`
                )
                .join(", ")}
            </p>
            <p className=" text-sm md:text-sm lg:text-lg text-gray-700 ">
              <span className="text-gray-900">Details: {tutor?.bio}</span>{" "}
            </p>
            {/* <div className="card-actions justify-between items-center">
                        <p>
                          <span className="text-sm md:text-sm lg:text-lg text-gray-700">
                            ${tutor.hourlyRate}
                          </span>{" "}
                          hr
                        </p>
                        <div className="flex gap-1 text-sm md:text-sm lg:text-lg text-gray-700">
                          <FaStar className="text-yellow-500" />
                          <FaStar className="text-yellow-500" />
                          <FaStarHalfAlt className="text-yellow-500" />
                          <FaRegStar className="text-yellow-500" />
                        </div>
                      </div> */}
            {/* <div className="card-actions justify-between items-center">
                  <Link href={`/tutors/${tutor._id}`}>
                    <Button className="roudend-ful cursor-pointer hover:text-gray-900 border-0 bg-gray-300 text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ...">
                      Home
                    </Button>
                  </Link>
                  <Link href={"/#"}>
                    <Button className="roudend-ful cursor-pointer hover:text-gray-900 border-0 bg-gray-300 text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ...">
                      Booking
                    </Button>
                  </Link>
                </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingsComponent;
