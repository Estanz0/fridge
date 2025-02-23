import LoginForm from "../components/LoginForm";
import React from "react";

const LoginPage: React.FC = () => {
  return (
    <>
      <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-800">
        <LoginForm />
      </div>
    </>
  );
};

export default LoginPage;
