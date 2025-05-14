/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";

import { reviewsData } from "./studentData";
import { Marquee } from "@/components/magicui/marquee";

const reviews = reviewsData;

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);
const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-white dark:bg-black hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] bg-white dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-row items-center gap-2 overflow-hidden  ">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-semibold dark:text-white overflow-hidden">
            {name}
          </figcaption>
          <p className="text-xs dark:text-gray-300 font-medium  overflow-hidden">
            {username}
          </p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm dark:text-gray-300">
        {body}
      </blockquote>
    </figure>
  );
};

const SuccesComponents = () => {
  return (
    <div>
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden ">
        <Marquee pauseOnHover className="[--duration:20s] overflow-hidden ">
          {firstRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
        <Marquee
          reverse
          pauseOnHover
          className="[--duration:20s] overflow-hidden"
        >
          {secondRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 "></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 "></div>
      </div>
    </div>
  );
};

export default SuccesComponents;
