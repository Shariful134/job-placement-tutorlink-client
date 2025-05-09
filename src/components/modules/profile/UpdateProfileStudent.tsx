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
    <div className="w-full flex-grow  max-w-md rounded">
      <div className="mb-5 text-center text-2xl">Update Profile</div>
      <div className="flex flex-col items-center mb-5 ">
        {" "}
        <div className="flex items-center justify-center ">
          <UploadWidget onImageUpload={handleImageUpload} />
        </div>
        <div className=" w-2/5 flex flex-grow flex-col space-y-1  mt-2"></div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col ">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mt-2">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="border border-gray-400  "
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
                  <FormLabel className="mt-2">Bio Data</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="border border-gray-400  "
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
                  <FormLabel className="mt-2">Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="border border-gray-400  "
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>

                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <Button
              className="mt-2  cursor-pointer border-0 hover:border btn bg-gray-300 text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ..."
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
