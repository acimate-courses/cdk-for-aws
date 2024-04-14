import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam'
import * as logs from 'aws-cdk-lib/aws-logs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';

import path = require('path');


export class AcimateInfraS3TriggerLambda extends cdk.Stack {
 constructor(scope: Construct,id: string, props?: cdk.StackProps){
    super(scope,id,props);

    const logGroup = new logs.LogGroup(this, 'LambdaLogGroup',{
        logGroupName:'my-test-loggroup',
        removalPolicy:cdk.RemovalPolicy.DESTROY
    });

    const lambdaRole = new iam.Role(this, 'Role', {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        roleName:'my-lambda-role'
      });
    
      lambdaRole.addToPolicy(new iam.PolicyStatement({
        sid:'allowlogaccess',
        actions:["logs:CreateLogGroup","logs:CreateLogStream","logs:PutLogEvents"],
        effect:iam.Effect.ALLOW,
        resources:["arn:aws:logs:*:*:*"]
    }),
    );

    lambdaRole.addToPolicy(new iam.PolicyStatement({
        sid:'allows3access',
        actions:["s3:GetObjectAcl","s3:GetObjectAcl","s3:ListBucket"],
        effect:iam.Effect.ALLOW,
        resources:["arn:aws:s3:::" + "acimate-test-bucket-999" + "/*", "arn:aws:s3:::" + "acimate-test-bucket-999"]
    }),        
    );

    const fn = new lambda.Function(this,'Acimate-Test-Lambda',{
        runtime: lambda.Runtime.PYTHON_3_12,
        handler: 'testlambda.handler',
        code: lambda.Code.fromAsset('./src/s3trigger'),
        role:lambdaRole,
        logGroup:logGroup,
        //Without below line, CDK will assign a name like - AcimateInfraLambda-AcimateTestLambdaF42327D3-Jdr5XtJXhmlM
        functionName:"acimate-test-lambda"
    });

    // The code that defines your stack goes here
    const intelligentTieringConfigurations: s3.IntelligentTieringConfiguration={
        name:'s3_tier',
        archiveAccessTierTime: cdk.Duration.days(90),
        deepArchiveAccessTierTime:cdk.Duration.days(180)
     }

     const access_bucket = new s3.Bucket(this,'InfraAccessBucket',{
        bucketName :'acimate-test-access-bucket-999',
        blockPublicAccess : s3.BlockPublicAccess.BLOCK_ALL,
        encryption:s3.BucketEncryption.S3_MANAGED,
        enforceSSL:true,
        versioned: true,
        intelligentTieringConfigurations : [intelligentTieringConfigurations],
        objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
        publicReadAccess:false,
        removalPolicy:cdk.RemovalPolicy.DESTROY
       });

       //Create buckets
   const trigger_bucket = new s3.Bucket(this,'InfraBucket',{
    bucketName :'acimate-test-bucket-999',
    blockPublicAccess : s3.BlockPublicAccess.BLOCK_ALL,
    encryption:s3.BucketEncryption.S3_MANAGED,
    enforceSSL:true,
    versioned: true,
    intelligentTieringConfigurations : [intelligentTieringConfigurations],
    objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
    publicReadAccess:false,
    serverAccessLogsBucket:access_bucket, 
    removalPolicy:cdk.RemovalPolicy.DESTROY   
   });

   trigger_bucket.addEventNotification(s3.EventType.OBJECT_CREATED, new s3n.LambdaDestination(fn),{
    prefix:'test/',
    suffix:'.jpg'
   });   

 }
}