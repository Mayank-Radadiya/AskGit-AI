import { SignUp } from "@clerk/nextjs";
import { FC } from "react";

const page: FC = () => {
  return (
    <>
      <div className="flex h-screen w-screen flex-col items-center justify-center">
        <SignUp />
      </div>
    </>
  );
};

export default page;
