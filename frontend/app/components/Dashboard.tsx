import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import DashboardFines from "./DashboardFines.tsx";
import DashboardFineDetails from "./DashboardFineDetails.tsx";
import DashboardFinees from "./DashboardFinees.tsx";
import DashboardVoteOutcome from "./DashboardVoteOutcome.tsx";
import DashboardVotesList from "./DashboardVotesList.tsx";
import DashboardGraph from "./DashboardGraph.tsx";
import { Fine } from "../types/types";
import authenticatedGetRequest from "../util/authenticatedRequest.tsx";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard: React.FC = () => {
  const [selectedFineId, setSelectedFineId] = useState<string>("");
  const [selectedFine, setSelectedFine] = useState<Fine | null>(null);

  function getFineData() {
    if (selectedFineId) {
      authenticatedGetRequest
        .authenticatedGetRequest(`/fines/${selectedFineId}`)
        .then((response) => {
          setSelectedFine(response.data);
        });
    }
  }

  useEffect(() => {
    getFineData();
  }, [selectedFineId]);

  return (
    <>
      <div className="flex h-[calc(100vh-4rem+2px)] w-screen flex-col gap-4 overflow-x-auto p-4 dark:bg-gray-800 lg:flex-row">
        {/* Fines List */}
        <div className="flex  flex-auto flex-col gap-4">
          <div className="grow border-2 border-gray-200 bg-gray-100 p-1 text-2xl font-bold text-white dark:border-gray-600 dark:bg-gray-700">
            <DashboardFines setSelectedFineId={setSelectedFineId} />
          </div>
        </div>
        {/* Fine Details */}
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex-none border-2 border-gray-200 bg-gray-100 text-2xl font-bold text-white dark:border-gray-600 dark:bg-gray-700">
            <DashboardVoteOutcome
              fine={selectedFine}
              getFineData={getFineData}
            />
          </div>
          <div className="flex flex-1 flex-col border-2 border-gray-200 bg-gray-100 dark:border-gray-600 dark:bg-gray-700">
            <h4 className="m-2 text-center text-2xl font-bold text-gray-500 dark:text-gray-400">
              {selectedFine?.title}
            </h4>
            <hr className="border-2 border-gray-200 dark:border-gray-600" />

            <DashboardFineDetails fine={selectedFine} />
          </div>

          {/* <div className="flex-1 border-2 border-gray-200 bg-gray-100 text-2xl font-bold text-white dark:border-gray-600 dark:bg-gray-700">
            <DashboardGraph fine={selectedFine} />
          </div> */}
        </div>
        {/* Finees and Votes */}
        <div className="flex flex-1 flex-col gap-4">
          <div className="min-w-fit grow border-2 border-gray-200 bg-gray-100 text-2xl font-bold text-white dark:border-gray-600 dark:bg-gray-700">
            <h4 className="m-2 text-center text-2xl font-bold text-gray-500 dark:text-gray-400">
              Finees
            </h4>
            <hr className="my-4 h-px border-0 bg-gray-500 dark:bg-gray-500"></hr>
            <DashboardFinees fine={selectedFine} />
          </div>

          <div className="min-w-fit grow border-2 border-gray-200 bg-gray-100 text-2xl font-bold text-white dark:border-gray-600 dark:bg-gray-700">
            <h4 className="m-2 text-center text-2xl font-bold text-gray-500 dark:text-gray-400">
              Votes
            </h4>
            <hr className="my-4 h-px border-0 bg-gray-500 dark:bg-gray-500"></hr>
            <DashboardVotesList fine={selectedFine} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
