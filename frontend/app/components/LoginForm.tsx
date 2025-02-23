"use client";
import React, { useRef } from "react";
import { Button, Checkbox, Label, TextInput } from "flowbite-react";

import { account } from "../util/Appwrite";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const navigate = useNavigate();
  const loginForm = useRef<HTMLFormElement>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = loginForm.current?.email.value;
    const password = loginForm.current?.password.value;

    try {
      account.createEmailPasswordSession(email, password).then((response) => {
        console.log("User has been Logged In:", response.userId);
        window.location.href = "/";
      });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  return (
    <>
      <form
        className="flex max-w-md flex-col gap-4"
        ref={loginForm}
        onSubmit={handleLogin}
      >
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email1" value="Your email" />
          </div>
          <TextInput
            id="email"
            type="email"
            placeholder="name@flowbite.com"
            required
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password" value="Your password" />
          </div>
          <TextInput id="password" type="password" required />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="remember" />
          <Label htmlFor="remember">Remember me</Label>
        </div>
        <Button type="submit">Submit</Button>
        <Button color="gray" onClick={() => navigate("/register")}>
          Sign Up
        </Button>
      </form>
    </>
  );
}

export default LoginForm;
