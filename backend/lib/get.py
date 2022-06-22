import boto3
import os
import json
from datetime import datetime

ddb = boto3.client("dynamodb", region_name=os.environ["AWS_REGION"])
table_name = os.environ["DYNAMODB_TABLE_NAME"]


def get():
    return json.dumps({"points": _get_points(), "tasks": _get_tasks()})


def _get_points():
    """Get serialized points list."""
    result = ddb.query(
        TableName=table_name,
        KeyConditionExpression="PK = :pk",
        ExpressionAttributeValues={":pk": {"S": "POINTS"}},
    )["Items"]
    points = {}
    for item in result:
        points[item["SK"]["S"]] = int(item["points"]["N"])
    return points


def _get_tasks():
    """Get serialized tasks list."""
    result = ddb.query(
        TableName=table_name,
        KeyConditionExpression="PK = :pk",
        ExpressionAttributeValues={":pk": {"S": "TASKS"}},
    )["Items"]
    tasks = []
    for item in result:
        if "disabled_until" in item:
            if item["disabled_until"]["S"] > datetime.now().strftime("%Y%m%d%H%M"):
                continue
            del item["disabled_until"]
            ddb.put_item(TableName=table_name, Item=item)
        tasks.append(
            {
                "name": item["name"]["S"],
                "points": item["points"]["N"],
                "bruno": item["bruno"]["S"],
                "dante": item["dante"]["S"],
            }
        )
    return tasks
