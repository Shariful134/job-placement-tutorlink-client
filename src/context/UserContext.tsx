"use client";
import { getCurrentUser } from "@/services/authService";
import { IUser } from "@/types";

import React, { createContext, useContext, useEffect, useState } from "react";

interface IUserProviderValue {
  user: IUser | null;
  isLoading: boolean;
  setUser: (user: IUser | null) => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  ratings: number | null;
  setRatings: React.Dispatch<React.SetStateAction<number | null>>;
}

const UserContext = createContext<IUserProviderValue | undefined>(undefined);

const UserProviders = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);

  const [ratings, setRatings] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleUser = async () => {
    const user = await getCurrentUser();
    setUser(user);
    setIsLoading(false);
  };

  useEffect(() => {
    handleUser();
  }, [isLoading]);

  return (
    <UserContext.Provider
      value={{ user, setUser, isLoading, setIsLoading, ratings, setRatings }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context == undefined) {
    throw new Error("useUser must be used within the UserProviders Context");
  }
  return context;
};

export default UserProviders;
