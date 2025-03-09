"use client";

import {
  Button,
  Label,
  Textarea,
  Radio,
  RangeSlider,
  Spinner,
  Checkbox,
  Tooltip,
} from "flowbite-react";
import authenticatedGetRequest from "../util/authenticatedRequest";
import authenticatedPostRequest from "../util/authenticatedRequest";
import { ChangeEvent, useEffect, useState } from "react";
import { Person, FineType } from "../types/types";

function FineForm() {
  const [people, setPeople] = useState<Person[]>([]);
  const [fineTypes, setFineTypes] = useState<FineType[]>([]);
  const [fineDescription, setFineDescription] = useState("");
  const [selectedFineTypeId, setSelectedFineTypeId] = useState("");
  const [selectedFineAmount, setSelectedFineAmount] = useState(1);
  const [selectedPeople, setSelectedPeople] = useState<number[]>([]);

  const [status, setStatus] = useState("inProgress");
  const [errorMessage, setErrorMessage] = useState("");

  // Get People
  useEffect(() => {
    async function fetchPeople() {
      const response =
        await authenticatedGetRequest.authenticatedGetRequest("/persons");
      setPeople(response.data);
    }
    fetchPeople();
  }, []);

  // Get Fine Types
  useEffect(() => {
    async function fetchFineTypes() {
      const response =
        await authenticatedGetRequest.authenticatedGetRequest("/fine-types");
      setFineTypes(response.data);
      setSelectedFineTypeId(response.data[0].id);
    }
    fetchFineTypes();
  }, []);

  // Submit Form
  const submitForm = async () => {
    console.log("submitting form");
    setStatus("submitting");

    const data = {
      description: fineDescription,
      fine_type_id: selectedFineTypeId,
      amount: selectedFineAmount,
      people: selectedPeople,
    };

    try {
      const response = await authenticatedPostRequest.authenticatedPostRequest(
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
        <Textarea
          id="large"
          required
          rows={4}
          onChange={(e) => setFineDescription(e.target.value)}
        />
      </div>
      <fieldset className="flex max-w-md flex-col gap-4">
        <div className="mb-2 block">
          <Label htmlFor="large" value="Fine Type" />
        </div>
        {fineTypes.map((fineType, index) => (
          <div key={fineType.id} className="flex items-center gap-2">
            <Tooltip
              content={fineType.description}
              style="light"
              placement="right"
            >
              <Radio
                id={fineType.id}
                defaultChecked={index === 0}
                name="fineType"
                value={fineType.name}
                onChange={(e) => setSelectedFineTypeId(e.target.value)}
                className="mr-2"
              />
              <Label htmlFor={fineType.id}>{fineType.name}</Label>
            </Tooltip>
          </div>
        ))}
      </fieldset>
      <div>
        <div className="mb-1 block">
          <Label
            htmlFor="default-range"
            value={`Fine Amount: ${selectedFineAmount}`}
          />
        </div>
        <RangeSlider
          id="default-range"
          min={1}
          max={10}
          step={1}
          value={selectedFineAmount}
          onChange={(e) => setSelectedFineAmount(Number(e.target.value))}
        />
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
        <div className="text-green-500">Fine Created</div>
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
    </>
  );
}

export default FineForm;
