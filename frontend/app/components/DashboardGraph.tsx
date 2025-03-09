import { Fine } from "../types/types";
import { Pie } from "react-chartjs-2";

interface DashboardGraphProps {
  fine: Fine | null;
}

function DashboardGraph({ fine }: DashboardGraphProps) {
  return (
    <div className="flex h-full w-full items-center justify-center pb-3">
      <Pie
        data={{
          datasets: [
            {
              label: "# of Votes",
              data: fine ? Object.values(fine.vote_count) : [],
              backgroundColor: ["#31C48D", "#F98080"],
              borderColor: ["#31C48D", "#F98081"],
              hoverOffset: 4,
            },
          ],
        }}
      />
    </div>
  );
}

export default DashboardGraph;
