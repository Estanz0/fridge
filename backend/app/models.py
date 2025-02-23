from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum as SQLAEnum
from sqlalchemy.orm import relationship
from sqlalchemy.ext.associationproxy import association_proxy
import datetime as dt

from .schemas import StatusEnum, FineTypeEnum
from .database import Base


class Person(Base):
    __tablename__ = "persons"
    id = Column(String, primary_key=True)
    name = Column(String)
    position = Column(String)

    # Relationship to FineGroup
    fine_groups = relationship("FineGroup", back_populates="person")

    # Proxy to access fines directly
    fines = association_proxy("fine_groups", "fine")


class Fine(Base):
    __tablename__ = "fines"
    id = Column(Integer, primary_key=True, index=True)
    status = Column(SQLAEnum(StatusEnum), default=StatusEnum.new)
    amount = Column(Integer)
    description = Column(String)
    fine_type = Column(SQLAEnum(FineTypeEnum), default=FineTypeEnum.beer_bottle)
    created_at = Column(DateTime, default=dt.datetime.now(dt.UTC))

    # Relationship to FineGroup
    fine_groups = relationship("FineGroup", back_populates="fine")

    # Proxy to get people associated with this fine
    people = association_proxy("fine_groups", "person")


class FineGroup(Base):
    __tablename__ = "fine_groups"
    id = Column(Integer, primary_key=True, index=True)
    person_id = Column(String, ForeignKey("persons.id"))
    fine_id = Column(Integer, ForeignKey("fines.id"))

    # Relationships
    person = relationship("Person", back_populates="fine_groups")
    fine = relationship("Fine", back_populates="fine_groups")


class Vote(Base):
    __tablename__ = "votes"
    id = Column(Integer, primary_key=True, index=True)
    voter_id = Column(String, ForeignKey("persons.id"))
    fine_id = Column(Integer, ForeignKey("fines.id"))
    vote = Column(String)
    timestamp = Column(DateTime, default=dt.datetime.now(dt.UTC))
