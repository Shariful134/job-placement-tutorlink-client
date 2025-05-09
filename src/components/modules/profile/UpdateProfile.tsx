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

import {
  FieldValues,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";

import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { Plus } from "lucide-react";
import { updateTutorData } from "@/services/authService";
import { getAllTutors } from "@/services/User";
import UploadWidget from "@/imgaeUpload/UploadWidget";

interface availability {
  day: string;
  time: string;
}

const UpdateProfile = () => {
  const [imageUrl, setImageUrl] = useState<string | "">("");

  const handleImageUpload = (url: string) => {
    setImageUrl(url);
  };

  const { user } = useUser();
  const [tutor, setTutor] = useState<any>([]);

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        if (!user?.userEmail) return;
        const data = await getAllTutors();
        if (data?.data) {
          const foundTutor = data.data.find(
            (item: any) => item.email === user?.userEmail
          );
          setTutor(foundTutor || null);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchTutor();
  }, [user?.userEmail]);

  const form = useForm({
    defaultValues: {
      name: tutor?.name || "",
      email: tutor?.email || "",
      phoneNumber: tutor?.phoneNumber || "0000000000000",
      bio: tutor?.bio || "",
      subjects: tutor?.subjects?.join(", ") || "",
      gradeLevel: tutor?.gradeLevel || "",
      hourlyRate: tutor?.hourlyRate?.toString() || "",
      category: tutor?.category || "",

      availability: tutor?.availability || [{ day: "", time: "" }],
      profileImage: tutor?.profileImage || "",
    },
  });

  useEffect(() => {
    if (tutor) {
      form.reset({
        name: tutor?.name || "",
        email: tutor?.email || "",
        phoneNumber: tutor?.phoneNumber || "0000000000000",
        bio: tutor?.bio || "",
        subjects: tutor?.subjects?.join(", ") || "",
        gradeLevel: tutor?.gradeLevel || "",
        hourlyRate: tutor?.hourlyRate?.toString() || "",
        category: tutor?.category || "",
        availability: tutor?.availability || [{ day: "", time: "" }],
        profileImage: tutor?.profileImage,
      });
    }
  }, [tutor, form]);
  const {
    formState: { isSubmitting },
  } = form;

  const { append: appendAvailability, fields: availabilityFields } =
    useFieldArray({
      control: form.control,
      name: "availability",
    });

  const addAvailavility = () => {
    appendAvailability({ day: "", time: "" });
  };
  const profileImage = imageUrl ? imageUrl : "";
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const availability = data?.availability?.map((item: availability) => ({
      day: item.day || "",
      time: item.time || "",
    }));

    const tutorData = {
      ...data,
      subjects: data?.subjects.split(",").map((sub: string) => sub.trim()),
      hourlyRate: Number(data?.hourlyRate) || 0,
      availability,
      profileImage,
    };
    console.log("tutorData: ", tutorData);
    try {
      const res = await updateTutorData(tutorData, tutor?._id);
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
    <div className="w-full flex-grow  max-w-md p-5 rounded">
      <div className="flex items-center justify-center space-x-2 pb-2">
        <h1 className="font-semibold text-xl">Update Your Profie as Tutotr</h1>
      </div>
      <div className="flex flex-col items-center mb-5 ">
        {" "}
        <div className="flex items-center justify-center mt-5">
          <UploadWidget onImageUpload={handleImageUpload} />
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols1 md:grid-cols-2 gap-2">
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
                  <FormLabel>Email</FormLabel>
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
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
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
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Input
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
              name="subjects"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject Name</FormLabel>
                  <FormControl>
                    <Input
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
              name="gradeLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GradLevel</FormLabel>
                  <FormControl>
                    <Input
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
              name="hourlyRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>HourlyRate</FormLabel>
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
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input
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
            <div className="flex justify-between items-center border-gray-300 border-t border-b py-3 my-5">
              <p className="text-primary font-bold text-xl">Days</p>
              <Button
                onClick={addAvailavility}
                variant="outline"
                className="size-10 cursor-pointer hover:bg-gray-300 border-gray-300  "
                type="button"
              >
                <Plus className="text-primary border-gray-300 " />
              </Button>
            </div>

            {availabilityFields.map((availableField, index) => (
              <div
                key={availableField.id}
                className="grid grid-cols-1 gap-4 md:grid-cols-2 my-5"
              >
                <FormField
                  control={form.control}
                  name={`availability.${index}.day`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Day {index + 1} </FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`availability.${index}.time`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time {index + 1}</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>

          <div className="w-full flex flex-grow flex-col space-y-1  mt-2">
            <Button
              className=" cursor-pointer border-0 hover:border btn bg-gray-300 text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ..."
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

export default UpdateProfile;
