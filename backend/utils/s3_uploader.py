import boto3
import os
from botocore.exceptions import NoCredentialsError

def upload_video_to_s3(file_path, s3_bucket, s3_key):
    s3 = boto3.client('s3',
                      aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
                      aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"))
    try:
        s3.upload_file(file_path, s3_bucket, s3_key)
        url = f"https://{s3_bucket}.s3.amazonaws.com/{s3_key}"
        return url
    except FileNotFoundError:
        return "File not found."
    except NoCredentialsError:
        return "Credentials not available."