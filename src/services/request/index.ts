"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";

//request booking
export const requestBooking = async (requestData: FieldValues) => {
  const token = (await cookies()).get("accessToken")!.value;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/bookings/request-booking`,

      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(requestData),
      }
    );

    const result = await res.json();
    revalidateTag("bookings");
    return result;
  } catch (error: any) {
    return Error(error);
  }
};

//accept booking
export const acceptBooking = async (id: string) => {
  const token = (await cookies()).get("accessToken")!.value;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/bookings/accept-booking/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: token,
        },
      }
    );

    const result = await res.json();
    revalidateTag("bookings");
    return result;
  } catch (error: any) {
    return Error(error);
  }
};

//Cancel or delete booking
export const cancelBooking = async (id: string) => {
  const token = (await cookies()).get("accessToken")!.value;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/bookings/delete-booking/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      }
    );

    const result = await res.json();
    revalidateTag("bookings");
    return result;
  } catch (error: any) {
    return Error(error);
  }
};

// booking confirmation
export const confirmBooking = async (orderData: FieldValues, id: string) => {
  const token = (await cookies()).get("accessToken")!.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/bookings/create/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(orderData),
      }
    );
    const result = await res.json();
    revalidateTag("bookings");
    return result;
  } catch (error: any) {
    return Error(error);
  }
};

// Update booking
export const updateBooking = async (updateData: FieldValues, id: string) => {
  const token = (await cookies()).get("accessToken")!.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/bookings/update/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(updateData),
      }
    );
    const result = await res.json();
    revalidateTag("bookings");
    return result;
  } catch (error: any) {
    return Error(error);
  }
};

// verify payment
export const verifyPayment = async (order_id: string) => {
  const token = (await cookies()).get("accessToken")!.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/bookings/verify?order_id=${order_id}`,

      {
        next: {
          tags: ["bookings"],
        },
        method: "GET",
        headers: {
          Authorization: token,
        },
      }
    );

    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};
// getAll Bookings
export const getAllBooking = async () => {
  const token = (await cookies()).get("accessToken")!.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/bookings/get`,

      {
        next: {
          tags: ["bookings"],
        },
        method: "GET",
        headers: {
          Authorization: token,
        },
      }
    );

    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};

// get Single Bookings
export const getSingleBooking = async (id: string) => {
  const token = (await cookies()).get("accessToken")!.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/bookings/get/${id}`,

      {
        next: {
          tags: ["bookings"],
        },
        method: "GET",
        headers: {
          Authorization: token,
        },
      }
    );

    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};

// getAll Bookings-with populate(student,tutor)
export const getAllBookings = async () => {
  const token = (await cookies()).get("accessToken")!.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/bookings/get-allBookings`,

      {
        next: {
          tags: ["bookings"],
        },
        method: "GET",
        headers: {
          Authorization: token,
        },
      }
    );

    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};
