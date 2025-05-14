"use client";
import photo from "../../../app/assest/images/ContactImg.png";
import Image from "next/image";
import Link from "next/link";
import { FaLocationDot } from "react-icons/fa6";
import { FaClock, FaGreaterThan, FaPhone } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/context/UserContext";
import { SkeletonLoading } from "@/components/ui/shared/SkeletonLoading";

const ContactComponents = () => {
  const { isLoading } = useUser();

  //handle loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <SkeletonLoading />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 pb-5 mb-10 mt-5">
      <div className="relative ">
        <Image
          src={photo}
          priority={true}
          width={1900}
          height={600}
          alt="BannerImg"
        ></Image>
        <div className="absolute  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
          <h2 className=" text-xs md:text-xl lg:text-5xl dark:text-gray-300 ">
            Contact
          </h2>
          <div className="flex items-center text-xs md:text-sm gap-1">
            <Link
              className="hover:underline hover:text-fuchsia-700 dark:text-gray-300"
              href={"/"}
            >
              Home
            </Link>
            <FaGreaterThan className=" text-rose-500" />
            <Link
              className="hover:underline hover:text-fuchsia-700 dark:text-gray-300 "
              href={"/contact"}
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-5 flex flex-col items-center justify-center">
        <h2 className="text-xl dark:text-gray-300 md:text-2xl lg:text-4xl text-center md:text-start max-w-[344px] font-semibold ">
          Get In Touch With Us
        </h2>
        <p className="text-sm md:text-sm dark:text-gray-300 lg:text-lg mt-4 max-w-[644px] text-center ">
          For More Information About Our Product & Services. Please Feel Free To
          Drop Us An Email. Our Staff Always Be There To Help You Out. Do Not
          Hesitate!
        </p>
      </div>
      <div className="mt-10 md:mt-20 grid grid-cols-2 gap-5">
        <div className="flex flex-col gap-10">
          <div>
            <div className="flex items-center">
              <FaLocationDot className="dark:text-gray-300" />

              <h2 className="text-sm dark:text-gray-300 sm:text-md md:text-xl text-center md:text-start font-semibold ">
                Address
              </h2>
            </div>
            <p className="text-sm dark:text-gray-300 md:text-sm lg:text-lg ps-5 ">
              236 5th SE Avenue, New York NY10000, United States
            </p>
          </div>
          <div>
            <div className="flex gap-1 items-center">
              <FaClock className="dark:text-gray-300" />

              <h2 className="text-sm dark:text-gray-300 sm:text-md md:text-xl text-center md:text-start font-semibold ">
                Working Time
              </h2>
            </div>
            <p className="text-sm dark:text-gray-300 md:text-sm lg:text-lg ps-5 ">
              Monday-Friday: 9:00 - 22:00 Saturday-Sunday: 9:00 - 21:00
            </p>
          </div>
          <div>
            <div className="flex gap-1 items-center">
              <FaPhone className="dark:text-gray-300" />

              <h2 className="text-sm dark:text-gray-300 sm:text-md md:text-xl text-center md:text-start font-semibold ">
                Phone
              </h2>
            </div>
            <p className="text-sm md:text-sm dark:text-gray-300 lg:text-lg ps-5 ">
              Mobile: +(84) 546-6789 Hotline: +(84) 456-6789
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-sm md:text-sm dark:text-gray-300 lg:text-lg ">
              Your Name
            </p>
            <Input
              type="text"
              placeholder="name"
              className="border-1 dark:text-gray-300 border-gray-400 max-w-[528px]"
            />
          </div>
          <div>
            <p className="text-sm md:text-sm lg:text-lg dark:text-gray-300">
              Email
            </p>
            <Input
              type="text"
              placeholder="Email"
              className="border-1 dark:text-gray-300 border-gray-400 max-w-[528px]"
            />
          </div>
          <div>
            <p className="text-sm dark:text-gray-300 md:text-sm lg:text-lg ">
              Subject
            </p>
            <Input
              type="text"
              placeholder="subject"
              className="border-1 dark:text-gray-300 border-gray-400 max-w-[528px]"
            />
          </div>
          <div>
            <p className="text-sm dark:text-gray-300 md:text-sm lg:text-lg ">
              Message
            </p>

            <Textarea
              placeholder="message"
              className="border-1 dark:text-gray-300 border-gray-400 max-w-[528px] "
            />
          </div>
          <div>
            <Button className=" cursor-pointer px-10 hover:text-gray-900 border-0 bg-gray-300 text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactComponents;
