/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUser } from "@/services/authService";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { loginSchema } from "./loginValidation";
import { useUser } from "@/context/UserContext";

const LoginForm = () => {
  const form = useForm({
    resolver: zodResolver(loginSchema),
  });
  const {
    formState: { isSubmitting },
  } = form;

  const searchparams = useSearchParams();
  const redirect = searchparams.get("redirectPath");
  const router = useRouter();
  const { setIsLoading } = useUser();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const res = await loginUser(data);
      setIsLoading(true);
      if (res?.success) {
        toast.success(res?.message);
        if (redirect) {
          router.push(redirect);
        } else {
          router.push("/");
        }
      } else toast.error(res?.message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  p-4">
      <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white rounded-xl shadow-lg w-full max-w-md p-6">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold">Login to Your Account</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Welcome back! Please enter your credentials
          </p>
        </div>

        {/* DEMO CREDENTIALS */}
        <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
          <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
            <strong>Demo Email:</strong> shariful@gmail.com
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
            <strong>Demo Password:</strong> Shariful!23
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ""}
                      className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                      placeholder="Enter your email"
                    />
                  </FormControl>
                  <FormMessage />
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
                      value={field.value || ""}
                      className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                      placeholder="Enter your password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold py-2 rounded hover:opacity-90 transition"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>

            <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-2">
              Don't have an account?{" "}
              <Link href="/register" className="text-cyan-400 hover:underline">
                Register
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;
