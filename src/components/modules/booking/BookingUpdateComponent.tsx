"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getSingleBooking, updateBooking } from "@/services/request";
import { TBooking } from "@/types/bookings";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "sonner";

export function BookingUpdateComponent({
  id,
  setReFectch,
}: {
  id: string;
  setReFectch: Dispatch<SetStateAction<boolean>>;
}) {
  const [bookingData, setBookingData] = useState<TBooking | undefined>(
    undefined
  );

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [time, setTime] = useState(0);
  const form = useForm({
    defaultValues: {
      address: "",
      phone: "",
      duration: 0,
      totalPrice: 0,
    },
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getSingleBooking(id);
        setBookingData(res?.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const {
    formState: { isSubmitting },
  } = form;
  useEffect(() => {
    if (bookingData) {
      form.reset({
        address: bookingData.address || "",
        phone: bookingData.phone || "",
        duration: Number(bookingData.duration) || 0,
        totalPrice: Number(bookingData.totalPrice) || 0,
      });
    }
  }, [bookingData, form.reset]);

  useEffect(() => {
    const newPrice = Number(bookingData?.tutor?.hourlyRate) * time;
    form.setValue("totalPrice", newPrice);
  }, [time, form]);

  const onSubmit = async (data: FieldValues) => {
    try {
      const res = await updateBooking(data, id);
      if (res?.success) {
        toast?.success(res?.message);
        setReFectch(true);
        setOpenModal(false);
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      console.log(error);
    }
    console.log(data);
  };

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogTrigger asChild>
        <button className=" transition-colors cursor-pointer btn btn-sm duration-200  inline-flex items-center px-3 py-1 border-0  rounded-md gap-x-2 text-emerald-500  bg-emerald-100/60 dark:bg-gray-800 focus:outline-none">
          Update
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Update Your Booking</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
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
            <div>
              <Button
                className="mt-2 cursor-pointer border-0 hover:border btn bg-gray-300 text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ..."
                type="submit"
              >
                {isSubmitting ? "Updating..." : "Update"}
              </Button>
            </div>
          </form>
        </Form>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
