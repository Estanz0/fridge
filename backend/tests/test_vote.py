from app.models import Person, Fine, FineGroup, Vote


def seed_database(db_session):
    """Create records before each test and delete them after."""
    # Create records
    persons_data = [
        {"name": "Person One", "position": "Original Position"},
        {"name": "Person Two", "position": "Original Position"},
        {"name": "Person Three", "position": "Original Position"},
    ]

    for person_data in persons_data:
        person = Person(**person_data)
        db_session.add(person)
        db_session.commit()

    # Fines data
    fines_data = [
        {
            "amount": 100,
            "fine_type": "beer_bottle",
            "description": "desc",
            "status": "new",
        },
        {
            "amount": 200,
            "fine_type": "beer_bottle",
            "description": "desc",
            "status": "open",
        },
        {
            "amount": 200,
            "fine_type": "beer_bottle",
            "description": "desc",
            "status": "approved",
        },
    ]

    for fine_data in fines_data:
        fine = Fine(**fine_data)
        db_session.add(fine)
        db_session.commit()

    # Fine groups data
    fine_groups_data = [
        {"person_id": 1, "fine_id": 1},
        {"person_id": 2, "fine_id": 1},
        {"person_id": 1, "fine_id": 2},
    ]

    for fine_group_data in fine_groups_data:
        fine_group = FineGroup(**fine_group_data)
        db_session.add(fine_group)
        db_session.commit()

    # Votes data
    votes_data = [
        {"voter_id": 1, "fine_id": 2, "vote": "yes"},
        {"voter_id": 2, "fine_id": 2, "vote": "no"},
        {"voter_id": 2, "fine_id": 3, "vote": "no"},
    ]

    for vote_data in votes_data:
        vote = Vote(**vote_data)
        db_session.add(vote)
        db_session.commit()


def test_get_votes(test_client, db_session):
    seed_database(db_session)

    # Get the votes
    fine_id = 2
    response = test_client.get(f"/votes/{fine_id}")
    assert response.status_code == 200
    votes = response.json()
    assert len(votes) == 2
    assert votes[0]["voter_id"] == 1
    assert votes[0]["fine_id"] == fine_id
    assert votes[0]["vote"] == "yes"
    assert votes[1]["voter_id"] == 2
    assert votes[1]["fine_id"] == fine_id
    assert votes[1]["vote"] == "no"


def test_create_vote_success(test_client, db_session):
    seed_database(db_session)

    # Create a vote
    response = test_client.post(
        "/votes/", json={"voter_id": 3, "fine_id": 2, "vote": "yes"}
    )
    assert response.status_code == 201
    vote = response.json()
    assert vote["voter_id"] == 3
    assert vote["fine_id"] == 2
    assert vote["vote"] == "yes"


def test_create_vote_fail(test_client, db_session):
    seed_database(db_session)

    # Create a vote on a fine that is not open
    response = test_client.post(
        "/votes/", json={"voter_id": 1, "fine_id": 1, "vote": "yes"}
    )
    assert response.status_code == 400
    assert response.json() == {"detail": "Votes can only be cast on open fines"}

    # Create second vote on the same fine
    response = test_client.post(
        "/votes/", json={"voter_id": 1, "fine_id": 2, "vote": "yes"}
    )
    assert response.status_code == 400
    assert response.json() == {"detail": "Voter has already voted on this fine"}


def update_vote_success(test_client, db_session):
    seed_database(db_session)

    # Update the vote
    vote_id = 1
    response = test_client.put(f"/votes/{vote_id}", json={"vote": "no"})
    assert response.status_code == 200
    vote = response.json()
    assert vote["voter_id"] == 1
    assert vote["fine_id"] == 2
    assert vote["vote"] == "no"


def test_update_vote_fail(test_client, db_session):
    seed_database(db_session)

    # Update the vote after the voting has closed
    vote_id = 3
    response = test_client.put(f"/votes/{vote_id}", json={"vote": "no"})
    assert response.status_code == 400
    assert response.json() == {"detail": "Votes can only be cast on open fines"}
