from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum as SQLAEnum
from sqlalchemy.orm import relationship
from sqlalchemy.ext.associationproxy import association_proxy
import datetime as dt
import uuid
from datetime import datetime, timedelta, timezone
from . import schemas
from .database import Base
from zoneinfo import ZoneInfo


def generate_uuid():
    return str(uuid.uuid4())


def get_next_closing_date():
    # Define the Auckland and UTC timezones
    auckland_tz = ZoneInfo("Pacific/Auckland")
    utc_tz = timezone.utc

    # Get current time in Auckland timezone
    now = datetime.now(auckland_tz)

    # Calculate the next possible Friday (weekday 4)
    days_until_friday = (4 - now.weekday()) % 7  # 4 represents Friday
    if days_until_friday < 3:
        days_until_friday += 7  # Ensure it's at least 3 days from today

    # Set closing time to next Friday at 3:00 PM (15:00) in Auckland time
    closing_date = now + timedelta(days=days_until_friday)
    closing_date = closing_date.replace(
        hour=15, minute=0, second=0, microsecond=0, tzinfo=auckland_tz
    )

    # Convert to UTC before returning
    closing_date_utc = closing_date.astimezone(utc_tz)

    return closing_date_utc.isoformat()


class Person(Base):
    __tablename__ = "persons"
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String)
    email = Column(String)
    position = Column(String)
    auth_user_id = Column(String)

    # Relationship to FineGroup
    fine_groups = relationship("FineGroup", back_populates="person")

    # Relationship to Fine
    created_fines = relationship("Fine", back_populates="creator")

    # Relationship to Vote
    votes = relationship("Vote", back_populates="voter")

    # Proxy to access fines directly
    fines = association_proxy("fine_groups", "fine")


class FineType(Base):
    __tablename__ = "fine_types"
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String)
    description = Column(String)

    # Relationship to Fine
    fines = relationship("Fine", back_populates="fine_type")


class Fine(Base):
    __tablename__ = "fines"
    id = Column(String, primary_key=True, default=generate_uuid)
    status = Column(SQLAEnum(schemas.StatusEnum), default=schemas.StatusEnum.open)
    amount = Column(Integer)
    title = Column(String)
    description = Column(String)
    fine_type_id = Column(String, ForeignKey("fine_types.id"))
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: dt.datetime.now(dt.timezone.utc).isoformat(),
    )
    closes_at = Column(DateTime(timezone=True), default=get_next_closing_date)
    creator_id = Column(String, ForeignKey("persons.id"))

    # Relationship to FineGroup
    fine_groups = relationship("FineGroup", back_populates="fine")

    # Relationship to FineType
    fine_type = relationship("FineType", back_populates="fines")

    # Proxy to get people associated with this fine
    people = association_proxy("fine_groups", "person")

    # Relationship to Vote
    votes = relationship("Vote", back_populates="fine")

    # Relationship to Person
    creator = relationship("Person", back_populates="created_fines")


class FineGroup(Base):
    __tablename__ = "fine_groups"
    id = Column(String, primary_key=True, default=generate_uuid)
    person_id = Column(String, ForeignKey("persons.id"))
    fine_id = Column(String, ForeignKey("fines.id"))

    # Relationships
    person = relationship("Person", back_populates="fine_groups")
    fine = relationship("Fine", back_populates="fine_groups")


class Vote(Base):
    __tablename__ = "votes"
    id = Column(String, primary_key=True, default=generate_uuid)
    voter_id = Column(String, ForeignKey("persons.id"))
    fine_id = Column(String, ForeignKey("fines.id"))
    vote = Column(String)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: dt.datetime.now(dt.timezone.utc).isoformat(),
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: dt.datetime.now(dt.timezone.utc).isoformat(),
        onupdate=lambda: dt.datetime.now(dt.timezone.utc).isoformat(),
    )

    # Relationship to Fine
    fine = relationship("Fine", back_populates="votes")

    # Relationship to Person
    voter = relationship("Person", back_populates="votes")
