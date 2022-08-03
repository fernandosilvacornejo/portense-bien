from lib.tasks import get, post, reset
import os


def handler(event, context):
    """Funcion principal."""
    data = ""
    try:
        path = event["path"]
        if path == "/data":
            data = get()
        elif path == "/event":
            data = post(event["body"])
        elif path == "/reset":
            data = reset()
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
