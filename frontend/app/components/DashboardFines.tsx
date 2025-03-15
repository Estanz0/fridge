import { Tabs } from "flowbite-react";
import {
  MdOutlineHowToVote,
  MdNotInterested,
  MdOutlinePaid,
} from "react-icons/md";
import { HiUserCircle } from "react-icons/hi";
import { FaCheckSquare } from "react-icons/fa";
import FineList from "../components/FinesList";
import { FineFilter } from "../types/types";

interface DashboardFinesProps {
  setSelectedFineId: (fineId: string) => void;
}

function DashboardFines({ setSelectedFineId }: DashboardFinesProps) {
  return (
    <Tabs aria-label="Default tabs" style="fullWidth">
      <Tabs.Item active title="Voting Open" icon={MdOutlineHowToVote}>
        <FineList
          setSelectedFineId={setSelectedFineId}
          fineFilter={FineFilter.OPEN}
        />
      </Tabs.Item>
      <Tabs.Item active title="Approved" icon={FaCheckSquare}>
        <FineList
          setSelectedFineId={setSelectedFineId}
          fineFilter={FineFilter.APPROVED}
        />
      </Tabs.Item>
      <Tabs.Item active title="Denied" icon={MdNotInterested}>
        <FineList
          setSelectedFineId={setSelectedFineId}
          fineFilter={FineFilter.DENIED}
        />
      </Tabs.Item>
      <Tabs.Item active title="Paid" icon={MdOutlinePaid}>
        <FineList
          setSelectedFineId={setSelectedFineId}
          fineFilter={FineFilter.PAID}
        />
      </Tabs.Item>
      <Tabs.Item title="My Fines" icon={HiUserCircle}>
        <FineList
          setSelectedFineId={setSelectedFineId}
          fineFilter={FineFilter.MY_CREATED_FINES}
        />
      </Tabs.Item>
    </Tabs>
  );
}

export default DashboardFines;
