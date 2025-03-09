from sqlalchemy import create_engine
from sqlalchemy.sql import text
from sqlalchemy.orm import sessionmaker
import os
import pandas as pd

tables = [
    "persons",
    "fines",
    "fine_groups",
    "votes",
    "fine_types",
]

# Create a connection to the database
engine = create_engine(
    "postgresql://fridge_user:fridge_password@0.0.0.0:5432/fridge_db"
)
Session = sessionmaker(bind=engine)
session = Session()

# Get all files in the data folder
data_dir = "dummy_data"
files = os.listdir(data_dir)

# Iterate over all files
for file in files:
    table_name = file.split(".")[0]

    # Drop the table if it already exists
    with engine.begin() as connection:  # Ensures commit
        print(f"Dropping table: {table_name}")
        connection.execute(text(f"DROP TABLE IF EXISTS {table_name} CASCADE;"))

    df = pd.read_csv(f"{data_dir}/{file}")
    df.columns = [c.lower() for c in df.columns]

    if table_name not in tables:
        print(f"Skipping {table_name}...")
        continue
    try:
        df.to_sql(table_name, engine, if_exists="replace", index=False)
        print(f"Table {table_name} created successfully.")
    except Exception as e:
        print(f"Error creating table: {table_name}")
        print(e)

session.close()
