from appwrite.client import Client
from appwrite.query import Query
from appwrite.services.users import Users
from appwrite.services.account import Account
import jwt
from .config import settings
from appwrite.id import ID
import logging

client = Client()
client.set_endpoint(settings.APPWRITE_ENDPOINT)
client.set_project(settings.APPWRITE_PROJECT_ID)
client.set_key(settings.APPWRITE_API_KEY)

users = Users(client)
accounts = Account(client)

logger = logging.getLogger(__name__)


def get_token(email: str, password: str) -> str:
    session = accounts.create_email_password_session(email=email, password=password)
    return users.create_jwt(user_id=session["userId"], session_id=session["$id"])


def decode_token(token: str) -> dict:
    token_dict = jwt.decode(
        token, options={"verify_signature": False}, algorithms=["HS256"]
    )

    return token_dict


def get_user_id(token: str) -> str:
    if not validate_token(token):
        return None

    decoded_token = decode_token(token)
    return decoded_token["userId"]


def get_user(user_id: str) -> dict:
    return users.get(user_id)


def get_user_by_email(email: str) -> dict:
    return users.list(queries=[Query.equal("email", [email])])["users"][0]


def validate_token(token: str) -> bool:
    try:
        decoded_token = decode_token(token)
        session_id = decoded_token["sessionId"]
        user_id = decoded_token["userId"]

        active_sessions = users.list_sessions(user_id=user_id)["sessions"]
        for session in active_sessions:
            if session["$id"] == session_id:
                return True

        return False
    except jwt.ExpiredSignatureError:
        logger.error("Token expired")
        return False
    except jwt.InvalidTokenError:
        logger.error("Invalid token")
        return False
    except Exception as e:
        logger.error(f"Error: {e}")
        return False


def create_new_account(email: str, password: str, name: str) -> dict:
    # Create new account
    return accounts.create(
        user_id=ID.unique(), email=email, password=password, name=name
    )
