import React from "react";
import { account } from "../util/Appwrite";

const CompleteVerificationPage: React.FC = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const secret = urlParams.get("secret");
  const userId = urlParams.get("userId");

  if (!secret || !userId) {
    console.error("Missing secret or userId");
    return null;
  }

  account
    .updateVerification(userId, secret)
    .then((response) => {
      console.log("User has been verified:", response);
    })
    .finally(() => {
      window.location.href = "/";
    });
  return (
    <>
      <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-800">
        Thank You
      </div>
    </>
  );
};

export default CompleteVerificationPage;
