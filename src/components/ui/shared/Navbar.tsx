/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import tutorlin from "@/app/assest/images/tutorlogo.png";

import { LogOut } from "lucide-react";
import { Button } from "../button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logout } from "@/services/authService";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { usePathname, useRouter } from "next/navigation";
import { protectedRoutes } from "@/constant";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getAllUsers } from "@/services/User";
import { IUsers } from "@/types";
import Loading from "./Loading";
import { RiArrowDropDownLine } from "react-icons/ri";
import { ModeToggle } from "@/components/mode-Toggle/ModeToggle";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, setIsLoading } = useUser();
  const role = user?.role;

  const [users, setUsers] = useState<IUsers[] | []>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setLoading(true);
        const usersData = await getAllUsers();
        setUsers(usersData?.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchTutors();
  }, []);

  const tutorsData = users?.filter((tutor) => tutor.role == "tutor");
  const allCategories = tutorsData?.map((tutor) => tutor.category);
  const categories = [...new Set(allCategories)];

  const currentUser = users?.find(
    (item: IUsers) => item.email === user?.userEmail
  );

  const profileImg = currentUser?.profileImage;

  const handleLogOut = () => {
    logout();
    setIsLoading(true);
    if (protectedRoutes.some((route) => pathname.match(route))) {
      router.push("/");
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="bg-gray-200 dark:bg-black sticky top-0 z-50">
      <div className="container mx-auto navbar">
        <div className="navbar-start w-40%">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className=" dark:text-slate-200 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-gray-200 dark:bg-black rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <Link
                className={
                  pathname == "/"
                    ? "text-purple-600 underline text-sm"
                    : "text-black dark:text-slate-200 text-sm hover:text-purple-600 hover:underline"
                }
                href="/"
              >
                Home
              </Link>
              <Link
                className={
                  pathname == "/tutors"
                    ? "text-purple-600 underline text-sm"
                    : "text-black dark:text-slate-200 text-sm hover:text-purple-600 hover:underline"
                }
                href="/tutors"
              >
                Tutors
              </Link>
              <div className="dropdown dropdown-hover">
                <label
                  tabIndex={0}
                  className="text-sm dark:text-slate-200 cursor-pointer hover:text-cyan-600 flex items-center"
                >
                  Category <RiArrowDropDownLine className="text-2xl" />
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[1] menu shadow bg-base-100 dark:bg-black rounded-box w-52"
                >
                  {categories?.map((category: any, index: number) => (
                    <li key={index}>
                      <Link
                        href={`/category/${category}`}
                        className={
                          pathname === `/category/details/${category}`
                            ? "text-cyan-600 font-bold underline text-lg"
                            : "text-black dark:text-slate-200 text-lg hover:text-cyan-600"
                        }
                      >
                        {category}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                className={
                  pathname == "/contact"
                    ? "text-purple-600 underline text-sm"
                    : "text-black dark:text-slate-200 text-sm hover:text-purple-600 hover:underline"
                }
                href="/contact"
              >
                Contact
              </Link>
              <Link
                className={
                  pathname == "/about"
                    ? "text-purple-600 underline text-sm"
                    : "text-black dark:text-slate-200 text-sm hover:text-purple-600 hover:underline"
                }
                href="/about"
              >
                About
              </Link>
              <Link
                className={
                  pathname == "/blog"
                    ? "text-purple-600 underline text-sm"
                    : "text-black dark:text-slate-200 text-sm hover:text-purple-600 hover:underline"
                }
                href="/blog"
              >
                Blogs
              </Link>
            </ul>
          </div>
          <a className="text-xl">
            <Image
              className="hidden lg:inline"
              src={tutorlin}
              width={60}
              height={60}
              alt="tutorlink"
            />
          </a>
        </div>

        <div className="navbar-end w-[60%] hidden lg:flex">
          <ul className="menu menu-horizontal px-1 flex justify-center items-center gap-5">
            <Link
              className={
                pathname == "/"
                  ? "text-purple-600 underline text-lg"
                  : "text-black dark:text-slate-200 text-lg hover:text-purple-600 hover:underline"
              }
              href="/"
            >
              Home
            </Link>
            <div className="dropdown dropdown-hover">
              <label
                tabIndex={0}
                className="text-lg dark:text-slate-200 cursor-pointer hover:text-purple-600 flex items-center justify-center"
              >
                Category <RiArrowDropDownLine className="text-2xl" />
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu shadow bg-base-100 dark:bg-black rounded-box w-52"
              >
                {categories?.map((category: any, index: number) => (
                  <li key={index}>
                    <Link
                      href={`/category/${category}`}
                      className={
                        pathname === `/category/details/${category}`
                          ? "text-purple-600 underline text-lg"
                          : "text-black dark:text-slate-200 text-lg hover:text-purple-600 hover:underline"
                      }
                    >
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              className={
                pathname == "/tutors"
                  ? "text-purple-600 underline text-lg"
                  : "text-black dark:text-slate-200 text-lg hover:text-purple-600 hover:underline"
              }
              href="/tutors"
            >
              Tutors
            </Link>
            <Link
              className={
                pathname == "/contact"
                  ? "text-purple-600 underline text-lg"
                  : "text-black dark:text-slate-200 text-lg hover:text-purple-600 hover:underline"
              }
              href="/contact"
            >
              Contact
            </Link>
            <Link
              className={
                pathname == "/about"
                  ? "text-purple-600 underline text-lg"
                  : "text-black dark:text-slate-200 text-lg hover:text-purple-600 hover:underline"
              }
              href="/about"
            >
              About
            </Link>
            <Link
              className={
                pathname == "/blog"
                  ? "text-purple-600 underline text-lg"
                  : "text-black dark:text-slate-200 text-lg hover:text-purple-600 hover:underline"
              }
              href="/blog"
            >
              Blogs
            </Link>
            {/* <li>
              <ModeToggle />
            </li> */}
          </ul>
        </div>

        <div className={user ? "navbar-end lg:w-25" : "navbar-end  lg:w-35"}>
          {user ? (
            <div className="flex items-center gap-3">
              <div className="ms-3">
                <ModeToggle />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className="size-10 rouded-full">
                    {profileImg ? (
                      <AvatarImage src={profileImg} />
                    ) : (
                      <AvatarImage src="https://github.com/shadcn.png" />
                    )}
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="border border-gray-400 dark:bg-black bg-white mt-2 mr-2">
                  <DropdownMenuLabel className="font-semibold">
                    <div className="flex justify-center flex-col items-center gap-2">
                      <Avatar className="size-10 rouded-full">
                        {profileImg ? (
                          <AvatarImage src={profileImg} />
                        ) : (
                          <AvatarImage src="https://github.com/shadcn.png" />
                        )}
                      </Avatar>
                      <Link href={`/${role}/dashboard`}>
                        <Button className="roudend-full border-0 btn cursor-pointer bg-gray-300 text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ...">
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href={`/${role}/dashboard`}>
                    <DropdownMenuItem className="hover:bg-gray-200  px-3 py-2 cursor-pointer dark:text-gray-300 dark:hover:bg-gray-200/8">
                      Dashboard
                    </DropdownMenuItem>
                  </Link>

                  <DropdownMenuSeparator className="border-b border-gray-400" />
                  <DropdownMenuItem
                    className="hover:bg-gray-200 px-3 py-2 cursor-pointer dark:text-gray-300 dark:hover:bg-gray-200/8"
                    onClick={handleLogOut}
                  >
                    <LogOut /> LogOut
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex itesm-center gap-3">
              <div className="ms-3">
                <ModeToggle />
              </div>
              <Link href={"/login"}>
                <Button
                  variant="outline"
                  className="roudend-full btn cursor-pointer border-0 bg-gray-300 text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ..."
                >
                  SignIn
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
