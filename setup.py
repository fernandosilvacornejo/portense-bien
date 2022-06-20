#!python
import os
import boto3
import json

REGION = "us-east-1"

# Deploy serverless
os.system("pushd backend && sls deploy && popd")

# Seed DDB table
ddb = boto3.client("dynamodb", region_name=REGION)
ddb_table_name = "puntos-por-portarse-bien"
seed_file = open("seed.json", "r")
seed_json = json.loads(seed_file.read())
for item in seed_json:
    ddb.put_item(TableName=ddb_table_name, Item=item)
