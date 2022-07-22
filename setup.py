#!python
import os
import boto3
import json
import argparse
import logging
import hashlib

parser = argparse.ArgumentParser()
parser.add_argument(
    "-s", "--stage", default="test", help="Ambiente de creación",
)
parser.add_argument(
    "-r", "--region", default="us-east-1", help="Region de creación",
)
parser.add_argument(
    "--backend", default=False, action="store_true", help="Hacer despliegue de backend",
)
parser.add_argument(
    "--seed", default=False, action="store_true", help="Hacer seed de DDB",
)
parser.add_argument(
    "--frontend", default=False, action="store_true", help="Hacer build de frontend",
)

logging.basicConfig(format="%(asctime)s %(message)s")

args = parser.parse_args()

REGION = args.region
STAGE = args.stage
SEED = args.seed
BACKEND = args.backend
FRONTEND = args.frontend

# Deploy serverless
if BACKEND:
    logging.warning(f"Desplegando backend para ambiente {STAGE}")
    os.system(f"cd backend && sls deploy -s {STAGE}")

# Seed DDB table
if SEED:
    table_name = "portense-bien" + ("" if STAGE == "dev" else f"-{STAGE}")
    logging.warning(f"Haciendo seed de tabla DDB {table_name}")
    ddb = boto3.client("dynamodb", region_name=REGION)
    ddb_table_name = table_name
    seed_file = open("seed.json", "r")
    seed_json = json.loads(seed_file.read())
    for item in seed_json:
        ddb.put_item(TableName=ddb_table_name, Item=item)

# Get API endpoint and key
logging.warning("Configurando archivos con variables sensibles")
cfn = boto3.client("cloudformation")
out = cfn.describe_stacks(StackName=f"portense-bien-{STAGE}")["Stacks"][0]["Outputs"]
api_endpoint = [
    o["OutputValue"] for o in out if o.get("OutputKey") == "ServiceEndpoint"
][0]
api_key_name = "portense-bien" + ("" if STAGE == "dev" else f"-{STAGE}")
api_keys = boto3.client("apigateway").get_api_keys(
    nameQuery=api_key_name, includeValues=True
)["items"]
api_key = [k["value"] for k in api_keys if k["name"] == api_key_name][0]

# Update .env and eas.json
bucket_name = f"portense-bien-assets-{STAGE}"
os.system(
    f"API_KEY={api_key} API_ENDPOINT={api_endpoint} BUCKET_NAME={bucket_name} envsubst < frontend/eas.json.template > frontend/eas.json"
)
os.system(f"echo 'API_KEY={api_key}' > frontend/.env")
os.system(f"echo 'API_ENDPOINT={api_endpoint}' >> frontend/.env")
os.system(f"echo 'BUCKET_NAME={bucket_name}' >> frontend/.env")

# Upload images to S3
logging.warning("Actualizando imagenes en s3")
s3 = boto3.client("s3")
for image in ["bruno.png", "dante.png", "bruno-prize.png", "dante-prize.png"]:
    s3_name = f"{hashlib.sha256(image.encode()).hexdigest()}.png"
    s3.upload_file(
        f"s3/{image}", bucket_name, s3_name, ExtraArgs={"ACL": "public-read"}
    )

# Build frontend APK
if FRONTEND:
    logging.warning("Construyendo frontend")
    os.system(
        "cd frontend && expo eject -p android && EAS_NO_VCS=1 eas build -p android --profile preview"
    )
    # Finalmente, hacer adb install xxx.apk
