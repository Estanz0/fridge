import React from "react";
import VerifyForm from "../components/VerifyForm";

const VerifyPage: React.FC = () => {
  return (
    <>
      <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-800">
        <VerifyForm />
      </div>
    </>
  );
};

export default VerifyPage;
