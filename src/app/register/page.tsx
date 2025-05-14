// "use client";
// import RegisterForm from "@/components/modules/auth/register/Register";

// const Register = () => {
//   return (
//     <div className="pt-5 w-screen flex justify-center items-center">
//       <RegisterForm />
//     </div>
//   );
// };

// export default Register;

"use client";
import dynamic from "next/dynamic";

import React from "react";

const RegisterForm = dynamic(
  () => import("@/components/modules/auth/register/Register"),
  {
    ssr: false,
  }
);

const Register = () => {
  return (
    <div className="pt-5 w-screen flex justify-center items-center">
      <RegisterForm />
    </div>
  );
};

export default Register;
