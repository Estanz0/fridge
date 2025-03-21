import { Fine } from "../types/types";
import { formatDateToLocal } from "../util/utilFunctions";

interface FineDetailsProps {
  fine: Fine | null;
}

const FineDetails = ({ fine }: FineDetailsProps) => {
  return (
    <>
      <dl className="flex min-h-0 flex-col divide-y divide-gray-200 p-4 text-gray-900 dark:divide-gray-700 dark:text-white">
        <div className="flex flex-col pb-3">
          <dt className="mb-1 text-gray-500 dark:text-gray-400">
            Submitted by
          </dt>
          <dd className="text-lg font-normal">{fine?.creator.name}</dd>
        </div>
        <div className="flex flex-col py-3">
          <dt className="mb-1 text-gray-500 dark:text-gray-400">Closes At</dt>
          <dd className="text-lg font-normal">
            {fine?.status === "open"
              ? formatDateToLocal(fine?.closes_at, true)
              : "Closed on " + formatDateToLocal(fine?.closes_at, true)}
          </dd>
        </div>

        <div className="flex min-h-0 flex-1 flex-col pt-3">
          <dt className="mb-1 text-gray-500 dark:text-gray-400">Description</dt>
          <dd className="overflow-auto whitespace-pre-wrap break-words text-lg font-normal">
            {fine?.description}
          </dd>
        </div>
      </dl>
    </>
  );
};

export default FineDetails;
