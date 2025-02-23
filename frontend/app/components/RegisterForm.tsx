"use client";

import { Button, Label, TextInput } from "flowbite-react";
import React, { useRef } from "react";
// import { Link } from "react-router-dom";
import { ID } from "appwrite";
import { account } from "../util/Appwrite";
import { useNavigate } from "react-router-dom";
import authenticatedPostRequest from "../util/authenticatedRequest";

function RegisterForm() {
  const navigate = useNavigate();
  const registerForm = useRef<HTMLFormElement>(null);

  const handleRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = registerForm.current?.email.value;
    const password = registerForm.current?.password?.value;

    try {
      const response = await account.create(ID.unique(), email, password);
      console.log("Registration successful:", response);
      // Create user in backend
      authenticatedPostRequest
        .authenticatedPostRequest("/persons", {
          id: response.$id,
          name: response.email,
          position: "user",
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
      className="flex max-w-md flex-col gap-4"
      ref={registerForm}
      onSubmit={handleRegistration}
    >
      <div>
        <div className="mb-2 block">
          <Label htmlFor="email" value="Your email" />
        </div>
        <TextInput
          id="email"
          type="email"
          placeholder="name@company.com"
          required
          shadow
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="password" value="Your password" />
        </div>
        <TextInput
          id="password"
          type="password"
          minLength={8}
          required
          shadow
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="repeat-password" value="Repeat password" />
        </div>
        <TextInput id="repeat-password" type="password" required shadow />
      </div>
      <Button type="submit">Register new account</Button>
      <Button color="gray" onClick={() => navigate("/login")}>
        Login
      </Button>
    </form>
  );
}

export default RegisterForm;
