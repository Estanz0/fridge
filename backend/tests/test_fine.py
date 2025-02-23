from app.models import Person, Fine, FineGroup


def seed_database(db_session):
    """Create records before each test and delete them after."""
    # Create records
    persons_data = [
        {"name": "Person One", "position": "Original Position"},
        {"name": "Person Two", "position": "Original Position"},
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


def test_get_fines(test_client, db_session):
    seed_database(db_session)

    # Get all fines
    response = test_client.get("/fines/")
    assert response.status_code == 200
    fines = response.json()
    assert len(fines) == 3
    assert fines[0]["amount"] == 100
    assert fines[0]["fine_type"] == "beer_bottle"
    assert fines[0]["status"] == "new"
    assert len(fines[0]["people"]) == 2
    assert fines[0]["people"][0]["name"] == "Person One"
    assert fines[0]["people"][1]["name"] == "Person Two"
    assert fines[1]["amount"] == 200
    assert fines[1]["fine_type"] == "beer_bottle"
    assert fines[1]["status"] == "open"
    assert len(fines[1]["people"]) == 1
    assert fines[1]["people"][0]["name"] == "Person One"


def test_get_fine(test_client, db_session):
    seed_database(db_session)

    # Get the fine
    response = test_client.get("/fines/1")
    assert response.status_code == 200
    fine = response.json()
    assert fine["amount"] == 100
    assert fine["fine_type"] == "beer_bottle"
    assert fine["status"] == "new"
    assert len(fine["people"]) == 2
    assert fine["people"][0]["name"] == "Person One"
    assert fine["people"][1]["name"] == "Person Two"


def test_create_fine(test_client, db_session):
    seed_database(db_session)

    response = test_client.post(
        "/fines/",
        json={
            "amount": 300,
            "fine_type": "beer_bottle",
            "description": "desc",
            "people": [1, 2],
        },
    )
    created_fine = response.json()
    assert response.status_code == 201

    # Get the created fine
    response = test_client.get(f"/fines/{created_fine['id']}")

    assert response.status_code == 200
    response_json = response.json()
    assert response_json["id"] == created_fine["id"]
    assert response_json["amount"] == 300
    assert response_json["fine_type"] == "beer_bottle"
    assert response_json["description"] == "desc"
    assert response_json["status"] == "new"
    assert response_json["created_at"] == created_fine["created_at"]
    assert len(response_json["people"]) == 2
    assert response_json["people"][0]["name"] == "Person One"
    assert response_json["people"][1]["name"] == "Person Two"
    assert len(response_json["votes"]) == 0


def test_update_fine_new(test_client, db_session):
    seed_database(db_session)

    # Update the fine
    response = test_client.put(
        "/fines/1",
        json={"status": "open"},
    )
    assert response.status_code == 200
    updated_fine = response.json()
    assert updated_fine["amount"] == 100
    assert updated_fine["fine_type"] == "beer_bottle"
    assert updated_fine["status"] == "open"


def test_update_fine_open(test_client, db_session):
    seed_database(db_session)

    # Update the fine
    response = test_client.put(
        "/fines/2",
        json={"amount": 100},
    )
    assert response.status_code == 400
    updated_fine = response.json()
    assert updated_fine["detail"] == "A fine must be new to be updated"
