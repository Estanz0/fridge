from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .database import get_db

from . import schemas
from .crud import (
    get_persons,
    get_person,
    create_person,
    update_person,
    delete_person,
    get_fines,
    get_fine,
    create_fine,
    update_fine,
    delete_fine,
    get_fine_groups,
    create_fine_group,
    update_fine_group,
    delete_fine_group,
    get_votes,
    create_vote,
    update_vote,
    delete_vote,
)
from .appwrite_auth import get_user_id

router = APIRouter()


# Person routes
@router.get("/persons", response_model=List[schemas.PersonResponseSchema])
def read_persons(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    user_id: schemas.PersonID = Depends(get_user_id),
):
    persons = get_persons(db, skip=skip, limit=limit)
    return persons


@router.get("/persons/{person_id}", response_model=schemas.PersonResponseSchema)
def read_person(
    person_id: schemas.PersonID,
    db: Session = Depends(get_db),
    user_id: schemas.PersonID = Depends(get_user_id),
):
    person = get_person(db, person_id)
    if person is None:
        raise HTTPException(status_code=404, detail="Person not found")
    return person


@router.post(
    "/persons",
    response_model=schemas.PersonResponseSchema,
    status_code=status.HTTP_201_CREATED,
)
def create_person_route(
    person: schemas.PersonCreateSchema,
    db: Session = Depends(get_db),
    user_id: schemas.PersonID = Depends(get_user_id),
):
    return create_person(db, person)


@router.put("/persons/{person_id}", response_model=schemas.PersonResponseSchema)
def update_person_route(
    person_id: schemas.PersonID,
    person: schemas.PersonUpdateSchema,
    db: Session = Depends(get_db),
    user_id: schemas.PersonID = Depends(get_user_id),
):
    db_person = update_person(db, person_id, person)
    if db_person is None:
        raise HTTPException(status_code=404, detail="Person not found")
    return db_person


@router.delete(
    "/persons/{person_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_person_route(
    person_id: int,
    db: Session = Depends(get_db),
    user_id: schemas.PersonID = Depends(get_user_id),
):
    db_person = delete_person(db, person_id)
    if db_person is None:
        raise HTTPException(status_code=404, detail="Person not found")
    return {}


# Fine routes
@router.get("/fines", response_model=List[schemas.FineResponseSchema])
def read_fines(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    user_id: schemas.PersonID = Depends(get_user_id),
):
    fines = get_fines(db, skip=skip, limit=limit)
    return fines


@router.get("/fines/{fine_id}", response_model=schemas.FineResponseSchema)
def read_fine(
    fine_id: int,
    db: Session = Depends(get_db),
    user_id: schemas.PersonID = Depends(get_user_id),
):
    fine = get_fine(db, fine_id)
    if fine is None:
        raise HTTPException(status_code=404, detail="Fine not found")
    return fine


@router.post(
    "/fines",
    response_model=schemas.FineResponseSchema,
    status_code=status.HTTP_201_CREATED,
)
def create_fine_route(
    fine: schemas.FineCreateSchema,
    db: Session = Depends(get_db),
    user_id: schemas.PersonID = Depends(get_user_id),
):
    return create_fine(db, fine)


@router.put("/fines/{fine_id}", response_model=schemas.FineResponseSchema)
def update_fine_route(
    fine_id: int,
    fine: schemas.FineUpdateSchema,
    db: Session = Depends(get_db),
    user_id: schemas.PersonID = Depends(get_user_id),
):
    db_fine = update_fine(db, fine_id, fine)
    if db_fine is None:
        raise HTTPException(status_code=404, detail="Fine not found")
    return db_fine


@router.delete("/fines/{fine_id}", response_model=schemas.FineResponseSchema)
def delete_fine_route(
    fine_id: int,
    db: Session = Depends(get_db),
    user_id: schemas.PersonID = Depends(get_user_id),
):
    db_fine = delete_fine(db, fine_id)
    if db_fine is None:
        raise HTTPException(status_code=404, detail="Fine not found")
    return db_fine


# FineGroup routes
@router.get("/fine-groups", response_model=List[schemas.FineGroupResponseSchema])
def read_fine_groups(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    user_id: schemas.PersonID = Depends(get_user_id),
):
    fine_groups = get_fine_groups(db, skip=skip, limit=limit)
    return fine_groups


@router.post(
    "/fine-groups",
    response_model=schemas.FineGroupResponseSchema,
    status_code=status.HTTP_201_CREATED,
)
def create_fine_group_route(
    fine_group: schemas.FineGroupSchema,
    db: Session = Depends(get_db),
    user_id: schemas.PersonID = Depends(get_user_id),
):
    return create_fine_group(db, fine_group)


@router.put(
    "/fine-groups/{fine_group_id}", response_model=schemas.FineGroupResponseSchema
)
def update_fine_group_route(
    fine_group_id: int,
    fine_group: schemas.FineGroupSchema,
    db: Session = Depends(get_db),
    user_id: schemas.PersonID = Depends(get_user_id),
):
    db_fine_group = update_fine_group(db, fine_group_id, fine_group)
    if db_fine_group is None:
        raise HTTPException(status_code=404, detail="FineGroup not found")
    return db_fine_group


@router.delete(
    "/fine-groups/{fine_group_id}", response_model=schemas.FineGroupResponseSchema
)
def delete_fine_group_route(
    fine_group_id: int,
    db: Session = Depends(get_db),
    user_id: schemas.PersonID = Depends(get_user_id),
):
    db_fine_group = delete_fine_group(db, fine_group_id)
    if db_fine_group is None:
        raise HTTPException(status_code=404, detail="FineGroup not found")
    return db_fine_group


# Vote routes
@router.get("/votes/{fine_id}", response_model=List[schemas.VoteResponseSchema])
def read_votes(
    fine_id: int,
    db: Session = Depends(get_db),
    user_id: schemas.PersonID = Depends(get_user_id),
):
    votes = get_votes(db, fine_id)
    return votes


@router.post(
    "/votes",
    response_model=schemas.VoteResponseSchema,
    status_code=status.HTTP_201_CREATED,
)
def create_vote_route(
    vote: schemas.VoteSchema,
    db: Session = Depends(get_db),
    user_id: schemas.PersonID = Depends(get_user_id),
):
    return create_vote(db, vote)


@router.put("/votes/{vote_id}", response_model=schemas.VoteResponseSchema)
def update_vote_route(
    vote_id: int,
    vote: schemas.VoteUpdateSchema,
    db: Session = Depends(get_db),
    user_id: schemas.PersonID = Depends(get_user_id),
):
    db_vote = update_vote(db, vote_id, vote)
    if db_vote is None:
        raise HTTPException(status_code=404, detail="Vote not found")
    return db_vote


@router.delete("/votes/{vote_id}", response_model=schemas.VoteResponseSchema)
def delete_vote_route(
    vote_id: int,
    db: Session = Depends(get_db),
    user_id: schemas.PersonID = Depends(get_user_id),
):
    db_vote = delete_vote(db, vote_id)
    if db_vote is None:
        raise HTTPException(status_code=404, detail="Vote not found")
    return db_vote
