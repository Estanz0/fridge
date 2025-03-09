from pydantic import BaseModel, computed_field
from datetime import datetime
from enum import Enum
from typing import Optional

PersonID = str
FineTypeID = str
FineID = str
FineGroupID = str
VoteID = str


class StatusEnum(str, Enum):
    new = "new"
    open = "open"
    denied = "denied"
    approved = "approved"
    paid = "paid"


class FineFilterEnum(str, Enum):
    open = "open"
    denied = "denied"
    approved = "approved"
    paid = "paid"

    # Member filters
    my_created_fines = "my_created_fines"
    my_nominee_fines = "my_nominee_fines"
    my_voted_fines = "my_voted_fines"
    my_not_voted_fines = "my_not_voted_fines"


class PositionEnum(str, Enum):
    member = "member"
    council_member = "council member"
    president = "president"


class VoteEnum(str, Enum):
    approve = "approve"
    deny = "deny"


# Person Schemas
class PersonSchema(BaseModel):
    name: str
    position: PositionEnum


class PersonCreateSchema(BaseModel):
    name: str
    email: str
    password: str
    position: PositionEnum = PositionEnum.member


class PersonUpdateSchema(BaseModel):
    name: Optional[str] = None
    position: Optional[str] = None


class PersonResponseSchema(PersonSchema):
    id: PersonID


# Vote Schemas
class VoteSchema(BaseModel):
    fine_id: FineID
    vote: VoteEnum


class VoteUpdateSchema(VoteSchema): ...


class VoteCreateSchema(VoteSchema): ...


class VoteResponseSchema(VoteSchema):
    id: VoteID
    created_at: datetime
    updated_at: datetime
    voter: PersonResponseSchema


# FineType Schemas
class FineTypeSchema(BaseModel):
    name: str
    description: str


class FineTypeCreateSchema(FineTypeSchema): ...


class FineTypeUpdateSchema(FineTypeSchema):
    id: FineTypeID


class FineTypeResponseSchema(FineTypeSchema):
    id: FineTypeID


# Fine Schemas
class FineSchema(BaseModel):
    amount: int
    title: str
    description: str


class FineCreateSchema(FineSchema):
    fine_type_id: FineTypeID
    people: list[PersonID] = []


class FineUpdateSchema(BaseModel):
    amount: Optional[int] = None
    fine_type_id: Optional[FineTypeID] = None
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[StatusEnum] = None


class FineResponseSchema(FineSchema):
    id: FineID
    created_at: datetime
    closes_at: datetime
    status: StatusEnum
    creator: PersonResponseSchema
    fine_type: FineTypeResponseSchema
    people: list[PersonResponseSchema] = []
    votes: list[VoteResponseSchema] = []
    user_vote: Optional[VoteResponseSchema | None] = None

    @computed_field(alias="vote_count")
    @property
    def vote_count(self) -> dict:
        approve_count = sum(1 for vote in self.votes if vote.vote == VoteEnum.approve)
        deny_count = sum(1 for vote in self.votes if vote.vote == VoteEnum.deny)
        return {"approve": approve_count, "deny": deny_count}


# FineGroup Schemas
class FineGroupSchema(BaseModel):
    person_id: PersonID
    fine_id: FineID


class FineGroupResponseSchema(FineGroupSchema):
    id: FineGroupID
