"use client";

import { Button, Label, TextInput } from "flowbite-react";
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import unAuthenticatedPostRequest from "../util/authenticatedRequest";

function RegisterForm() {
  const navigate = useNavigate();
  const registerForm = useRef<HTMLFormElement>(null);

  const [isValidEmail, setIsValidEmail] = React.useState(true);
  const [isPasswordMatch, setIsPasswordMatch] = React.useState(true);
  const [message, setMessage] = React.useState("");

  function validateEmail(email: string) {
    return (
      email.endsWith("@kpmg.co.nz") ||
      email.endsWith("byron.lg.smith@gmail.com")
    );
  }

  function validatePassword(password: string, repeatPassword: string) {
    return password.length >= 8 && password === repeatPassword;
  }

  const handleRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fullname = registerForm.current?.fullname.value;
    const email = registerForm.current?.email.value;
    const password = registerForm.current?.password?.value;
    const repeatPassword = registerForm.current?.repeatPassword?.value;

    if (!validateEmail(email)) {
      setIsValidEmail(false);
      setMessage("Email address must end with @kpmg.co.nz");
      return;
    }

    if (!validatePassword(password, repeatPassword)) {
      setIsPasswordMatch(false);
      setMessage("Passwords do not match");
      return;
    }

    try {
      // Create user in backend
      unAuthenticatedPostRequest
        .unAuthenticatedPostRequest("/persons", {
          name: fullname,
          email: email,
          password: password,
        })
        .then((response) => {
          console.log("User created in backend:", response);
          window.location.href = "/";
        });
    } catch (error) {
      console.error("Registration failed:", error);
      // Handle registration errors appropriately
    }
  };

  return (
    <form
      className="flex w-96 flex-col gap-4"
      ref={registerForm}
      onSubmit={handleRegistration}
    >
      <div>
        <div className="mb-2 block">
          <Label htmlFor="fullname" value="Your name" />
        </div>
        <TextInput
          id="fullname"
          type="text"
          placeholder="John Doe"
          required
          shadow
        />
        <div className="mb-2 block">
          <Label htmlFor="email" value="Your email" />
        </div>

        <TextInput
          id="email"
          type="email"
          placeholder="yourname@kpmg.co.nz"
          required
          shadow
          color={isValidEmail ? "gray" : "failure"}
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="password" value="Your password" />
        </div>
        <TextInput
          id="password"
          type="password"
          placeholder="********"
          minLength={8}
          required
          shadow
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="repeatPassword" value="Repeat password" />
        </div>
        <TextInput
          id="repeatPassword"
          type="password"
          placeholder="********"
          required
          shadow
          color={isPasswordMatch ? "gray" : "failure"}
        />
      </div>
      <Button type="submit">Register new account</Button>
      <p className="text-red-500">{message}</p>
      <p className="text-gray-500">Already have an account? </p>
      <Button color="gray" onClick={() => navigate("/login")}>
        Login
      </Button>
    </form>
  );
}

export default RegisterForm;
