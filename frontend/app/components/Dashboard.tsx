import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import FineList from "../components/FinesList";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard: React.FC = () => {
  return (
    <>
      <div className="grid h-[calc(100vh-4rem)] w-screen grid-cols-2 grid-rows-2 gap-4 p-4 dark:bg-gray-800">
        <div className="flex justify-center border-2 border-gray-200 bg-gray-100 text-2xl font-bold text-white dark:border-gray-600 dark:bg-gray-700">
          <FineList />
        </div>
        <div className="flex items-center justify-center bg-green-500 text-2xl font-bold text-white">
          <h1>2</h1>
        </div>
        <div className="flex items-center justify-center bg-red-500 text-2xl font-bold text-white">
          <Doughnut
            data={{
              labels: ["Yes", "No"],
              datasets: [
                {
                  label: "",
                  data: [1, 2],
                },
              ],
            }}
          />
        </div>
        <div className="flex items-center justify-center bg-yellow-500 text-2xl font-bold text-white">
          Box 4
        </div>
      </div>
    </>
  );
};

export default Dashboard;
