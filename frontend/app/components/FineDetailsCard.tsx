import React from "react";
import { Card } from "flowbite-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const FineDetailsCard = ({ fine }) => {
  return (
    <Card className="mx-auto max-w-md rounded-2xl p-4 shadow-lg">
      <CardHeader>
        <h2 className="text-xl font-semibold">Fine Details</h2>
      </CardHeader>
      <CardBody>
        <div className="mb-2">
          <p className="text-gray-700">
            <span className="font-bold">Type:</span>{" "}
            {fine.fine_type.replace("_", " ")}
          </p>
          <p className="text-gray-700">
            <span className="font-bold">Amount:</span> {fine.amount}
          </p>
          <p className="text-gray-700">
            <span className="font-bold">Description:</span> {fine.description}
          </p>
          <p className="text-gray-700">
            <span className="font-bold">Created At:</span>{" "}
            {format(new Date(fine.created_at), "yyyy-MM-dd HH:mm")}
          </p>
          <p className="text-gray-700">
            <span className="font-bold">Status:</span>{" "}
            <Badge>{fine.status}</Badge>
          </p>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold">People Involved:</h3>
          {fine.people.length > 0 ? (
            fine.people.map((person) => (
              <div key={person.id} className="mt-2 flex items-center gap-2">
                <p className="font-medium">{person.name}</p>
                <Badge>{person.position}</Badge>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No people involved</p>
          )}
        </div>
      </CardBody>
      <CardFooter className="flex justify-end">
        <Button variant="outline">Vote</Button>
      </CardFooter>
    </Card>
  );
};

export default FineDetailsCard;
