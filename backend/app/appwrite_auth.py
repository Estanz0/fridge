from appwrite.client import Client
from appwrite.services.users import Users
import jwt
from .config import settings

client = Client()
client.set_endpoint(settings.APPWRITE_ENDPOINT)
client.set_project(settings.APPWRITE_PROJECT_ID)
client.set_key(settings.APPWRITE_API_KEY)

users = Users(client)


def decode_token(token: str) -> dict:
    return jwt.decode(token, options={"verify_signature": False}, algorithms=["HS256"])


def get_user_id(token: str) -> str:
    validate_token(token)
    return decode_token(token)["userId"]


def get_user(token: str) -> dict:
    return client.users.get_user(get_user_id(token)).json()


def validate_token(token: str) -> bool:
    try:
        decoded_token = decode_token(token)
        session_id = decoded_token["sessionId"]
        user_id = decoded_token["userId"]

        active_sessions = users.list_sessions(user_id=user_id).json()["sessions"]
        for session in active_sessions:
            if session["id"] == session_id:
                return True

        return False
    except jwt.ExpiredSignatureError:
        return False
    except jwt.InvalidTokenError:
        return False
    except Exception:
        return False
