import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as iam from 'aws-cdk-lib/aws-iam';

export class AcimateInfraS3TriggerSqs extends cdk.Stack {
 constructor(scope: Construct,id: string, props?: cdk.StackProps){
    super(scope,id,props);
    
    const queue = new sqs.Queue(this,'myqueue',{
        queueName:'acimate-test-queue'        
    });

    queue.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
    
    //Policy is added automatically. Below is not necessary, 
    // however we need to see how to stop adding policies default if required
    queue.addToResourcePolicy(new iam.PolicyStatement({
        sid:'allowPublishToSqs',
        effect:iam.Effect.ALLOW,
        principals:[new iam.ServicePrincipal('s3.amazonaws.com')],
        actions:['sqs:GetQueueAttributes','sqs:GetQueueUrl','sqs:SendMessage'],
        resources:[queue.queueArn],
        conditions:{'ArnLike': {"aws:SourceArn": "arn:aws:s3:*:*:" + "acimate-test-bucket-999"},
        'StringEquals': {"aws:SourceAccount": "111111111111"}}
    }))

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

   trigger_bucket.addEventNotification(s3.EventType.OBJECT_CREATED, new s3n.SqsDestination(queue),{
    prefix:'test/',
    suffix:'.jpg'
   });

 }
}