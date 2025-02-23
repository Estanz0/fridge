"use client";

import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { Fine } from "../types/types.tsx";
import authenticatedGetRequest from "../util/authenticatedRequest.tsx";

function FinesList() {
  const [fines, setFines] = useState<Fine[]>([]);

  useEffect(() => {
    async function fetchFines() {
      const response =
        await authenticatedGetRequest.authenticatedGetRequest("/fines");
      setFines(response.data);
    }

    fetchFines();
  }, []);
  return (
    <div className="overflow-x-auto">
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>Description</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
          <Table.HeadCell>Fine Type</Table.HeadCell>
          <Table.HeadCell>Amount</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Edit</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {fines.map((fine) => (
            <Table.Row
              key={fine.id}
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {fine.description}
              </Table.Cell>
              <Table.Cell>{fine.status}</Table.Cell>
              <Table.Cell>{fine.fine_type}</Table.Cell>
              <Table.Cell>{fine.amount}</Table.Cell>
              <Table.Cell>
                <a href={`/fines/${fine.id}`}>
                  {fine.status === "open" ? "Vote" : "View"}
                </a>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}

export default FinesList;
