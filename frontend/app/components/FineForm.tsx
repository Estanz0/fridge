"use client";

import {
  Button,
  Label,
  TextInput,
  Radio,
  RangeSlider,
  Spinner,
  Checkbox,
} from "flowbite-react";
import unauthenticatedGetRequest from "../util/authenticatedRequest";
import unauthenticatedPostRequest from "../util/authenticatedRequest";
import { ChangeEvent, useEffect, useState } from "react";
import { Person, FineTypeValues } from "../types/types";

function FineForm() {
  // Get People
  const [people, setPeople] = useState<Person[]>([]);
  useEffect(() => {
    async function fetchPeople() {
      const response =
        await unauthenticatedGetRequest.unauthenticatedGetRequest("/persons");
      setPeople(response.data);
    }
    fetchPeople();
  }, []);

  const [fineDescription, setFineDescription] = useState("");
  const [fineType, setFineType] = useState("");
  const [fineAmount, setFineAmount] = useState(1);
  const [selectedPeople, setSelectedPeople] = useState<number[]>([]);

  const [status, setStatus] = useState("inProgress");
  const [errorMessage, setErrorMessage] = useState("");
  // Submit Form
  const submitForm = async () => {
    console.log("submitting form");
    setStatus("submitting");

    const data = {
      description: fineDescription,
      fine_type: fineType,
      amount: fineAmount,
      people: selectedPeople,
    };

    try {
      const response =
        await unauthenticatedPostRequest.unauthenticatedPostRequest(
          "/fines",
          data,
        );
      if (response.status === 201) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unknown error occurred");
      }
    }
  };

  function handleSelectPeople(
    e: ChangeEvent<HTMLInputElement>,
    personId: number,
  ) {
    const isSelected = e.target.checked;
    if (selectedPeople.includes(personId) && !isSelected) {
      setSelectedPeople(selectedPeople.filter((id) => id !== personId));
    } else {
      setSelectedPeople([...selectedPeople, personId]);
    }
  }

  return (
    <>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="large" value="Fine Description" />
        </div>
        <TextInput
          id="large"
          type="text"
          sizing="lg"
          onChange={(e) => setFineDescription(e.target.value)}
        />
      </div>
      <fieldset className="flex max-w-md flex-col gap-4">
        <div className="mb-2 block">
          <Label htmlFor="large" value="Fine Type" />
        </div>
        {Object.values(FineTypeValues).map((fineType) => (
          <div key={fineType} className="flex items-center gap-2">
            <Radio
              id={fineType}
              name="fineType"
              value={fineType}
              onChange={(e) => setFineType(e.target.value)}
            />
            <Label htmlFor={fineType}>{fineType}</Label>
          </div>
        ))}
      </fieldset>
      <div>
        <div className="mb-1 block">
          <Label htmlFor="default-range" value="Fine Amount" />
        </div>
        <RangeSlider
          id="default-range"
          min={1}
          max={10}
          step={1}
          value={fineAmount}
          onChange={(e) => setFineAmount(Number(e.target.value))}
        />
        {fineAmount}
      </div>
      <div className="mb-2 block">
        <Label htmlFor="large" value="People" />
      </div>
      <div className="flex max-w-md flex-col gap-4" id="checkbox">
        <div className="flex items-center gap-2">
          {people.map((person) => (
            <div key={person.id} className="flex items-center gap-2">
              <Checkbox
                id={person.id.toString()}
                onChange={(e) => {
                  handleSelectPeople(e, person.id);
                }}
              />
              <Label htmlFor={person.id.toString()} className="flex">
                {person.name}
              </Label>
            </div>
          ))}
        </div>
      </div>
      {status === "error" && (
        <div className="text-red-500">
          Failed to submit form: {errorMessage}
        </div>
      )}
      {status === "success" && (
        <div className="text-green-500">Form submitted successfully</div>
      )}
      {status === "submitting" && (
        <div>
          Submitting form... <Spinner aria-label="Default status example" />
        </div>
      )}
      {status === "inProgress" && (
        <Button type="submit" onClick={() => submitForm()}>
          Submit
        </Button>
      )}
      status: {status}
      selectedPeople: {selectedPeople.join(", ")}
    </>
  );
}

export default FineForm;
