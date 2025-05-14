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

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
  // const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedPrice, setSelectedPrice] = useState<string>("");
  const [filteredSubjects, setFilteredSubjects] = useState<string[]>([]);

  const [selectedCategory, setSelectedCategory] = useState("All");

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

  const allSubjects = tutors?.map((tutor) => tutor.subjects);
  const uniqueSubjects = [...new Set(allSubjects?.flat())];

  const allCategories = tutors?.map((tutor) => tutor.category);
  const categories = [...new Set(allCategories)];

  //handle loading
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <SkeletonLoading />
      </div>
    );
  }

  console.log("user:", user);
  return (
    <div>
      {/* =============================Banner section=========================== */}
      <div className=" container mx-auto px-2 flex flex-col md:flex-row items-center pt-15 md:pt-20">
        <div className="pt-5 text-center md:text-start">
          <h2 className="text-2xl md:text-3xl lg:text-5xl dark:text-gray-300 ">
            Learn Better, <span className="text-pink-500">AcademyNest !</span>
          </h2>
          <p className="dark:text-gray-300 text-sm md:text-sm lg:text-lg text-gray-700  mt-4">
            Looking for the best tutors? TutorLink 🎓 connects students with
            expert tutors for personalized learning. Find tutors by subject,
            grade, or expertise and book sessions effortlessly. Learn smarter,
            achieve more!
          </p>

          <div className="max-w-md  flex-grow my-2 mx-auto md:mx-0">
            <input
              type="text"
              placeholder="Search for tutors"
              className="dark:text-gray-300 w-full min-h-[37px] max-w-6xl rounded-md border border-gray-400 px-5  text-sm md:text-sm lg:text-lg text-gray-700"
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
      <div className="container mx-auto px-2 overflow-x-hidden">
        <div className="flex justify-center items-center bg-gray-200 dark:bg-gray-400 ">
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
        <div className="container mx-auto mt-5 px-2 overflow-x-hidden ">
          <h2 className="dark:text-gray-300 text-xl md:text-2xl lg:text-4xl text-center md:text-start  mb-5 ">
            Course <span className="text-pink-500">Categories ____</span>
          </h2>
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-y-3 mb-5 items-center gap-2 mt-2">
              {categories?.map((category: string, index: number) => (
                <Card
                  key={index}
                  className="dark:text-gray-300 w-[95%] border border-gray-200 hover:shadow-lg"
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
      <div className="container mx-auto px-2 flex flex-col-reverse md:flex-row  items-center gap-5 mt-5 md:mt-15 overflow-x-hidden">
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
          <h2 className="dark:text-gray-300 text-xl md:text-2xl lg:text-4xl  ">
            Benifits of <span className="text-pink-500">e_Learn Tutorlink</span>
          </h2>
          <p className="dark:text-gray-300 text-sm md:text-sm lg:text-lg text-gray-700 mt-4">
            Looking for the best tutors? TutorLink 🎓 connects students with
            expert tutors for personalized learning. Find tutors by subject,
            grade, or expertise and book sessions effortlessly. Learn smarter,
            achieve more!
          </p>
          <ul className="dark:text-gray-300 list-disc pl-5 text-start text-sm md:text-sm lg:text-lg text-gray-700 mt-4">
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
      <div className="container  px-2 mx-auto mt-5 md:mt-15 ">
        <div>
          {" "}
          <h2 className="dark:text-gray-300 text-xl md:text-2xl lg:text-4xl  ">
            Tutors of <span className="text-pink-500">e_Learn Tutorlink</span>
          </h2>
          <p className="dark:text-gray-300 text-sm md:text-sm lg:text-lg text-gray-700 mt-4 max-w-3xl md:pb-5">
            Looking for the best tutors? TutorLink 🎓 connects students with
            expert tutors for personalized learning. Find tutors by subject,
            grade, or expertise and book sessions effortlessly. Learn smarter,
            achieve more!
          </p>
        </div>
        <div className=" grid grid-cols-12 gap-10 mt-5 ">
          <div className="col-span-3 hidden md:block ">
            <div className="mb-4">
              <input
                type="text"
                onChange={(e) => setSearchValue(e.currentTarget.value)}
                placeholder=" Search for tutors"
                className="dark:text-gray-300 w-full min-h-[37px] rounded-md border border-gray-400 px-5  text-sm md:text-sm lg:text-lg text-gray-700"
              />
            </div>
            <div>
              <h2 className="dark:text-gray-300 text-base lg:text-lg">
                Price Range
              </h2>
              <Select onValueChange={handlePriceChange}>
                <SelectTrigger className="dark:text-gray-300 w-full rounded-md border border-gray-400 mb-4">
                  <SelectValue placeholder="Select Price" />
                </SelectTrigger>
                <SelectContent className="dark:bg-black dark:text-gray-300 bg-white rounded-md border border-gray-400">
                  <SelectGroup>
                    <SelectLabel className="w-full">HourlyRate</SelectLabel>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="1-30">1-30</SelectItem>
                    <SelectItem value="31-61">31-61</SelectItem>
                    <SelectItem value="62-92">62-92</SelectItem>
                    <SelectItem value="93-112">93-132</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              {/* =================================radio=============================== */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 ">
                <div>
                  <h2 className="dark:text-gray-300 text-base lg:text-lg text-white bg-purple-500 py-3 px-6 mb-5">
                    Category
                  </h2>
                  <RadioGroup
                    defaultValue="All"
                    value={selectedCategory}
                    onValueChange={(value) => setSelectedCategory(value)}
                    className="dark:text-gray-300 space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="All" id="all" />
                      <Label className="dark:text-gray-300" htmlFor="all">
                        All Categories
                      </Label>
                    </div>

                    {categories.map((category, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem value={category} id={category} />
                        <Label htmlFor={category}>{category}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <div>
                  <h2 className="dark:text-gray-300 text-lg text-white bg-purple-500 py-3 px-6 mb-5">
                    Subjects
                  </h2>
                  <RadioGroup
                    defaultValue="All"
                    value={selectedSubject}
                    onValueChange={handleSubjectChange}
                    className="dark:text-gray-300 space-y-2 mt-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="All" id="all-subjects" />
                      <Label htmlFor="all-subjects">All Subjects</Label>
                    </div>

                    {uniqueSubjects.map((subject, index) => {
                      const subjectId = subject
                        .toLowerCase()
                        .replace(/\s+/g, "-");
                      return (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem value={subject} id={subjectId} />
                          <Label htmlFor={subjectId}>{subject}</Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                </div>
              </div>

              {/* =================================card tutor=============================== */}
            </div>
          </div>
          <div className="col-span-9 w-full overflow-x-hidden ">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pr-2 md:pr-0 overflow-x-hidden justify-items-center md:justify-items-stretch">
              {!Array.isArray(updatedTutors) || updatedTutors?.length === 0 ? (
                <div className="h-[300px] text-black text-xl md:text-3xl dark:text-gray-300">
                  Not Found Tutor Data
                </div>
              ) : (
                updatedTutors?.map((tutor, index) => (
                  <div
                    key={tutor._id || index}
                    className="relative w-full group bg-base-100 dark:bg-black border border-gray-300 dark:border-gray-700 rounded-md overflow-x-hidden hover:shadow-sm transition duration-300"
                  >
                    {/* Image & Hover Button */}
                    <figure className="relative w-full h-48 overflow-hidden">
                      <Image
                        className="w-full h-full object-cover"
                        src={tutor?.profileImage}
                        width={1100}
                        height={650}
                        alt="Tutor Image"
                        priority
                      />
                      <Link
                        href={`/tutors/${tutor._id}`}
                        className="absolute bottom-0 left-0 w-full py-2 text-center text-white text-sm md:text-base font-medium bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition duration-300"
                      >
                        View Profile
                      </Link>
                    </figure>

                    {/* Content */}
                    <div className="p-3 space-y-1">
                      <h2 className="font-semibold text-base md:text-lg dark:text-gray-300">
                        {tutor.name}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {tutor.category}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        ${tutor.hourlyRate} / hr
                      </p>

                      {user?.role === "student" ? (
                        <div className="flex justify-between items-center text-sm">
                          <div>
                            <Dialog>
                              <DialogTrigger asChild>
                                {/* <Button className="w-full py-1 text-sm bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center gap-1">
                                  <MessageSquareMore className="w-4 h-4" />{" "}
                                  Comment
                                </Button> */}
                                <span className="underline cursor-pointer dark:text-gray-300">
                                  Write Review{" "}
                                  <span className="no-underline">
                                    {" "}
                                    ({tutor?.ratings?.length})
                                  </span>
                                </span>
                              </DialogTrigger>
                              <DialogContent className="bg-white dark:bg-black max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle className="text-xl dark:text-gray-300">
                                    Write a Review
                                  </DialogTitle>
                                </DialogHeader>

                                <Form {...form}>
                                  <form onSubmit={form.handleSubmit(onSubmit)}>
                                    <FormField
                                      control={form.control}
                                      name="comment"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel className="dark:text-gray-300">
                                            Your Opinion
                                          </FormLabel>
                                          <FormControl>
                                            <Textarea
                                              className="dark:text-gray-300"
                                              {...field}
                                              value={field.value || ""}
                                            />
                                          </FormControl>
                                          <FormMessage className="text-red-500 " />
                                        </FormItem>
                                      )}
                                    />

                                    <div className="mt-2">
                                      <StarRating />
                                    </div>

                                    <Button
                                      type="submit"
                                      onClick={() => setTutorId(tutor._id)}
                                      className="mt-3 w-full py-1 text-sm bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white"
                                    >
                                      Submit
                                    </Button>
                                  </form>
                                </Form>

                                {/* Display Reviews */}
                                <div className="mt-4 space-y-4">
                                  {reviews
                                    ?.filter(
                                      (r) => r?.tutor?._id === tutor?._id
                                    )
                                    .map((review, idx) => (
                                      <div
                                        key={idx}
                                        className="flex gap-3 items-start"
                                      >
                                        <Avatar>
                                          <AvatarImage
                                            src={
                                              review?.student?.profileImage ||
                                              "https://github.com/shadcn.png"
                                            }
                                            alt="User"
                                          />
                                        </Avatar>
                                        <div>
                                          <div className="flex items-center gap-1 font-semibold dark:text-gray-300">
                                            {review?.student?.name}
                                            <ShowRating
                                              RatingShow={review?.rating}
                                            />
                                          </div>
                                          <p className="text-sm text-gray-600 dark:text-gray-300">
                                            {review?.comment}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>

                          <ShowRating RatingShow={tutor?.ratings[0]} />
                        </div>
                      ) : (
                        <div className="flex justify-between items-center dark:text-gray-300 text-sm">
                          <span>Reviews ({tutor?.ratings?.length})</span>
                          <ShowRating RatingShow={tutor?.ratings[0]} />
                        </div>
                      )}

                      {/* Buttons */}
                      {user?.role === "student" && (
                        <div className="grid grid-cols-2 gap-2 mt-3">
                          <Button
                            onClick={() => handleRequest(tutor._id)}
                            className="w-full py-1 text-sm bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white"
                            disabled={
                              acceptedTutors.includes(tutor._id) ||
                              requestedTutors.includes(tutor._id)
                            }
                          >
                            {acceptedTutors.includes(tutor._id)
                              ? "Accepted"
                              : requestedTutors.includes(tutor._id)
                              ? "Requested"
                              : "Add"}
                          </Button>

                          <Link href={`/booking/${tutor._id}`}>
                            <Button className="w-full py-1 text-sm bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
                              Book Now
                            </Button>
                          </Link>
                        </div>
                      )}

                      {/* Comment Section */}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* View All Button */}
            {Array.isArray(updatedTutors) && updatedTutors.length > 0 && (
              <div className="text-center mt-6">
                <Link href="/tutors">
                  <Button className="px-6 py-2 text-sm bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
                    View All Tutors
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =====================================student sayas section====================== */}
      <div className="container mx-auto px-2 mt-5 md:my-15">
        <div>
          <h2 className="text-xl md:text-2xl lg:text-4xl text-center md:text-start mb-2 sm:mb-5 dark:text-gray-300">
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
                        <h3 className="text-lg font-semibold dark:text-gray-300">
                          {review?.student?.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-2 dark:text-gray-300 line-clamp-2">
                          {review?.comment}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="ms-15 dark:text-gray-300" />
            <CarouselNext className="me-15 dark:text-gray-300" />
          </Carousel>
        </div>
      </div>
      {/* =========================Pament Secure ====================== */}
      <FeatureSection></FeatureSection>
      {/* =========================ask qs ====================== */}
      <div className="container mx-auto px-2 mt-5 md:mt-15">
        <div className="flex justify-between flex-col md:flex-row">
          <div>
            <h2 className="text-xl md:text-2xl lg:text-4xl dark:text-gray-300 ">
              Frequently Asked <span className="text-pink-500">Questions</span>
            </h2>
            <p className="dark:text-gray-300 text-sm md:text-sm lg:text-lg text-gray-700 mt-4 max-w-3xl pb-5">
              Here are some of the most common questions students and tutors ask
              about our platform. If you have more queries, feel free to contact
              us.
            </p>
          </div>
          <div>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-3">
                <AccordionTrigger className=" dark:text-gray-300 text-sm md:text-sm lg:text-lg text-gray-700 mt-4 max-w-3xl pb-5 ">
                  How do I find a tutor?
                </AccordionTrigger>
                <AccordionContent className="dark:text-gray-300 text-sm md:text-sm lg:text-lg text-gray-700 mt-4 max-w-3xl pb-5">
                  To find a tutor, browse available profiles, filter by subject
                  or location, view ratings, and book a session directly through
                  our secure, easy-to-use platform.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-1">
                <AccordionTrigger className="dark:text-gray-300 text-sm md:text-sm lg:text-lg text-gray-700 mt-4 max-w-3xl pb-5">
                  How are payments processed?
                </AccordionTrigger>
                <AccordionContent className="dark:text-gray-300 text-sm md:text-sm lg:text-lg text-gray-700 mt-4 max-w-3xl pb-5">
                  Payments are securely processed through our platform using
                  SSLCommerz, Stripe, or PayPal. Choose your method, pay safely,
                  and get instant booking confirmation.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className=" dark:text-gray-300 text-sm md:text-sm lg:text-lg text-gray-700 mt-4 max-w-3xl pb-5">
                  What if I’m not satisfied with my tutor?
                </AccordionTrigger>
                <AccordionContent className="dark:text-gray-300 text-sm md:text-sm lg:text-lg text-gray-700 mt-4 max-w-3xl pb-5">
                  Yes, you can cancel a session from your dashboard. If you are
                  not satisfied with your tutor, contact support—we’ll help you
                  reschedule or find a better match.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="dark:text-gray-300 text-sm md:text-sm lg:text-lg text-gray-700 mt-4 max-w-3xl pb-5">
                  What if I’m not satisfied with my tutor?
                </AccordionTrigger>
                <AccordionContent className="dark:text-gray-300 text-sm md:text-sm lg:text-lg text-gray-700 mt-4 max-w-3xl pb-5">
                  If you not satisfied with your tutor, you can request a new
                  match or contact support for a refund or alternative tutor
                  options. We are here to help!
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="dark:text-gray-300 text-sm md:text-sm lg:text-lg text-gray-700 mt-4 max-w-3xl pb-5">
                  How can I find the right tutor for the right tutor find the
                  right tutor my needs?
                </AccordionTrigger>
                <AccordionContent className="dark:text-gray-300 text-sm md:text-sm lg:text-lg text-gray-700 mt-4 max-w-3xl pb-5">
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
