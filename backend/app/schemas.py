from pydantic import BaseModel
from datetime import datetime
from enum import Enum
from typing import Optional

PersonID = str


class StatusEnum(str, Enum):
    new = "new"
    open = "open"
    denied = "denied"
    approved = "approved"


class FineTypeEnum(str, Enum):
    beer_bottle = "beer_bottle"
    wine_bottle = "wine_bottle"


# Person Schemas
class PersonSchema(BaseModel):
    name: str
    position: str


class PersonCreateSchema(PersonSchema):
    id: PersonID


class PersonUpdateSchema(BaseModel):
    name: Optional[str] = None
    position: Optional[str] = None


class PersonResponseSchema(PersonSchema):
    id: PersonID


# Vote Schemas
class VoteSchema(BaseModel):
    voter_id: int
    fine_id: int
    vote: str


class VoteUpdateSchema(BaseModel):
    vote: str = None


class VoteResponseSchema(VoteSchema):
    id: int
    timestamp: datetime


# Fine Schemas
class FineSchema(BaseModel):
    amount: int
    fine_type: FineTypeEnum
    description: str


class FineCreateSchema(FineSchema):
    people: list[int] = []


class FineUpdateSchema(BaseModel):
    amount: Optional[int] = None
    fine_type: Optional[FineTypeEnum] = None
    description: Optional[str] = None
    status: Optional[StatusEnum] = None


class FineResponseSchema(FineSchema):
    id: int
    created_at: datetime
    status: StatusEnum
    people: list[PersonResponseSchema] = []
    votes: list[VoteResponseSchema] = []


# FineGroup Schemas
class FineGroupSchema(BaseModel):
    person_id: int
    fine_id: int


class FineGroupResponseSchema(FineGroupSchema):
    id: int
