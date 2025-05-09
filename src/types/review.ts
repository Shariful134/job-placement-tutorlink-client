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
  profileImage: string;
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
  profileImage: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type IReview = {
  _id: string;
  student: Student;
  tutor: Tutor;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
