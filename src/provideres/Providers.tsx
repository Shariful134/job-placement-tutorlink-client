"use client";
import UserProviders from "@/context/UserContext";
import React from "react";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return <UserProviders>{children}</UserProviders>;
};

export default Providers;
