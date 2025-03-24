import { Button, Tabs } from "flowbite-react";
import {
  MdOutlineHowToVote,
  MdNotInterested,
  MdOutlinePaid,
} from "react-icons/md";
import { HiUserCircle } from "react-icons/hi";
import { FaCheckSquare } from "react-icons/fa";
import FineList from "../components/FinesList";
import { FineFilter } from "../types/types";
import { useState } from "react";

interface DashboardFinesProps {
  setSelectedFineId: (fineId: string) => void;
}

function DashboardFines({ setSelectedFineId }: DashboardFinesProps) {
  const [selectedFineType, setSelectedFineType] = useState<FineFilter>(
    FineFilter.OPEN,
  );
  return (
    <>
      <div className="md:flex">
        <ul className="flex-column space-y mb-4 space-y-4 text-sm font-medium text-gray-500 dark:text-gray-400 md:mb-0 md:me-4">
          <li>
            <Button
              onClick={() => setSelectedFineType(FineFilter.OPEN)}
              className="inline-flex w-full items-center rounded-lg bg-gray-50 px-4 py-3 hover:bg-gray-100 hover:text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <MdOutlineHowToVote className="mr-1" />
              Open
            </Button>
          </li>

          <li>
            <Button
              onClick={() => setSelectedFineType(FineFilter.APPROVED)}
              className="inline-flex w-full items-center rounded-lg bg-gray-50 px-4 py-3 hover:bg-gray-100 hover:text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <FaCheckSquare className="mr-1" />
              Approved
            </Button>
          </li>
          <li>
            <Button
              onClick={() => setSelectedFineType(FineFilter.DENIED)}
              className="inline-flex w-full items-center rounded-lg bg-gray-50 px-4 py-3 hover:bg-gray-100 hover:text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <MdNotInterested className="mr-1" />
              Denied
            </Button>
          </li>
          <li>
            <Button
              onClick={() => setSelectedFineType(FineFilter.PAID)}
              className="inline-flex w-full items-center rounded-lg bg-gray-50 px-4 py-3 hover:bg-gray-100 hover:text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <MdOutlinePaid className="mr-1" />
              Paid
            </Button>
          </li>
          <li>
            <Button
              onClick={() => setSelectedFineType(FineFilter.MY_CREATED_FINES)}
              className="inline-flex w-full items-center rounded-lg bg-gray-50 px-4 py-3 hover:bg-gray-100 hover:text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <HiUserCircle className="mr-1" />
              My Fines
            </Button>
          </li>
        </ul>

        <FineList
          setSelectedFineId={setSelectedFineId}
          fineFilter={selectedFineType}
        />
      </div>
    </>
  );
}

export default DashboardFines;
