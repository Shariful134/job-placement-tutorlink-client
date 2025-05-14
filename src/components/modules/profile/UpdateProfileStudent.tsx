"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUser } from "@/context/UserContext";
import UploadWidget from "@/imgaeUpload/UploadWidget";
import { updateProfile } from "@/services/authService";
import { getAllUsers } from "@/services/User";

import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

const UpdateProfileStudent = () => {
  const [currentUser, setCurrentUsers] = useState<any>("");

  const { user } = useUser();

  const [imageUrl, setImageUrl] = useState<string | "">("");

  const handleImageUpload = (url: string) => {
    setImageUrl(url);
  };

  const form = useForm({
    defaultValues: {
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      bio: currentUser?.bio || "",
      phoneNumber: currentUser?.phoneNumber || "00000000000",
      profileImage: currentUser?.profileImage || "",
    },
  });
  const {
    formState: { isSubmitting },
  } = form;

  // fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.userEmail) return;
        const data = await getAllUsers();
        if (data?.data) {
          const foundUser = data.data.find(
            (item: any) => item.email === user?.userEmail
          );
          setCurrentUsers(foundUser);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    if (currentUser) {
      form.reset({
        name: currentUser?.name || "",
        email: currentUser?.email || "",
        bio: currentUser?.bio || "",
        phoneNumber: currentUser?.phoneNumber || "00000000000",
        profileImage: currentUser?.profileImage,
      });
    }
  }, [currentUser, form]);

  const profileImage = imageUrl ? imageUrl : "";
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const updatedData = {
      ...data,
      profileImage,
    };

    try {
      const res = await updateProfile(updatedData, currentUser?._id);
      console.log("res: ", res);
      if (res.success) {
        toast.success(res?.message);
      } else {
        toast.error(res.message);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div className="w-full flex-grow max-w-md rounded bg-white dark:bg-gray-900 p-6 shadow-md dark:shadow-lg text-gray-800 dark:text-gray-100 transition-colors">
      <div className="mb-5 text-center text-2xl font-semibold">
        Update Profile
      </div>

      <div className="flex flex-col items-center mb-5">
        <div className="flex items-center justify-center">
          <UploadWidget onImageUpload={handleImageUpload} />
        </div>
        <div className="w-2/5 flex flex-grow flex-col space-y-1 mt-2" />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col space-y-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-200">
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-200">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
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
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-200">
                    Bio Data
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
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
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-200">
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <Button
              className="mt-4 py-2 px-4 font-semibold rounded bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90 transition"
              type="submit"
            >
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UpdateProfileStudent;
