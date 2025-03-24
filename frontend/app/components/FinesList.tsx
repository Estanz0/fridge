"use client";

import { useEffect, useState } from "react";
import { Fine, FineFilter } from "../types/types.tsx";
import authenticatedGetRequest from "../util/authenticatedRequest.tsx";
import { capitalize } from "../util/utilFunctions.tsx";

interface FinesListProps {
  setSelectedFineId: (fineId: string) => void;
  fineFilter: FineFilter;
}

function FinesList({ setSelectedFineId, fineFilter }: FinesListProps) {
  const [fines, setFines] = useState<Fine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFines() {
      setLoading(true);
      const response = await authenticatedGetRequest.authenticatedGetRequest(
        "/fines",
        { filter: fineFilter },
      );
      setFines(response.data);
      setLoading(false);
    }

    fetchFines();
  }, [fineFilter]);
  return (
    <div className="w-full overflow-auto dark:bg-gray-800">
      <div className="relative overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Title
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Fine Type
              </th>
              <th scope="col" className="px-6 py-3">
                Amount
              </th>
              <th scope="col" className="px-6 py-3">
                Created By
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Show a loading spinner while the data is being fetched
              <>
                <div className="mr-3 h-5 w-5 animate-spin bg-gray-900 dark:bg-gray-800"></div>
                <p>Loading...</p>
              </>
            ) : (
              // Show the list of fines
              fines.map((fine) => (
                <tr
                  key={fine.id}
                  onClick={() => setSelectedFineId(fine.id)}
                  className="border-b border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                >
                  <th
                    scope="row"
                    className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                  >
                    {fine.title}
                  </th>
                  <td className="px-6 py-4">{capitalize(fine.status)}</td>
                  <td className="px-6 py-4">{fine.fine_type.name}</td>
                  <td className="px-6 py-4">{fine.amount}</td>
                  <td className="px-6 py-4">{fine.creator.name}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FinesList;
