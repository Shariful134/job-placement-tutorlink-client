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
      bio: "Lorem Ipsum has been the industry's standard dummy text...",
      subjects: "",
      gradeLevel: "PostGraduate",
      hourlyRate: "",
      category: "Science",
      ratings: [],
      availability: [
        { day: "Sunday", time: "2:00 AM - 3:00 PM" },
        { day: "Monday", time: "3:00 AM - 4:00 PM" },
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
    <div className="container mx-auto w-full min-h-screen flex-grow px-5 py-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <div className="flex items-center justify-center space-x-2 pb-5">
        <h1 className="font-semibold text-2xl text-center">
          Register as Tutor
        </h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "name", label: "Name", type: "text" },
              { name: "email", label: "Email", type: "text" },
              { name: "password", label: "Password", type: "password" },
              { name: "phoneNumber", label: "Phone Number", type: "text" },
              { name: "bio", label: "Bio", type: "text" },
              { name: "subjects", label: "Subject Name", type: "text" },
              { name: "gradeLevel", label: "Grade Level", type: "text" },
              { name: "hourlyRate", label: "Hourly Rate", type: "number" },
              { name: "category", label: "Category", type: "text" },
            ].map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name as any}
                render={({ field: fieldProps }) => (
                  <FormItem>
                    <FormLabel>{field.label}</FormLabel>
                    <FormControl>
                      <Input
                        type={field.type}
                        className="border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white"
                        {...fieldProps}
                        value={fieldProps.value || ""}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            ))}
          </div>

          <div className="flex gap-4 items-center border-gray-300 dark:border-gray-600 border-t border-b py-4 my-6">
            <p className="text-primary font-bold text-xl">Availability</p>
            <Button
              onClick={addAvailavility}
              variant="outline"
              className="size-10 hover:bg-gray-300 dark:hover:bg-gray-700"
              type="button"
            >
              <Plus className="text-primary" />
            </Button>
          </div>

          {availabilityFields.map((availableField, index) => (
            <div
              key={availableField.id}
              className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mb-5"
            >
              <FormField
                control={form.control}
                name={`availability.${index}.day`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Day {index + 1}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white"
                        value={field.value || ""}
                      />
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
                      <Input
                        {...field}
                        className="border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white"
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}

          <div className="text-center mt-6">
            <Button
              className="px-6 py-2 font-medium text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90"
              type="submit"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RegisterTutor;
