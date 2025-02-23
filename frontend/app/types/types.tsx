interface Person {
  id: number;
  name: string;
  position: string;
}

interface Vote {
  id: number;
  voter_id: number;
  fine_id: number;
  vote: string;
  timestamp: string;
}

enum FineStatus {
  NEW = "new",
  OPEN = "open",
  DENIED = "denied",
  APPROVED = "approved",
}

const FineTypeValues = {
  BEER_BOTTLE: "beer_bottle",
  WINE_BOTTLE: "wine_bottle",
} as const;
type FineType = (typeof FineTypeValues)[keyof typeof FineTypeValues];

interface Fine {
  amount: number;
  fine_type: FineType;
  description: string;
  id: string;
  created_at: string;
  status: FineStatus;
  people: Person[];
  votes: Vote[];
}

export type { Person, Vote, Fine, FineStatus, FineType };
export { FineTypeValues };
