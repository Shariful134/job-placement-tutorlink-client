"use client";
import { Input } from "@/components/ui/input";
import { useUser } from "@/context/UserContext";
import { useState } from "react";
import { FaStar } from "react-icons/fa";

const StarRating = () => {
  const [rating, setRating] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);

  const { setRatings } = useUser();
  setRatings(rating);
  // console.log(ratings);
  return (
    <div className="flex">
      {[...Array(5)].map((star, i) => {
        const ratingValue = i + 1;
        return (
          <div key={i}>
            <label>
              <Input
                type="radio"
                name="rating"
                value={ratingValue}
                className="hidden"
                onClick={() => setRating(ratingValue)}
              />
              <FaStar
                className={`text-sm lg:text-lg ${
                  rating !== null && ratingValue <= (hover || rating)
                    ? "text-yellow-300"
                    : "text-gray-200"
                }`}
                onMouseEnter={() => setHover(ratingValue)}
                onMouseLeave={() => setHover(null)}
              ></FaStar>
            </label>
          </div>
        );
      })}
    </div>
  );
};

export default StarRating;
