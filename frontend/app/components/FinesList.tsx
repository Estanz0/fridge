"use client";

import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { Fine, FineFilter } from "../types/types.tsx";
import authenticatedGetRequest from "../util/authenticatedRequest.tsx";

interface FinesListProps {
  setSelectedFineId: (fineId: string) => void;
  fineFilter: FineFilter;
}

function FinesList({ setSelectedFineId, fineFilter }: FinesListProps) {
  const [fines, setFines] = useState<Fine[]>([]);

  useEffect(() => {
    async function fetchFines() {
      const response = await authenticatedGetRequest.authenticatedGetRequest(
        "/fines",
        { filter: fineFilter },
      );
      setFines(response.data);
    }

    fetchFines();
  }, []);
  return (
    <div className="w-full overflow-x-auto dark:bg-gray-800">
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>Description</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
          <Table.HeadCell>Fine Type</Table.HeadCell>
          <Table.HeadCell>Amount</Table.HeadCell>
          <Table.HeadCell>Created By</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Edit</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {fines.map((fine) => (
            <Table.Row
              key={fine.id}
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
              onClick={() => setSelectedFineId(fine.id)}
            >
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {fine.description}
              </Table.Cell>
              <Table.Cell>{fine.status}</Table.Cell>
              <Table.Cell>{fine.fine_type.name}</Table.Cell>
              <Table.Cell>{fine.amount}</Table.Cell>
              <Table.Cell>{fine.creator.name}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}

export default FinesList;
