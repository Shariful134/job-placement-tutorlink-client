import Image from "next/image";
import mission from "../../../app/assest/images/mission.png";
import banner from "../../../app/assest/images/aboutBanner.png";
import img1 from "../../../app/assest/images/360_F_225438459_rf2TFCzW8MohNc2jD98Fu9UZg9fAbkBJ.jpg";
import img3 from "../../../app/assest/images/istockphoto-1365527907-612x612.jpg";
import img4 from "../../../app/assest/images/istockphoto-1446637076-612x612.jpg";
import img5 from "../../../app/assest/images/depositphotos_178883488-stock-photo-senior-lecturer-holding-book-pointing.jpg";
import img6 from "../../../app/assest/images/Screenshot (62).png";
import SuccesComponents from "./SuccesComponents";
import { reviewsData } from "./studentData";

const AboutComponent = () => {
  return (
    <div className="container mx-auto px-2">
      <div className=" flex flex-col md:flex-row mt-0 sm:mt-5 lg:mt-5 gap-5 items-center justify-center">
        <div className="max-w-[1000px] text-center sm:text-start">
          <h2 className="text-2xl md:text-3xl lg:text-5xl mt-0 sm:mt-5 ">
            About Our TutorLink
          </h2>
          <p className="text-sm md:text-sm lg:text-lg text-gray-700 mt-4 ">
            TutorLink is your trusted learning companion — a user-friendly
            platform that connects students with verified tutors across a wide
            range of subjects. Whether you are aiming to ace your exams,
            strengthen academic foundations, or explore something new, TutorLink
            is here to support your journey. TutorLink is your trusted learning
            companion — a user-friendly platform that connects students with
            verified tutors across a wide range of subjects. Whether you are
            aiming to ace your exams, strengthen academic foundations, or
            explore something new, TutorLink is here to support your journey.
          </p>
        </div>
        <div className="hidden sm:inline">
          <Image
            src={banner}
            width={1900}
            height={1200}
            alt="missoinImg"
          ></Image>
        </div>
      </div>

      <div className="flex flex-col md:flex-row mt-10 md:mt-20 gap-5 items-center justify-center">
        <div>
          <Image
            src={mission}
            width={1900}
            height={1200}
            alt="missoinImg"
          ></Image>
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl lg:text-5xl order-2 md:order-1 text-center md:text-start">
            Mission StateMent
          </h2>
          <p className="text-sm md:text-sm lg:text-lg text-gray-700 mt-4 text-center md:text-start">
            At TutorLink, our mission is simple yet powerful: to bridge the gap
            between students and quality education by connecting them with
            experienced, passionate tutors. We believe that every student
            deserves the chance to succeed, and that access to the right
            guidance can unlock anyone’s full potential. Whether it’s mastering
            algebra, writing a college essay, or prepping for a big exam, we’re
            here to make personalized learning accessible, flexible, and
            effective.
          </p>
        </div>
      </div>

      <div className=" mt-10 md:mt-20 mb-5 lg:mb-20">
        <div className="pt-5">
          <h2 className="text-2xl md:text-3xl lg:text-5xl text-center">
            Meet the Team
          </h2>
          <p className="text-sm md:text-sm lg:text-lg text-gray-700 mt-4 max-w-[500px] text-center mx-auto">
            TutorLink was founded by a team of educators, tech enthusiasts, and
            lifelong learners who saw a need for a better, more personal
            approach to tutoring. Our leadership team includes:
          </p>
        </div>
        {/* ==================================our team section===================================== */}
        <div className="flex justify-center md:justify-start">
          <div className="grid grid-cols-12 mx-auto gap-5 mt-5 sm:mt-10">
            <div className="col-span-12 sm:col-span-4 md:col-span-3 xl:col-span-2 max-w-[300px] xs:bg-gray-100/25 hover:bg-gray-100/25 shadow-md">
              <div>
                <Image
                  src={img1}
                  width={300}
                  height={300}
                  alt="missoinImg"
                ></Image>
                <p className="text-sm font-semibold text-center pt-1">
                  Shariful Islam
                </p>
              </div>
              <p className="text-sm md:text-sm lg:text-lg text-gray-700 mt-4 max-w-[500px] px-5 pb-5">
                CEO – An educator with over 10 years of experience, passionate
                about creating tools that empower students.
              </p>
            </div>
            <div className="col-span-12 sm:col-span-4 md:col-span-3 xl:col-span-2 max-w-[300px] xs:bg-gray-100/25 hover:bg-gray-100/25 shadow-md">
              <div>
                <Image
                  src={img3}
                  width={300}
                  height={300}
                  alt="missoinImg"
                ></Image>
                <p className="text-sm font-semibold text-center pt-1">
                  Meera Patek
                </p>
              </div>
              <p className="text-sm md:text-sm lg:text-lg text-gray-700 mt-4 max-w-[500px] px-5 pb-5">
                A software engineer and education advocate dedicated to building
                intuitive, user-friendly platforms.
              </p>
            </div>
            <div className="col-span-12 sm:col-span-4 md:col-span-3 xl:col-span-2  max-w-[300px] xs:bg-gray-100/25 hover:bg-gray-100/25 shadow-md">
              <div>
                <Image
                  src={img5}
                  width={300}
                  height={300}
                  alt="missoinImg"
                ></Image>
                <p className="text-sm font-semibold text-center pt-1">
                  Daniel Kim
                </p>
              </div>
              <p className="text-sm md:text-sm lg:text-lg text-gray-700 mt-4 max-w-[500px] px-5 pb-5">
                Head of Operations – A former tutor who knows firsthand how
                impactful one-on-one learning can be.
              </p>
            </div>
            <div className="col-span-12 sm:col-span-4 md:col-span-3 xl:col-span-2 max-w-[300px] xs:bg-gray-100/25 hover:bg-gray-100/25 shadow-md">
              <div>
                <Image
                  src={img4}
                  width={300}
                  height={300}
                  alt="missoinImg"
                ></Image>
                <p className="text-sm font-semibold text-center pt-1">
                  Rina Das
                </p>
              </div>
              <p className="text-sm md:text-sm lg:text-lg text-gray-700 mt-4 max-w-[500px] px-5 pb-5">
                Head of Product – A design thinker who ensures our platform is
                always student-centered
              </p>
            </div>
            <div className="col-span-12 sm:col-span-4 md:col-span-3 xl:col-span-2 max-w-[300px] xs:bg-gray-100/25 hover:bg-gray-100/25 shadow-md">
              <div>
                <Image
                  src={img5}
                  width={300}
                  height={300}
                  alt="missoinImg"
                ></Image>
                <p className="text-sm font-semibold text-center pt-1">
                  Sophia Lin
                </p>
              </div>
              <p className="text-sm md:text-sm lg:text-lg text-gray-700 mt-4 max-w-[500px] px-5 pb-5">
                Community Manager – A connector of people, focused on building a
                strong, supportive community
              </p>
            </div>
            <div className="col-span-12 sm:col-span-4  md:col-span-3 xl:col-span-2 max-w-[300px] xs:bg-gray-100/25 hover:bg-gray-100/25 shadow-md">
              <div>
                <Image
                  src={img6}
                  width={300}
                  height={300}
                  alt="missoinImg"
                ></Image>
                <p className="text-sm font-semibold text-center pt-1">
                  Jamal Owens
                </p>
              </div>
              <p className="text-sm md:text-sm lg:text-lg text-gray-700 mt-4 max-w-[500px] px-5 pb-5">
                Director of Global Partnerships With a background in education
                outreach, Rina is helping us expand
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* =================success section ========================== */}
      <div>
        <div>
          <h2 className="text-2xl md:text-3xl lg:text-5xl order-2 md:order-1 text-center mb-5 pt-10 lg:pt-20">
            Our Student Success story
          </h2>
        </div>
        <div className="hidden md:inline">
          <SuccesComponents></SuccesComponents>
        </div>
        <div className="inline md:hidden">
          <div className="flex justify-center md:justify-start">
            <div className="grid grid-cols-12 mx-auto gap-2 sm:mt-10 text-center">
              {reviewsData?.map((item, index) => (
                <div
                  key={index}
                  className="col-span-12 sm:col-span-4 mb-3 border-1 border-gray-200 md:col-span-3 xl:col-span-2 max-w-[300px] xs:bg-gray-100/25 hover:bg-gray-100/25 shadow-md"
                >
                  <div className="pt-5">
                    <Image
                      className="w-[100px] h-[100px] rounded-full text-center mx-auto"
                      src={item.img}
                      width={300}
                      height={300}
                      alt="missoinImg"
                    ></Image>
                    <p className="text-sm font-semibold text-center pt-1">
                      {item.username}
                    </p>
                  </div>
                  <p className="text-sm md:text-sm lg:text-lg text-gray-700 mt-4 max-w-[500px] px-5 font-semibold">
                    {item.name}
                  </p>
                  <p className="text-sm md:text-sm lg:text-lg text-gray-700  max-w-[500px] px-5 pb-5">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutComponent;
