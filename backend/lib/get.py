import boto3
import os
import json
from datetime import datetime

ddb = boto3.client("dynamodb", region_name=os.environ["AWS_REGION"])
table_name = os.environ["DYNAMODB_TABLE_NAME"]


def get():
    return json.dumps({"profiles": _get_profiles(), "tasks": _get_tasks()})


def _get_profiles():
    """Get serialized points list."""
    result = ddb.query(
        TableName=table_name,
        KeyConditionExpression="PK = :pk",
        ExpressionAttributeValues={":pk": {"S": "PROFILE"}},
    )["Items"]
    profiles = {"bruno": {}, "dante": {}}
    for item in result:
        profile, item_type = item["SK"]["S"].split("#")
        if profile not in profiles.keys():
            profiles[profile] = {}
        if item_type == "points":
            profiles[profile]["points"] = int(item["points"]["N"])
        elif item_type == "prize":
            prize = {"name": item["name"]["S"], "points": int(item["points"]["N"])}
            profiles[profile]["prize"] = prize
    return profiles


def _get_tasks():
    """Get serialized tasks list."""
    result = ddb.query(
        TableName=table_name,
        KeyConditionExpression="PK = :pk",
        ExpressionAttributeValues={":pk": {"S": "TASKS"}},
    )["Items"]
    tasks = {"bruno": [], "dante": []}
    for item in result:
        if "disabled_until" in item:
            if item["disabled_until"]["S"] > datetime.now().strftime("%Y%m%d%H%M"):
                continue
            del item["disabled_until"]
            for profile in ["bruno", "dante"]:
                item[profile]["S"] = (
                    "True" if item[profile]["S"] == "disabled" else item[profile]["S"]
                )
            ddb.put_item(TableName=table_name, Item=item)
        for profile in ["bruno", "dante"]:
            if item[profile]["S"] == "True":
                tasks[profile].append(
                    {"name": item["name"]["S"], "points": item["points"]["N"]}
                )
    return tasks
