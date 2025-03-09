import { Fine } from "../types/types";
import { FaUserCircle } from "react-icons/fa";
import { capitalize } from "../util/utilFunctions";

interface DashboardFineesProps {
  fine: Fine | null;
}

function DashboardFinees({ fine }: DashboardFineesProps) {
  return (
    <>
      <div className="flex justify-center space-y-4 rtl:space-y-reverse">
        <ul className="max-w-md divide-y divide-gray-200 pt-4 dark:divide-gray-700">
          {fine?.people.map((person) => (
            <li className="pb-3 sm:pb-4" key={person.id}>
              <div className="flex items-stretch space-x-4 rtl:space-x-reverse">
                <div className="flex-strink-0">
                  <FaUserCircle />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xl text-gray-900 dark:text-white">
                    {person.name}
                  </p>
                  <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                    {capitalize(person.position)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default DashboardFinees;
