"use server";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";

//createReview Commentes
export const createReviewComments = async (comment: FieldValues) => {
  const token = (await cookies()).get("accessToken")!.value;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/reviews-comment/create`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(comment),
      }
    );
    const data = await res.json();
    revalidateTag("Review");
    return data;
  } catch (error: any) {
    return Error(error.message);
  }
};

//get AllReviewCommentes
export const getAllReviewComments = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/reviews-comment/get`,
      {
        next: {
          tags: ["Review", "bookings"],
        },
      }
    );
    const data = await res.json();
    return data;
  } catch (error: any) {
    return Error(error.message);
  }
};
