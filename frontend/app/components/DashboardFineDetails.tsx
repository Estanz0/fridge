import { Fine } from "../types/types";
import { formatDateToLocal } from "../util/utilFunctions";

interface FineDetailsProps {
  fine: Fine | null;
}

const FineDetails = ({ fine }: FineDetailsProps) => {
  return (
    <div className="max-h-96 overflow-y-auto sm:rounded-lg">
      <dl className="max-w-md divide-y divide-gray-200 p-4 text-gray-900 dark:divide-gray-700 dark:text-white">
        <div className="flex flex-col pb-3">
          <dt className="mb-1 text-gray-500 dark:text-gray-400 md:text-lg">
            Submitted by
          </dt>
          <dd className="text-lg font-semibold">{fine?.creator.name}</dd>
        </div>
        <div className="flex flex-col py-3">
          <dt className="mb-1 text-gray-500 dark:text-gray-400 md:text-lg">
            Closes At
          </dt>
          <dd className="text-lg font-semibold">
            {fine?.status === "open"
              ? formatDateToLocal(fine?.closes_at, true)
              : "Closed on " + formatDateToLocal(fine?.closes_at, true)}
          </dd>
        </div>

        <div className="flex flex-col pt-3">
          <dt className="mb-1 text-gray-500 dark:text-gray-400 md:text-lg">
            Description
          </dt>
          <dd className="text-lg font-semibold">{fine?.description}</dd>
        </div>
      </dl>
    </div>
  );
};

export default FineDetails;
