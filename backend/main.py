from lib.get import get
from lib.post import post
import os


def handler(event, context):
    """Funcion principal."""
    data = ""
    try:
        method = event["httpMethod"]
        if method == "GET":
            data = get()
        elif method == "POST":
            data = post(event["body"])
    except Exception as e:
        if os.environ.get("ENVIRONMENT") == "test":
            raise
        data = "Error de ejecución"
        print(e)

    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "isBase64Encoded": False,
        "body": data,
    }
