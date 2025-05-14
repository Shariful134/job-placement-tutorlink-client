import Link from "next/link";
import { Input } from "../input";

const Footer = () => {
  return (
    <div className="container  px-2 mx-auto mt-5">
      <hr className="text-gray-300" />
      <footer className="footer sm:footer-horizontal text-sm md:text-sm lg:text-lg py-10 ">
        <nav>
          <h6 className="font-semibold text-lg text-black">TutorLink</h6>
          <a className="link link-hover text-sm md:text-sm lg:text-lg dark:text-gray-300">
            236 5th SE Avenue, New York NY10000,
            <br /> Dhaka mirpur Road No.17, <br />
            Dhaka Bangladesh
          </a>
        </nav>
        <nav>
          <h6 className="footer-title dark:text-gray-300">Link</h6>
          <Link href={"/"} className="hover:underline dark:text-gray-300">
            Home
          </Link>
          <Link href={"/tutors"} className="hover:underline dark:text-gray-300">
            Tutors
          </Link>
          <Link
            href={"/contact"}
            className="hover:underline dark:text-gray-300"
          >
            Conatact
          </Link>
          <Link href={"/about"} className="hover:underline dark:text-gray-300">
            About
          </Link>
          <Link href={"/news"} className="hover:underline dark:text-gray-300">
            News
          </Link>
        </nav>
        <nav>
          <h6 className="footer-title dark:text-gray-300">Help</h6>
          <Link href={"/"} className="hover:underline dark:text-gray-300">
            Payment Options
          </Link>
          <Link href={"/tutors"} className="hover:underline dark:text-gray-300">
            Returns
          </Link>
          <Link
            href={"/contact"}
            className="hover:underline dark:text-gray-300"
          >
            Privacy Policy
          </Link>
        </nav>
        <nav>
          <h6 className="footer-title dark:text-gray-300">NewsLater</h6>
          <div className="flex flex-wrap items-center gap-2 dark:text-gray-300">
            <div>
              <Input
                className="border-0 border-b-1 dark:text-gray-300 "
                placeholder="Enter Your Email "
              ></Input>
            </div>
            <div className="underline dark:text-gray-300 ">Subscribe</div>
          </div>
        </nav>
      </footer>
    </div>
  );
};

export default Footer;
