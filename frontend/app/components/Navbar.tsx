"use client";

import { useEffect, useState } from "react";
import { Button, Navbar, DarkThemeToggle, Modal } from "flowbite-react";
import FineForm from "./FineForm.tsx";
import { account } from "../util/Appwrite";
import { Models } from "appwrite";

function NavbarComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null,
  );

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await account.get();
        setUser(response);
      } catch (error) {}
    }
    fetchUser();
  }, []);

  const LogoutUser = async () => {
    try {
      const response = await account.deleteSession("current");
      console.log("Logout successful:", response);
    } catch (error) {
      console.error("Logout failed:", error);
    }
    window.location.href = "/";
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <Navbar fluid>
      <Navbar.Brand href="/">
        <img src="/favicon.ico" className="mr-3 h-6 sm:h-9" alt="F" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Fridge
        </span>
      </Navbar.Brand>

      <div className="flex space-x-4 md:order-2">
        {user && (
          <>
            <h5 className="pt-1 text-2xl  font-bold text-gray-900 dark:text-gray-300">
              Hello {user?.name.split(" ")[0]}!
            </h5>
            {user && user.emailVerification && (
              <Button onClick={() => setIsModalOpen(true)}>New Fine</Button>
            )}
            <Button color="gray" onClick={() => LogoutUser()}>
              Logout
            </Button>
          </>
        )}
        <DarkThemeToggle />
      </div>

      <Modal show={isModalOpen} onClose={closeModal}>
        <Modal.Header>New Fine</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <FineForm />
          </div>
        </Modal.Body>
      </Modal>
    </Navbar>
  );
}

export default NavbarComponent;
