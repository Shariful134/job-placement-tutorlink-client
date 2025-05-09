export interface IUser {
  name: string;
  userEmail: string;
  role: "student" | "admin" | "tutor";
  exp: number;
  iat: number;
}

export interface IUsers {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  role?: "student" | "tutor" | "admin";
  bio?: string;
  subjects?: string[];
  gradeLevel?: string;
  hourlyRate?: number;
  category?: string;
  availability?: { day: string; time: string }[];
  ratings?: number[];
  profileImage?: string;
}
