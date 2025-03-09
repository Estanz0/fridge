enum FineStatus {
  NEW = "new",
  OPEN = "open",
  DENIED = "denied",
  APPROVED = "approved",
  PAID = "paid",
}

enum FineFilter {
  OPEN = "open",
  DENIED = "denied",
  APPROVED = "approved",
  PAID = "paid",

  // Member filters
  MY_CREATED_FINES = "my_created_fines",
  MY_NOMINEE_FINES = "my_nominee_fines",
  MY_VOTED_FINES = "my_voted_fines",
  MY_NOT_VOTED_FINES = "my_not_voted_fines",
}

interface Person {
  id: number;
  name: string;
  position: string;
}

interface Vote {
  id: number;
  voter: Person;
  fine_id: number;
  vote: string;
  created_at: string;
  updated_at: string;
}

interface VoteCount {
  approve: number;
  deny: number;
}

interface FineType {
  id: string;
  name: string;
  description: string;
}

interface Fine {
  amount: number;
  fine_type: FineType;
  title: string;
  description: string;
  id: string;
  created_at: string;
  closes_at: string;
  creator: Person;
  status: FineStatus;
  people: Person[];
  votes: Vote[];
  vote_count: VoteCount;
  user_vote: Vote | null;
}

export type { Person, Vote, Fine, FineStatus, FineType };
export { FineFilter };
