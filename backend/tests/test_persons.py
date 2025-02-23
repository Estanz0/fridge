from app.models import Person


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


def test_get_persons(test_client, db_session):
    seed_database(db_session)

    # Get all persons
    response = test_client.get("/persons/")
    assert response.status_code == 200
    persons = response.json()
    assert len(persons) == 2
    assert persons[0]["name"] == "Person One"
    assert persons[0]["position"] == "Original Position"
    assert persons[1]["name"] == "Person Two"
    assert persons[1]["position"] == "Original Position"


def test_get_person(test_client, db_session):
    seed_database(db_session)

    # Get the person
    response = test_client.get("/persons/1")
    assert response.status_code == 200
    person = response.json()
    assert person["name"] == "Person One"
    assert person["position"] == "Original Position"


def test_create_get_person(test_client):
    response = test_client.post(
        "/persons/", json={"id": 3, "name": "John Doe", "position": "Software Engineer"}
    )
    created_person = response.json()
    assert response.status_code == 201

    # Get the created user
    response = test_client.get(f"/persons/{created_person['id']}")
    assert response.status_code == 200
    response_json = response.json()
    assert response_json["id"] == response_json["id"]
    assert response_json["name"] == "John Doe"
    assert response_json["position"] == "Software Engineer"


def test_update_person(test_client, db_session):
    seed_database(db_session)

    # Update the person
    response = test_client.put(
        "/persons/1",
        json={"position": "Updated Position"},
    )
    assert response.status_code == 200
    updated_person = response.json()
    assert updated_person["name"] == "Person One"
    assert updated_person["position"] == "Updated Position"


def test_delete_person(test_client, db_session):
    seed_database(db_session)

    # Delete the person
    response = test_client.delete("/persons/1")
    assert response.status_code == 204

    # Get the deleted person
    response = test_client.get("/persons/1")
    assert response.status_code == 404
    response_json = response.json()
    assert response_json["detail"] == "Person not found"
