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
import { useRouter } from "next/navigation";

import { Plus } from "lucide-react";
import { registerTutor } from "@/services/authService";

interface availability {
  day: string;
  time: string;
}

const RegisterTutor = () => {
  const form = useForm({
    defaultValues: {
      name: "Shariful Islam",
      email: "shariful@gmail.com",
      password: "Shariful!23",
      phoneNumber: "+8800000000000",
      bio: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic",
      subjects: "",
      gradeLevel: "PostGraduate",
      hourlyRate: "",
      category: "Science",
      ratings: [],
      availability: [
        { day: "Sunday", time: "2:00 AM- 3:00pm " },
        { day: "Monday", time: "3:00 AM- 4:00pm " },
      ],
      profileImage: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const router = useRouter();

  const { append: appendAvailability, fields: availabilityFields } =
    useFieldArray({
      control: form.control,
      name: "availability",
    });

  const addAvailavility = () => {
    appendAvailability({ day: "", time: "" });
  };
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const availability = data?.availability?.map((item: availability) => ({
      day: item.day || "",
      time: item.time || "",
    }));

    const tutorData = {
      ...data,
      role: "tutor",
      subjects:
        data?.subjects.split(",").map((sub: string) => sub.trim()) || [],
      hourlyRate: Number(data?.hourlyRate) || 0,
      availability,
    };

    try {
      const res = await registerTutor(tutorData);
      console.log(res);
      if (res.success) {
        toast.success(res?.message);
        router.push("/login");
      } else {
        toast.error(res.message);
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  return (
    <div className="w-full flex-grow px-30 p-5 rounded">
      <div className="flex items-center justify-center space-x-2 pb-2">
        <h1 className="font-semibold text-xl">Registration as Tutotr</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols1 md:grid-cols-2 lg:grid-cols-3 gap-2 ">
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
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
            <div className="flex gap-5 items-center border-gray-300 border-t border-b py-3 my-5">
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
                className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 my-5"
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

          <div className="w-full text-center flex flex-grow flex-col space-y-1 mt-2">
            <Button
              className=" w-[96px] cursor-pointer border-0 hover:border btn bg-gray-300 text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ..."
              type="submit"
            >
              {isSubmitting ? "Submiting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RegisterTutor;
