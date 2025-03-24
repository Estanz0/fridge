import { Fine } from "../types/types";
// import { Pie } from "react-chartjs-2";
import ReactApexChart from "react-apexcharts";
import { useState } from "react";

interface DashboardGraphProps {
  fine: Fine | null;
}

function DashboardGraph({ fine }: DashboardGraphProps) {
  const [state, setState] = useState({
    series: [fine?.vote_count?.approve, fine?.vote_count?.deny].filter(
      (value): value is number => value !== undefined,
    ),
    options: {
      chart: {
        type: "pie" as "pie",
      },
      labels: ["Approve", "Deny"],
      colors: ["#008000", "#FF4560"],
      width: "50%",

      responsive: [
        {
          breakpoint: 180,
          options: {
            chart: {
              width: 10,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  });
  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="pie"
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
}

export default DashboardGraph;
