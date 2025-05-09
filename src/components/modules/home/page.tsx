/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Image from "next/image";
import banner from "../../../app/assest/images/banner-2.png";
import bkash from "../../../app/assest/images/bkash1.png";
import nagad from "../../../app/assest/images/Nagad-Logo.wine.png";
import rocket from "../../../app/assest/images/rocket.png";
import groupd from "../../../app/assest/images/Groupe.jpg";

import { Card, CardContent } from "@/components/ui/card";
import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface Availability {
  day: string;
  time: string;
}

export interface ITutor {
  _id: string;
  name: string;
  email: string;
  bio: string;
  category: string;
  gradeLevel: string;
  hourlyRate: number;
  phoneNumber: string;
  profileImage: string;
  role: "tutor" | "student" | "admin";
  subjects: string[];
  ratings: number[];
  availability: Availability[];
  createdAt: string;
  updatedAt: string;
}

import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";
import { getAllUsers } from "@/services/User";
import Link from "next/link";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import {
  createReviewComments,
  getAllReviewComments,
} from "@/services/User/ReviewComment";
import { IReview } from "@/types/review";
import { useUser } from "@/context/UserContext";
import { getAllBooking, requestBooking } from "@/services/request";
import { toast } from "sonner";

import { SkeletonLoading } from "@/components/ui/shared/SkeletonLoading";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageSquareMore } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import StarRating from "../starRating/StarRating";
import ShowRating from "../starRating/ShowRating";
import FeatureSection from "./featured/FeaturedComponent";

const HomeComponent = () => {
  const [tutors, setTutors] = useState<ITutor[] | []>([]);
  const [isUser, setIsUser] = useState<ITutor[] | []>([]);
  const [reviews, setReviews] = useState<IReview[] | []>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [requestedTutors, setRequestedTutors] = useState<string[]>([]);
  const [acceptedTutors, setAccetedTutors] = useState<string[]>([]);

  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedPrice, setSelectedPrice] = useState<string>("");
  const [filteredSubjects, setFilteredSubjects] = useState<string[]>([]);

  const [tutorId, setTutorId] = useState("");

  const [openModal, setOpenModal] = useState<boolean>(false);

  const { user, ratings } = useUser();

  const form = useForm();
  console.log(reviews);
  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setLoading(true);

        const usersData = await getAllUsers();
        const data = await getAllReviewComments();
        setReviews(data?.data);

        const loggedUser = usersData?.data?.filter(
          (item: ITutor) => item.email === user?.userEmail
        );

        setIsUser(loggedUser);

        const allTutor = usersData?.data?.filter(
          (item: ITutor) => item.role === "tutor"
        );
        setTutors(allTutor);

        if (user) {
          const bookingsData = await getAllBooking();

          const tutorIdList = bookingsData?.data
            ?.filter((item: any) => item.student?._id === loggedUser[0]?._id)
            .map((item: any) => item.tutor);
          setRequestedTutors(tutorIdList);

          // filter out the checking accepted request
          const acceptedTutorId = bookingsData?.data
            ?.filter(
              (item: any) =>
                item.bookingRequest === true &&
                item.student?._id === loggedUser[0]?._id
            )
            .map((item: any) => item.tutor);
          setAccetedTutors(acceptedTutorId);
          setLoading(false);
        }

        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchTutors();
  }, [user]);

  useEffect(() => {
    const allSubjects = [
      ...new Set(tutors?.flatMap((tutor) => tutor.subjects)),
    ];

    setFilteredSubjects(allSubjects);
  }, [tutors]);

  const filteredTutors = tutors
    ?.filter((tutor) => {
      const searchQuery = searchValue.trim().toLowerCase();

      const categoryMatch =
        !selectedCategory ||
        selectedCategory === "All" ||
        tutor.category === selectedCategory;

      const subjectMatch =
        !selectedSubject ||
        selectedSubject === "All" ||
        tutor.subjects.includes(selectedSubject);

      const priceMatch =
        !selectedPrice ||
        selectedPrice === "All" ||
        (() => {
          const [min, max] = selectedPrice.split("-").map(Number);
          return tutor.hourlyRate >= min && tutor.hourlyRate <= max;
        })();

      const searchMatch =
        !searchQuery ||
        tutor.name.toLowerCase().includes(searchQuery) ||
        tutor.category.toLowerCase().includes(searchQuery) ||
        tutor.subjects.some((subject) =>
          subject.toLowerCase().includes(searchQuery)
        ) ||
        (!isNaN(Number(searchQuery)) &&
          tutor.hourlyRate <= Number(searchQuery));

      return categoryMatch && subjectMatch && priceMatch && searchMatch;
    })
    .slice(0, 8);

  //handle Booking Request
  const handleRequest = async (id: string) => {
    const requestData = {
      student: isUser[0]?._id,
      tutor: id,
    };

    try {
      const res = await requestBooking(requestData);

      if (res.success) {
        toast.success(res.message);
        setRequestedTutors((prev) => [...(prev || []), id]);
      } else {
        toast.success(res.message);
      }
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

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);

    const filteredTutors = tutors?.filter((tutor) => tutor.category === value);
    const subjectsInCategory = [
      ...new Set(filteredTutors?.flatMap((tutor) => tutor.subjects)),
    ];

    setFilteredSubjects(["All", ...subjectsInCategory]);
  };

  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value);
  };

  const handlePriceChange = (value: string) => {
    setSelectedPrice(value);
  };

  const onSubmit = async (data: FieldValues) => {
    const review = {
      ...data,
      rating: ratings,
      tutor: tutorId,
      student: isUser[0]?._id,
    };

    try {
      setLoading(true);
      const res = await createReviewComments(review);
      if (res?.success) {
        toast.success(res?.message);
      } else toast.success(res?.message);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const ratingsMap: any = {};
  reviews?.forEach(({ tutor, rating }) => {
    if (!ratingsMap[tutor._id]) {
      ratingsMap[tutor._id] = [];
    }
    ratingsMap[tutor._id].push(rating);
  });

  const updatedTutors = filteredTutors?.map((tutor) => ({
    ...tutor,
    ratings: ratingsMap[tutor._id] || tutor.ratings,
  }));

  const allCategories = updatedTutors?.map((tutor) => tutor.category);
  const categories = [...new Set(allCategories)];

  return (
    <div>
      {/* =============================Banner section=========================== */}
      <div className="container mx-auto px-2 flex flex-col md:flex-row items-center pt-15 md:pt-20">
        <div className="pt-5 text-center md:text-start">
          <h2 className="text-2xl md:text-3xl lg:text-5xl  ">
            Learn Better, <span className="text-pink-500">AcademyNest !</span>
          </h2>
          <p className="text-sm md:text-sm lg:text-lg text-gray-700 mt-4">
            Looking for the best tutors? TutorLink 🎓 connects students with
            expert tutors for personalized learning. Find tutors by subject,
            grade, or expertise and book sessions effortlessly. Learn smarter,
            achieve more!
          </p>

          <div className="max-w-md  flex-grow my-2 mx-auto md:mx-0">
            <input
              type="text"
              placeholder="Search for tutors"
              className=" w-full min-h-[37px] max-w-6xl rounded-md border border-gray-400 px-5  text-sm md:text-sm lg:text-lg text-gray-700"
            />
          </div>
          <Button
            variant="outline"
            className="roudend-full mt-1 mb-5 border-0 bg-gray-300 text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
          >
            Explore Tutors
          </Button>
        </div>
        <div className="flex justify-center">
          <Image
            src={banner}
            priority={true}
            width={1100}
            height={650}
            alt="BannerImg"
          ></Image>
        </div>
      </div>
      <div className="container mx-auto px-2">
        <div className="flex justify-center items-center bg-gray-200 ">
          <Image
            src={bkash}
            priority={true}
            width={100}
            height={110}
            alt="BannerImg"
          ></Image>
          <Image
            src={nagad}
            priority={true}
            width={100}
            height={110}
            alt="BannerImg"
          ></Image>
          <Image
            src={rocket}
            priority={true}
            width={100}
            height={110}
            alt="BannerImg"
          ></Image>
        </div>
      </div>

      {/* =========================category section ========================= */}
      <div>
        <div className="container mx-auto mt-5 px-2 ">
          <h2 className="text-xl md:text-2xl lg:text-4xl text-center md:text-start  mb-5 ">
            Course <span className="text-pink-500">Categories ____</span>
          </h2>
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-y-3 mb-5 items-center gap-2 mt-2">
              {categories?.map((category: string, index: number) => (
                <Card
                  key={index}
                  className="w-[95%] border border-gray-200 hover:shadow-lg"
                >
                  <Link href={`/category/${category}`}>
                    <CardContent className="flex flex-col items-center">
                      <p className="text-sm md:text-sm lg:text-lg  ">
                        {category}
                      </p>

                      <div className="flex gap-1">
                        <FaStar className="text-yellow-500" />
                        <FaStar className="text-yellow-500" />
                        <FaStarHalfAlt className="text-yellow-500" />
                        <FaRegStar className="text-yellow-500" />
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* =============================benifit section======================== */}
      <div className="container mx-auto px-2 flex flex-col-reverse md:flex-row  items-center gap-5 mt-5 md:mt-15">
        <div className="flex justify-center">
          <Image
            src={groupd}
            width={1100}
            priority={true}
            height={650}
            alt="BannerImg"
          ></Image>
        </div>
        <div className="pt-5 text-start">
          <h2 className="text-xl md:text-2xl lg:text-4xl  ">
            Benifits of <span className="text-pink-500">e_Learn Tutorlink</span>
          </h2>
          <p className="text-sm md:text-sm lg:text-lg text-gray-700 mt-4">
            Looking for the best tutors? TutorLink 🎓 connects students with
            expert tutors for personalized learning. Find tutors by subject,
            grade, or expertise and book sessions effortlessly. Learn smarter,
            achieve more!
          </p>
          <ul className="list-disc pl-5 text-start text-sm md:text-sm lg:text-lg text-gray-700 mt-4">
            <li>Find expert tutors by subject, grade, and expertise.</li>
            <li>Personalized learning experience tailored to your needs.</li>
            <li>Book sessions at your convenience.</li>
            <li>Access a variety of subjects and grades for learning.</li>
            <li>Affordable and reliable education from experienced tutors.</li>
          </ul>

          <Button
            variant="outline"
            className="roudend-full mt-2 border-0 bg-gray-300 text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ..."
          >
            Start Learning
          </Button>
        </div>
      </div>

      {/* ====================tutors section========================== */}
      <div className="container px-2 mx-auto mt-5 md:mt-15">
        <div>
          {" "}
          <h2 className="text-xl md:text-2xl lg:text-4xl  ">
            Tutors of <span className="text-pink-500">e_Learn Tutorlink</span>
          </h2>
          <p className="text-sm md:text-sm lg:text-lg text-gray-700 mt-4 max-w-3xl md:pb-5">
            Looking for the best tutors? TutorLink 🎓 connects students with
            expert tutors for personalized learning. Find tutors by subject,
            grade, or expertise and book sessions effortlessly. Learn smarter,
            achieve more!
          </p>
          <div className="py-5 flex flex-wrap justify-center md:justify-start gap-2">
            <input
              type="text"
              onChange={(e) => setSearchValue(e.currentTarget.value)}
              placeholder="Search for tutors"
              className=" min-w-[200px] max-w-[30%] min-h-[37px] rounded-md border border-gray-400 px-5  text-sm md:text-sm lg:text-lg text-gray-700"
            />
            <Select onValueChange={handleCategoryChange}>
              <SelectTrigger className="min-w-[200px] max-w-[30%]  rounded-md border border-gray-400 ">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-md border border-gray-400">
                <SelectGroup>
                  <SelectItem value="All">All</SelectItem>
                  {[...new Set(tutors?.map((tutor) => tutor.category))].map(
                    (category, index) => (
                      <SelectItem key={index} value={category || "1"}>
                        {category}
                      </SelectItem>
                    )
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>

            {selectedCategory === "All" ? (
              <Select onValueChange={handleSubjectChange}>
                <SelectTrigger className="min-w-[200px] max-w-[30%] rounded-md border border-gray-400 ">
                  <SelectValue placeholder="Select Subjects" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-md border border-gray-400">
                  <SelectGroup>
                    <SelectItem value="All">All</SelectItem>
                    {[
                      ...new Set(tutors?.flatMap((tutor) => tutor.subjects)),
                    ].map((subject, index) => (
                      <SelectItem key={index} value={subject || "1"}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            ) : (
              <Select onValueChange={handleSubjectChange}>
                <SelectTrigger className="min-w-[200px] max-w-[30%] rounded-md border border-gray-400 ">
                  <SelectValue placeholder="Select Subjects" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-md border border-gray-400">
                  <SelectGroup>
                    <SelectItem value="All">All</SelectItem>
                    {filteredSubjects?.map(
                      (subject, index) =>
                        subject !== "All" && (
                          <SelectItem key={index} value={subject || "1"}>
                            {subject}
                          </SelectItem>
                        )
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}

            <Select onValueChange={handlePriceChange}>
              <SelectTrigger className="min-w-[200px] max-w-[30%] rounded-md border border-gray-400 ">
                <SelectValue placeholder="Select Price" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-md border border-gray-400">
                <SelectGroup>
                  <SelectLabel>HourlyRate</SelectLabel>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="1-3">1-3</SelectItem>
                  <SelectItem value="4-6">4-6</SelectItem>
                  <SelectItem value="7-9">7-9</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-y-3">
          {!Array.isArray(updatedTutors) || updatedTutors?.length === 0 ? (
            <div className="h-[300px] text-black text-xl md:text-3xl">
              Not Found Tutor Data
            </div>
          ) : (
            updatedTutors?.map((tutor, index) => (
              <div
                key={tutor._id || index}
                className="card bg-base-100 w-[95%] group border border-gray-200 hover:shadow-lg"
              >
                <figure className="relative h-[100%]">
                  <Image
                    className="h-[100%]"
                    src={tutor?.profileImage}
                    priority={true}
                    width={1100}
                    height={650}
                    alt="BannerImg"
                  ></Image>
                  <Link
                    className="roudend-ful w-full absolute text-center py-1 lg:py-2 bottom-0 lg:bottom-1/2 left-0 lg:translate-y-1/2 opacity-100 lg:opacity-0 group-hover:opacity-100 cursor-pointer hover:text-gray-900 border-0 bg-gray-300 text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                    href={`/tutors/${tutor._id}`}
                  >
                    Details
                  </Link>
                </figure>
                <div className="card-body">
                  <h2 className="card-title text-sm md:text-lg xl:text-xl">
                    {tutor.name}
                  </h2>
                  <p className=" text-sm md:text-sm lg:text-lg text-gray-700 ">
                    {tutor.category}
                  </p>
                  <p className=" text-sm md:text-sm lg:text-lg text-gray-700 line-clamp-2">
                    {tutor.gradeLevel}
                  </p>
                  <div>
                    <p>
                      <span className="text-sm md:text-sm lg:text-lg text-gray-700">
                        ${tutor.hourlyRate}
                      </span>{" "}
                      hr
                    </p>
                  </div>
                  <div className="flex items-center">
                    <p className="max-w-[80px] ">
                      Review ( {tutor?.ratings?.length} )
                    </p>
                    <ShowRating RatingShow={tutor?.ratings[0]}></ShowRating>
                  </div>

                  <div className=" grid gap-3 grid-cols-12">
                    <div className="col-span-6 xl:col-span-4">
                      {user?.role === "student" && (
                        <div className="flex flex-col lg-flex-row justify-between items-center gap-8">
                          <div className="w-full">
                            {acceptedTutors?.includes(tutor?._id) ? (
                              <Button className="roudend-ful w-full cursor-pointer hover:text-gray-900 border-0 bg-gray-300 text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                                Accpted
                              </Button>
                            ) : requestedTutors?.includes(tutor?._id) ? (
                              <Button className="roudend-ful w-full cursor-pointer hover:text-gray-900 border-0 bg-gray-300 text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                                Request
                              </Button>
                            ) : (
                              <Button
                                onClick={() => handleRequest(tutor?._id)}
                                className="roudend-ful w-full cursor-pointer hover:text-gray-900 border-0 bg-gray-300 text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                              >
                                Add
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="col-span-6 xl:col-span-4">
                      <Link href={`/booking/${tutor._id}`}>
                        <Button className="roudend-ful w-full cursor-pointer hover:text-gray-900 border-0 bg-gray-300 text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                          Booking
                        </Button>
                      </Link>
                    </div>
                    <div className="col-span-12 text-center xl:col-span-4">
                      {user?.role === "student" && (
                        <div className=" hover:bg-gray-400/25 mx-auto ">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white w-full">
                                <MessageSquareMore />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] max-h-[500px] bg-white">
                              <DialogHeader>
                                <DialogTitle></DialogTitle>
                                <DialogDescription></DialogDescription>
                              </DialogHeader>
                              <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                  <div className="grid grid-cols-1  gap-2">
                                    <FormField
                                      control={form.control}
                                      name="comment"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Your opinion</FormLabel>
                                          <FormControl>
                                            <Textarea
                                              {...field}
                                              value={field.value || ""}
                                            ></Textarea>
                                          </FormControl>
                                          <FormMessage className="text-red-500" />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                  <div className="mt-2">
                                    <StarRating></StarRating>
                                  </div>
                                  <div>
                                    <Button
                                      onClick={() => setTutorId(tutor?._id)}
                                      className="mt-2 cursor-pointer border-0 hover:border btn bg-gray-300 text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ..."
                                      type="submit"
                                    >
                                      Submit
                                    </Button>
                                  </div>
                                </form>
                              </Form>

                              <div className="max-h-[52%] overflow-y-auto">
                                {reviews
                                  ?.filter(
                                    (review: any) =>
                                      review?.tutor?._id === tutor?._id
                                  )
                                  .map((review, index) => (
                                    <div
                                      key={review._id}
                                      className="flex gap-2 mb-5"
                                    >
                                      {review?.student?.profileImage ? (
                                        <Avatar>
                                          <AvatarImage
                                            src={review?.student?.profileImage}
                                            alt="@shadcn"
                                          />
                                        </Avatar>
                                      ) : (
                                        <Avatar>
                                          <AvatarImage
                                            src="https://github.com/shadcn.png"
                                            alt="@shadcn"
                                          />
                                        </Avatar>
                                      )}
                                      <div>
                                        <div className="flex items-center gap-1">
                                          <h2 className="text-lg">
                                            {review?.student?.name}
                                          </h2>
                                          <p>
                                            <ShowRating
                                              RatingShow={review?.rating}
                                            ></ShowRating>
                                          </p>
                                        </div>
                                        <p className="text-sm md:text-sm lg:text-lg">
                                          {review?.comment}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                              </div>

                              <DialogFooter></DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {!Array.isArray(updatedTutors) || updatedTutors?.length === 0 ? (
          ""
        ) : (
          <div className="mx-auto text-center mt-2 md:mt-5">
            <Link href={"/tutors"}>
              <Button className="roudend-full cursor-pointer hover:text-gray-900 border-0 bg-gray-300 text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ...">
                View All
              </Button>
            </Link>
          </div>
        )}
      </div>
      {/* =====================================student sayas section====================== */}
      <div className="container mx-auto px-2 mt-5 md:mt-15">
        <div>
          <h2 className="text-xl md:text-2xl lg:text-4xl text-center md:text-start mb-2 sm:mb-5">
            Our Student <span className="text-pink-500">Says</span>
          </h2>
        </div>
        <div>
          <Carousel>
            <CarouselContent>
              {reviews?.map((review) => (
                <CarouselItem
                  key={review?._id}
                  className="md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-1">
                    <Card className="border-gray-300 h-[270px] ">
                      <CardContent className="flex flex-col items-center justify-center p-4 ">
                        <Image
                          className="rounded-full"
                          src={review?.student?.profileImage}
                          width={100}
                          height={200}
                          alt={`${review?.student?.name}'s profile`}
                        />
                        <h3 className="text-lg font-semibold">
                          {review?.student?.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {review?.comment}
                        </p>
                        <div>
                          <ShowRating RatingShow={review?.rating}></ShowRating>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="ms-15" />
            <CarouselNext className="me-15" />
          </Carousel>
        </div>
      </div>
      {/* =========================Pament Secure ====================== */}
      <FeatureSection></FeatureSection>
      {/* =========================ask qs ====================== */}
      <div className="container mx-auto px-2 mt-5 md:mt-15">
        <div className="flex justify-between flex-col md:flex-row">
          <div>
            <h2 className="text-xl md:text-2xl lg:text-4xl  ">
              Frequently Asked <span className="text-pink-500">Questions</span>
            </h2>
            <p className="text-sm md:text-sm lg:text-lg text-gray-700 mt-4 max-w-3xl pb-5">
              Here are some of the most common questions students and tutors ask
              about our platform. If you have more queries, feel free to contact
              us.
            </p>
          </div>
          <div>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-sm md:text-sm lg:text-lg text-gray-700 mt-4 max-w-3xl pb-5 ">
                  How do I find a tutor?
                </AccordionTrigger>
                <AccordionContent className="text-sm md:text-sm lg:text-lg text-gray-700 mt-4 max-w-3xl pb-5">
                  To find a tutor, browse available profiles, filter by subject
                  or location, view ratings, and book a session directly through
                  our secure, easy-to-use platform.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-sm md:text-sm lg:text-lg text-gray-700 mt-4 max-w-3xl pb-5">
                  How are payments processed?
                </AccordionTrigger>
                <AccordionContent className="text-sm md:text-sm lg:text-lg text-gray-700 mt-4 max-w-3xl pb-5">
                  Payments are securely processed through our platform using
                  SSLCommerz, Stripe, or PayPal. Choose your method, pay safely,
                  and get instant booking confirmation.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-sm md:text-sm lg:text-lg text-gray-700 mt-4 max-w-3xl pb-5">
                  What if I’m not satisfied with my tutor?
                </AccordionTrigger>
                <AccordionContent className="text-sm md:text-sm lg:text-lg text-gray-700 mt-4 max-w-3xl pb-5">
                  Yes, you can cancel a session from your dashboard. If you are
                  not satisfied with your tutor, contact support—we’ll help you
                  reschedule or find a better match.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-sm md:text-sm lg:text-lg text-gray-700 mt-4 max-w-3xl pb-5">
                  What if I’m not satisfied with my tutor?
                </AccordionTrigger>
                <AccordionContent className="text-sm md:text-sm lg:text-lg text-gray-700 mt-4 max-w-3xl pb-5">
                  If you not satisfied with your tutor, you can request a new
                  match or contact support for a refund or alternative tutor
                  options. We are here to help!
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-sm md:text-sm lg:text-lg text-gray-700 mt-4 max-w-3xl pb-5">
                  How can I find the right tutor for the right tutor find the
                  right tutor my needs?
                </AccordionTrigger>
                <AccordionContent className="text-sm md:text-sm lg:text-lg text-gray-700 mt-4 max-w-3xl pb-5">
                  Once you find a tutor, you can check their availability and
                  book a session at a convenient time. Payment is processed
                  securely through our platform.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeComponent;
