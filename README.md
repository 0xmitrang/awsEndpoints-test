# ts-basic-express with AWS examples

### Pre-sign URL command:

```shell
aws s3 presign s3://01-nodejs-s3/pug.png --expires-in 10
```

### Bucket policy to make objects public

```json
{
    "Version": "2012-10-17",
    "Id": "Policy1669094324926",
    "Statement": [
        {
            "Sid": "Stmt1669094314406",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::859850295935:root" // add * for public access
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::01-nodejs-s3/aws-s3.jpg" // change object name
        }
    ]
}
```

### S3 Event Notification ACL

```json
{
    "Version": "2012-10-17",
    "Id": "AllowS3Publish",
    "Statement": [
        {
            "Sid": "S3EventNotification",
            "Effect": "Allow",
            "Principal": {
                "Service": "s3.amazonaws.com"
            },
            "Action": ["SNS:Publish"],
            "Resource": "arn:aws:sns:ap-northeast-1:859850295935:01-nodejs-sqs-standard", // SNS Arn
            "Condition": {
                "ArnLike": { "aws:SourceArn": "arn:aws:s3:::01-nodejs-s3" }, // Bucket ARN
                "StringEquals": { "aws:SourceAccount": "859850295935" } // Account Id of owner
            }
        }
    ]
}
```
