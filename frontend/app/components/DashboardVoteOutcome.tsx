import { Fine } from "../types/types";
import authenticatedPostRequest from "../util/authenticatedRequest";
import authenticatedPutRequest from "../util/authenticatedRequest";
import { useState } from "react";
import { capitalize } from "../util/utilFunctions";
import { Button } from "flowbite-react";

interface DashboardVoteOutcomeProps {
  getFineData: () => void;
  fine: Fine | null;
}

function DashboardVoteOutcome({
  fine,
  getFineData,
}: DashboardVoteOutcomeProps) {
  const [showVotingButtons, setShowVotingButtons] = useState(
    fine?.user_vote === null,
  );

  function handleVote(vote: "approve" | "deny") {
    if (fine) {
      if (fine.user_vote) {
        authenticatedPutRequest
          .authenticatedPutRequest(`/votes/${fine.user_vote.id}`, {
            fine_id: fine.id,
            vote,
          })
          .then(() => {
            getFineData();
            setShowVotingButtons(false);
          });
      } else {
        authenticatedPostRequest
          .authenticatedPostRequest("/votes", {
            fine_id: fine.id,
            vote,
          })
          .then(() => {
            getFineData();
            setShowVotingButtons(false);
          });
      }
    }
  }

  return (
    <>
      <div className="flex flex-row items-center justify-center space-x-4 p-3">
        {fine?.status === "open" ? (
          fine?.user_vote === null || showVotingButtons ? (
            <>
              <Button
                outline
                color={"green"}
                disabled={fine.user_vote?.vote === "approve"}
                className="flex-1"
                onClick={() => {
                  handleVote("approve");
                }}
              >
                Approve
              </Button>
              <Button
                outline
                color={"red"}
                disabled={fine.user_vote?.vote === "deny"}
                className="flex-1"
                onClick={() => {
                  handleVote("deny");
                }}
              >
                Deny
              </Button>
              {fine?.user_vote && (
                <Button
                  outline
                  color={"light"}
                  onClick={() => setShowVotingButtons(false)}
                >
                  Cancel
                </Button>
              )}
            </>
          ) : (
            <>
              <p className="flex-1 p-2 text-xl font-bold text-gray-500 dark:text-gray-200">
                You have voted:
              </p>
              <p className="flex-1 p-2 text-3xl font-bold text-gray-500 dark:text-gray-200">
                {capitalize(fine?.user_vote.vote)}
              </p>
              <Button
                outline
                color={"light"}
                className="flex-1"
                onClick={() => setShowVotingButtons(true)}
              >
                Change Vote
              </Button>
            </>
          )
        ) : (
          <p className="p-2 text-2xl font-bold text-gray-500 dark:text-gray-200">
            {capitalize(fine?.status)}
          </p>
        )}
      </div>
    </>
  );
}

export default DashboardVoteOutcome;
