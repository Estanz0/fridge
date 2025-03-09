import { Fine } from "../types/types";
import { FcCheckmark, FcCancel } from "react-icons/fc";
import { capitalize, formatDateToLocal } from "../util/utilFunctions";

interface DashboardVotesListProps {
  fine: Fine | null;
}

function DashboardVotesList({ fine }: DashboardVotesListProps) {
  return (
    <>
      <div className="flex justify-center space-y-4 rtl:space-y-reverse">
        <ul className="max-w-md divide-y divide-gray-200 pt-4 dark:divide-gray-700">
          {fine?.votes.map((vote) => (
            <li className="pb-3 sm:pb-4" key={vote.id}>
              <div className="flex items-stretch space-x-4 rtl:space-x-reverse">
                <div className="flex-strink-0">
                  {vote.vote === "approve" ? (
                    <>
                      <FcCheckmark />
                    </>
                  ) : (
                    <>
                      <FcCancel />
                    </>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {vote.voter.name}
                  </p>
                  <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                    {formatDateToLocal(vote.created_at, true)}
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

export default DashboardVotesList;
