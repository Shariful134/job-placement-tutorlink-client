import Link from "next/link";
import { Input } from "../input";

const Footer = () => {
  return (
    <div className="container mx-auto mt-5">
      <hr className="text-gray-300" />
      <footer className="  footer sm:footer-horizontal text-sm md:text-sm lg:text-lg py-10 ">
        <nav>
          <h6 className="font-semibold text-lg text-black">TutorLink</h6>
          <a className="link link-hover text-sm md:text-sm lg:text-lg">
            236 5th SE Avenue, New York NY10000,
            <br /> Dhaka mirpur Road No.17, <br />
            Dhaka Bangladesh
          </a>
        </nav>
        <nav>
          <h6 className="footer-title ">Link</h6>
          <Link href={"/"} className="hover:underline">
            Home
          </Link>
          <Link href={"/tutors"} className="hover:underline">
            Tutors
          </Link>
          <Link href={"/contact"} className="hover:underline">
            Conatact
          </Link>
          <Link href={"/about"} className="hover:underline">
            About
          </Link>
          <Link href={"/news"} className="hover:underline">
            News
          </Link>
        </nav>
        <nav>
          <h6 className="footer-title">Help</h6>
          <Link href={"/"} className="hover:underline">
            Payment Options
          </Link>
          <Link href={"/tutors"} className="hover:underline">
            Returns
          </Link>
          <Link href={"/contact"} className="hover:underline">
            Privacy Policy
          </Link>
        </nav>
        <nav>
          <h6 className="footer-title">NewsLater</h6>
          <div className="flex flex-wrap items-center gap-2">
            <div>
              <Input
                className="border-0 border-b-1  "
                placeholder="Enter Your Email "
              ></Input>
            </div>
            <div className="underline ">Subscribe</div>
          </div>
        </nav>
      </footer>
    </div>
  );
};

export default Footer;
