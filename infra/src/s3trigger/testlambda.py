import boto3

def handler(event, context):
    print(event)
    print('Hello S3 Trigger!!')