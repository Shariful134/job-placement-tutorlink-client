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

import Link from "next/link";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { registrationSchema } from "./RegisterValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerStudent } from "@/services/authService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const RegisterForm = () => {
  const form = useForm({
    resolver: zodResolver(registrationSchema),
  });

  const {
    formState: { isSubmitting },
  } = form;

  const router = useRouter();

  const password = form.watch("password");
  const confirmPassword = form.watch("confirmPassword");

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const userData = {
      name: data?.name,
      email: data?.email,
      password: data?.password,
    };

    try {
      const res = await registerStudent(userData);
      if (res?.success) {
        toast.success(res?.message);
        router.push("/login");
      } else toast.error(res?.message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 text-gray-800 dark:text-white rounded-xl shadow-lg p-6">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold">Create an Account</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Join us today and start your journey
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                      placeholder="Enter your full name"
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
                      {...field}
                      className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                      placeholder="Enter your email"
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
                      {...field}
                      className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                      placeholder="Create a password"
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                      placeholder="Confirm your password"
                      value={field.value || ""}
                    />
                  </FormControl>
                  {confirmPassword && password !== confirmPassword ? (
                    <FormMessage className="text-red-500">
                      Password does not match
                    </FormMessage>
                  ) : (
                    <FormMessage className="text-red-500" />
                  )}
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={!!confirmPassword && password !== confirmPassword}
              className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold py-2 rounded hover:opacity-90 transition"
            >
              {isSubmitting ? "Registering..." : "Register"}
            </Button>

            <div className="text-sm text-center mt-3 text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="text-cyan-400 hover:underline">
                Login
              </Link>
              <br />
              Want to be a tutor?{" "}
              <Link
                href="/register/tutor"
                className="text-cyan-400 hover:underline"
              >
                Register as Tutor
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default RegisterForm;
