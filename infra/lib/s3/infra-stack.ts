import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

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
   const bucket = new s3.Bucket(this,'InfraBucket',{
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
  }
}
