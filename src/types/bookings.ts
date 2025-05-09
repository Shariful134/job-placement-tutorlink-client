export type Availability = {
  day: string;
  time: string;
  _id: string;
};

export type Student = {
  _id: string;
  name: string;
  email: string;
  role: "student";
  ratings: number[];
  subjects: string[];
  availability: Availability[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type Tutor = {
  _id: string;
  name: string;
  email: string;
  role: "tutor";
  bio: string;
  phoneNumber: string;
  gradeLevel: string;
  category: string;
  hourlyRate: number;
  availability: Availability[];
  ratings: number[];
  subjects: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  profileImage: string;
};

export type BookingStatus = "Pending" | "Paid" | "Cancelled";

export type TBooking = {
  _id: string;
  student: Student;
  tutor: Tutor;
  address?: string;
  dateTime?: string;
  subjects: [];
  action: string;
  duration?: string;
  bookingRequest: boolean;
  status: BookingStatus;
  phone: string;
  totalPrice: string;
  transaction?: { id?: string };
  createdAt: string;
  updatedAt: string;
  __v: number;
};
