import RegisterForm from "../components/RegisterForm";
import React from "react";

const RegisterPage: React.FC = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-800">
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
