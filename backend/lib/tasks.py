import boto3
import os
import json
import hashlib
from datetime import datetime, timedelta

ddb = boto3.client("dynamodb", region_name=os.environ["AWS_REGION"])
table_name = os.environ["DYNAMODB_TABLE_NAME"]


def get():
    return json.dumps({"profiles": _get_profiles(), "tasks": _get_tasks()})


def reset():
    return json.dumps({"tasks": _get_tasks(reset=True)})


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
            profiles[profile]["image_filename"] = (
                hashlib.sha256(f"{profile}.png".encode()).hexdigest() + ".png"
            )
        elif item_type == "prize":
            prize = {"name": item["name"]["S"], "points": int(item["points"]["N"])}
            profiles[profile]["prize"] = prize
            profiles[profile]["prize"]["image_filename"] = (
                hashlib.sha256(f"{profile}-prize.png".encode()).hexdigest() + ".png"
            )
    return profiles


def _get_tasks(reset=False):
    """Get serialized tasks list."""
    result = ddb.query(
        TableName=table_name,
        KeyConditionExpression="PK = :pk",
        ExpressionAttributeValues={":pk": {"S": "TASKS"}},
    )["Items"]
    tasks = {"bruno": [], "dante": []}
    for item in result:
        # Reactivacion de item si corresponde
        if "disabled_until" in item:
            if (
                item["disabled_until"]["S"] < datetime.now().strftime("%Y%m%d%H%M")
                or reset
            ):
                del item["disabled_until"]
                for profile in list(tasks.keys()):
                    item[profile]["S"] = (
                        "True"
                        if item[profile]["S"] == "disabled"
                        else item[profile]["S"]
                    )
                ddb.put_item(TableName=table_name, Item=item)
        for profile in list(tasks.keys()):
            if item[profile]["S"] == "True":
                tasks[profile].append(
                    {"name": item["name"]["S"], "points": item["points"]["N"]}
                )
    return tasks


def post(data):
    data = json.loads(data)
    profile = data["profile"]
    new_points = data["points"]
    task_name = data["task"]

    _log_event(profile, task_name, new_points)
    _disable_task(profile, task_name)
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


def _disable_task(profile, task_name):
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
    task[profile] = {"S": "disabled"}
    ddb.put_item(TableName=table_name, Item=task)


def _calculate_new_profile_points(profile, new_points):
    """Calculate new total points for profile."""
    current_points = ddb.query(
        TableName=table_name,
        KeyConditionExpression="PK = :pk and SK = :sk",
        ExpressionAttributeValues={
            ":pk": {"S": "PROFILE"},
            ":sk": {"S": f"{profile}#points"},
        },
    )["Items"][0]["points"]["N"]
    updated_points = int(current_points) + int(new_points)
    return str(updated_points)


def _update_points(profile, updated_points):
    """Update profile points."""
    ddb.put_item(
        TableName=table_name,
        Item={
            "PK": {"S": "PROFILE"},
            "SK": {"S": f"{profile}#points"},
            "points": {"N": updated_points},
        },
    )
