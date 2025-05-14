// "use client";
// import RegisterTutor from "@/components/modules/auth/register/tutor/RegisterTutor";
// import React from "react";

// const TutorLogin = () => {
//   return (
//     <div className="pt-5 w-screen flex justify-center items-center">
//       <RegisterTutor></RegisterTutor>
//     </div>
//   );
// };

// export default TutorLogin;

"use client";
import dynamic from "next/dynamic";

import React from "react";

const RegisterTutor = dynamic(
  () => import("@/components/modules/auth/register/tutor/RegisterTutor"),
  {
    ssr: false,
  }
);

const TutorLogin = () => {
  return (
    <div className="pt-5 w-screen flex justify-center items-center">
      <RegisterTutor />
    </div>
  );
};

export default TutorLogin;
