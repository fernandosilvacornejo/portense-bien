import boto3
import os
import json
from datetime import datetime, timedelta

ddb = boto3.client("dynamodb", region_name=os.environ["AWS_REGION"])
table_name = os.environ["DYNAMODB_TABLE_NAME"]


def post(data):
    data = json.loads(data)
    profile = data["profile"]
    new_points = data["points"]
    task_name = data["task"]

    _log_event(profile, task_name, new_points)
    _disable_task(task_name)
    updated_points = _calculate_new_profile_points(profile, new_points)
    _update_points(profile, updated_points)

    return updated_points


def _log_event(profile, task_name, new_points):
    """Store event log."""
    ddb.put_item(
        TableName=table_name,
        Item={
            "PK": {"S": f"EVENT#{profile}"},
            "SK": {"S": datetime.now().strftime("%Y%m%d%H%M")},
            "name": {"S": task_name},
            "points": {"N": new_points},
        },
    )


def _disable_task(task_name):
    """Temporarily disable task."""
    task = ddb.query(
        TableName=table_name,
        FilterExpression="#name = :tn",
        KeyConditionExpression="PK = :pk",
        ExpressionAttributeValues={":pk": {"S": "TASKS"}, ":tn": {"S": task_name}},
        ExpressionAttributeNames={"#name": "name"},
    )["Items"][0]
    disabled_until = (datetime.today() + timedelta(hours=19)).strftime("%Y%m%d0600")
    task["disabled_until"] = {"S": disabled_until}
    ddb.put_item(TableName=table_name, Item=task)


def _calculate_new_profile_points(profile, new_points):
    """Calculate new total points for profile."""
    current_points = ddb.query(
        TableName=table_name,
        KeyConditionExpression="PK = :pk and SK = :sk",
        ExpressionAttributeValues={":pk": {"S": "POINTS"}, ":sk": {"S": profile}},
    )["Items"][0]["points"]["N"]
    updated_points = int(current_points) + int(new_points)
    return str(updated_points)


def _update_points(profile, updated_points):
    """Update profile points."""
    ddb.put_item(
        TableName=table_name,
        Item={
            "PK": {"S": "POINTS"},
            "SK": {"S": profile},
            "points": {"N": updated_points},
        },
    )
