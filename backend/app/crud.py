from fastapi import HTTPException
from sqlalchemy.orm import Session
from .models import Person, Fine, FineGroup, Vote
from . import schemas


# CRUD operations for Person
def get_persons(db: Session, skip: int = 0, limit: int = 10):
    return db.query(Person).offset(skip).limit(limit).all()


def get_person(db: Session, person_id: int):
    return db.query(Person).filter(Person.id == person_id).first()


def create_person(db: Session, person: schemas.PersonCreateSchema):
    db_person = Person(id=person.id, name=person.name, position=person.position)
    db.add(db_person)
    db.commit()
    db.refresh(db_person)
    return db_person


def update_person(db: Session, person_id: int, person: schemas.PersonUpdateSchema):
    db_person = db.query(Person).filter(Person.id == person_id).first()
    if db_person:
        update_data = person.model_dump(
            exclude_unset=True
        )  # Get only fields that are set
        for key, value in update_data.items():
            setattr(db_person, key, value)  # Dynamically update fields
        db.commit()
        db.refresh(db_person)
    return db_person


def delete_person(db: Session, person_id: int):
    db_person = db.query(Person).filter(Person.id == person_id).first()
    if db_person:
        db.delete(db_person)
        db.commit()
    return db_person


# CRUD operations for Fine
def get_fines(db: Session, skip: int = 0, limit: int = 10):
    return db.query(Fine).offset(skip).limit(limit).all()


def get_fine(db: Session, fine_id: int):
    return db.query(Fine).filter(Fine.id == fine_id).first()


def create_fine(db: Session, fine: schemas.FineCreateSchema):
    db_fine = Fine(
        amount=fine.amount, fine_type=fine.fine_type, description=fine.description
    )
    db.add(db_fine)
    db.commit()

    # Create a FineGroup for each person
    for person_id in fine.people:
        create_fine_group(
            db, schemas.FineGroupSchema(person_id=person_id, fine_id=db_fine.id)
        )

    db.refresh(db_fine)
    return db_fine


def update_fine(db: Session, fine_id: int, fine: schemas.FineUpdateSchema):
    db_fine = db.query(Fine).filter(Fine.id == fine_id).first()

    if db_fine:
        current_fine_status = db_fine.status

        # Update Status
        if fine.status:
            if fine.status == "new":
                raise HTTPException(
                    status_code=400, detail="A fine cannot be set to new once opened"
                )
            if fine.status == "open" and current_fine_status != "new":
                raise HTTPException(
                    status_code=400, detail="A fine must be new to be opened"
                )
            if current_fine_status in [
                schemas.StatusEnum.denied,
                schemas.StatusEnum.approved,
            ]:
                raise HTTPException(
                    status_code=400, detail="A fine cannot be updated once closed"
                )
            db_fine.status = fine.status

        if current_fine_status != "new":
            raise HTTPException(
                status_code=400, detail="A fine must be new to be updated"
            )

        update_data = fine.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_fine, key, value)

        db.commit()
        db.refresh(db_fine)
    return db_fine


def delete_fine(db: Session, fine_id: int):
    db_fine = db.query(Fine).filter(Fine.id == fine_id).first()
    if db_fine:
        db.delete(db_fine)
        db.commit()
    return db_fine


# CRUD operations for FineGroup
def get_fine_groups(db: Session, skip: int = 0, limit: int = 10):
    return db.query(FineGroup).offset(skip).limit(limit).all()


def create_fine_group(db: Session, fine_group: schemas.FineGroupSchema):
    db_fine_group = FineGroup(
        person_id=fine_group.person_id, fine_id=fine_group.fine_id
    )
    db.add(db_fine_group)
    db.commit()
    db.refresh(db_fine_group)
    return db_fine_group


def update_fine_group(
    db: Session, fine_group_id: int, fine_group: schemas.FineGroupSchema
):
    db_fine_group = db.query(FineGroup).filter(FineGroup.id == fine_group_id).first()
    if db_fine_group:
        db_fine_group.person_id = fine_group.person_id
        db_fine_group.fine_id = fine_group.fine_id
        db.commit()
        db.refresh(db_fine_group)
    return db_fine_group


def delete_fine_group(db: Session, fine_group_id: int):
    db_fine_group = db.query(FineGroup).filter(FineGroup.id == fine_group_id).first()
    if db_fine_group:
        db.delete(db_fine_group)
        db.commit()
    return db_fine_group


# CRUD operations for Vote
def get_votes(db: Session, fine_id: int):
    return db.query(Vote).filter(Vote.fine_id == fine_id).all()


def create_vote(db: Session, vote: schemas.VoteSchema):
    # Check fine status is open
    db_fine = db.query(Fine).filter(Fine.id == vote.fine_id).first()
    if db_fine.status != "open":
        raise HTTPException(
            status_code=400, detail="Votes can only be cast on open fines"
        )

    # Check if voter has already voted
    existing_vote = (
        db.query(Vote)
        .filter(Vote.fine_id == vote.fine_id, Vote.voter_id == vote.voter_id)
        .first()
    )
    if existing_vote:
        raise HTTPException(
            status_code=400, detail="Voter has already voted on this fine"
        )

    db_vote = Vote(
        voter_id=vote.voter_id,
        fine_id=vote.fine_id,
        vote=vote.vote,
    )
    db.add(db_vote)
    db.commit()
    db.refresh(db_vote)
    return db_vote


def update_vote(db: Session, vote_id: int, vote: schemas.VoteUpdateSchema):
    db_vote = db.query(Vote).filter(Vote.id == vote_id).first()

    # Check fine status is open
    db_fine = db.query(Fine).filter(Fine.id == db_vote.fine_id).first()
    if db_fine.status != "open":
        raise HTTPException(
            status_code=400, detail="Votes can only be cast on open fines"
        )

    if db_vote:
        db_vote.vote = vote.vote
        db.commit()
        db.refresh(db_vote)
    return db_vote


def delete_vote(db: Session, vote_id: int):
    db_vote = db.query(Vote).filter(Vote.id == vote_id).first()
    if db_vote:
        db.delete(db_vote)
        db.commit()
    return db_vote
