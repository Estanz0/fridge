"use client";

import { Button, Label } from "flowbite-react";

import { account } from "../util/Appwrite";

function VerifyForm() {
  function emailVerification() {
    // Get current hostname
    const verifyUrl = window.location.origin + "/complete-verification";
    account.createVerification(verifyUrl).then((response) => {
      console.log("Verification email sent:", response);
    });
  }

  return (
    <>
      <div className="flex w-96 flex-col gap-4">
        <Label value="Please verify your email address" />
        <Button onClick={emailVerification}>Send Verification Email</Button>
      </div>
    </>
  );
}

export default VerifyForm;
