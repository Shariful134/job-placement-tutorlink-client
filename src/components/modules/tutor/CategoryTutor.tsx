/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Image from "next/image";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
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
import { FieldValues, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import ShowRating from "@/components/modules/starRating/ShowRating";
import StarRating from "../starRating/StarRating";

const CategoryTutor = ({ categoryId }: { categoryId: string }) => {
  const [tutorss, setTutors] = useState<ITutor[] | []>([]);
  const [isUser, setIsUser] = useState<ITutor[] | []>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [requestedTutors, setRequestedTutors] = useState<string[]>([]);
  const [acceptedTutors, setAccetedTutors] = useState<string[]>([]);
  const [reviews, setReviews] = useState<IReview[] | []>([]);

  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedPrice, setSelectedPrice] = useState<string>("");
  const [filteredSubjects, setFilteredSubjects] = useState<string[]>([]);

  const [tutorId, setTutorId] = useState("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { user, ratings } = useUser();

  const [currentPage, setCurrentPage] = useState(1);
  const tutorsPerPage = 8;

  const form = useForm();

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

  const tutors = tutorss?.filter((tutor) => tutor.category == categoryId);
  useEffect(() => {
    const allSubjects = [
      ...new Set(tutors?.flatMap((tutor) => tutor.subjects)),
    ];

    setFilteredSubjects(allSubjects);
  }, [tutorss, categoryId]);

  const filteredTutors = tutors?.filter((tutor) => {
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
      (!isNaN(Number(searchQuery)) && tutor.hourlyRate <= Number(searchQuery));

    return categoryMatch && subjectMatch && priceMatch && searchMatch;
  });

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
    const rating = Number(data?.rating);
    const review = { ...data, rating, tutor: tutorId, student: isUser[0]?._id };
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
    if (!ratingsMap[tutor?._id]) {
      ratingsMap[tutor?._id] = [];
    }
    ratingsMap[tutor?._id].push(rating);
  });

  const updatedTutors = filteredTutors?.map((tutor) => ({
    ...tutor,
    ratings: ratingsMap[tutor?._id] || tutor?.ratings,
  }));

  const allSubjects = tutors?.map((tutor) => tutor.subjects);
  const uniqueSubjects = [...new Set(allSubjects?.flat())];

  const allCategories = tutors?.map((tutor) => tutor.category);
  const categories = [...new Set(allCategories)];

  // paginaton add
  //  indexes Calculate
  const indexOfLastTutor = currentPage * tutorsPerPage;
  const indexOfFirstTutor = indexOfLastTutor - tutorsPerPage;
  const currentTutors = updatedTutors?.slice(
    indexOfFirstTutor,
    indexOfLastTutor
  );

  const totalPages = Math.ceil(updatedTutors?.length / tutorsPerPage);

  useEffect(() => {
    window.scrollTo({ top: 200, behavior: "smooth" });
  }, [currentPage]);

  // add skeleton
  if (loading) {
    return (
      <div className="pt-20 flex justify-center">
        <SkeletonLoading />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 mt-10 md:mt-10 overflow-x-hidden">
      <div>
        {" "}
        <h2 className="text-xl md:text-2xl lg:text-4xl  ">
          Tutors of <span className="text-pink-500">e_Learn Tutorlink</span>
        </h2>
        <p className="text-sm md:text-sm lg:text-lg text-gray-700 mt-4 max-w-3xl pb-1 md:pb-5">
          Looking for the best tutors? TutorLink 🎓 connects students with
          expert tutors for personalized learning. Find tutors by subject,
          grade, or expertise and book sessions effortlessly. Learn smarter,
          achieve more!
        </p>
      </div>
      <div className=" grid grid-cols-12 gap-10 mt-5 ">
        {/* =====================sidebar========================= */}
        <div className="col-span-3 hidden md:block ">
          <div className="mb-4">
            <input
              type="text"
              onChange={(e) => setSearchValue(e.currentTarget.value)}
              placeholder="Search for tutors"
              className="w-full min-h-[37px] rounded-md border border-gray-400 px-5  text-sm md:text-sm lg:text-lg text-gray-700"
            />
          </div>
          <div>
            <h2 className="text-base lg:text-lg">Price Range</h2>
            <Select onValueChange={handlePriceChange}>
              <SelectTrigger className="w-full rounded-md border border-gray-400 mb-4">
                <SelectValue placeholder="Select Price" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-md border border-gray-400">
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
                <h2 className="text-base lg:text-lg text-white bg-purple-500 py-3 px-6 mb-5">
                  Category
                </h2>
                <RadioGroup
                  defaultValue="All"
                  value={selectedCategory}
                  onValueChange={(value) => setSelectedCategory(value)}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="All" id="all" />
                    <Label htmlFor="all">All Categories</Label>
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
                <h2 className="text-lg text-white bg-purple-500 py-3 px-6 mb-5">
                  Subjects
                </h2>
                <RadioGroup
                  defaultValue="All"
                  value={selectedSubject}
                  onValueChange={handleSubjectChange}
                  className="space-y-2 mt-4"
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
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem value={subject} id={subjectId} />
                        <Label htmlFor={subjectId}>{subject}</Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>
            </div>
            {/* =================================radio=============================== */}
          </div>
        </div>
        <div className="col-span-9 w-full">
          {/* =====================all Tutor========================= */}
          <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-3">
            {!Array.isArray(currentTutors) || currentTutors?.length === 0 ? (
              <div className="h-[300px] text-black text-xl md:text-3xl">
                Not Found Tutor Data
              </div>
            ) : (
              currentTutors?.map((tutor, index) => (
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

                    <div className="card-actions flex-col ">
                      <p>
                        <span className="text-sm md:text-sm lg:text-lg text-gray-700">
                          ${tutor.hourlyRate}
                        </span>{" "}
                        hr
                      </p>

                      <div className="flex items-center gap-1">
                        <p className="max-w-[80px] ">
                          Review ( {tutor?.ratings?.length} )
                        </p>
                        <ShowRating RatingShow={tutor?.ratings[0]}></ShowRating>
                      </div>
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
                        <Link href={`/booking/${tutor?._id}`}>
                          <Button className="roudend-ful w-full cursor-pointer hover:text-gray-900 border-0 bg-gray-300 text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                            Booking
                          </Button>
                        </Link>
                      </div>

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
              ))
            )}
          </div>
          <div className="flex justify-center mt-4 gap-2 items-center">
            {/* Previous Button */}
            <button
              className="px-3 py-1 rounded bg-gray-200 text-black disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`px-3 py-1 rounded ${
                  currentPage === index + 1
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            {/* Next Button */}
            <button
              className="px-3 py-1 rounded bg-gray-200 text-black disabled:opacity-50"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryTutor;
