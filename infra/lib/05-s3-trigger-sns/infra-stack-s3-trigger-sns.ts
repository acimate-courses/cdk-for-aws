import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscription from 'aws-cdk-lib/aws-sns-subscriptions';
import * as iam from 'aws-cdk-lib/aws-iam';

export class AcimateInfraS3TriggerSns extends cdk.Stack {
 constructor(scope: Construct,id: string, props?: cdk.StackProps){
    super(scope,id,props);
    
    const topic = new sns.Topic(this,'mytopic',{
        topicName:'acimate-test-topic'        
    });

    topic.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

    let  email: string = 'sripada.mishra@gmail.com' ;
    topic.addSubscription(new subscription.EmailSubscription(email));

    topic.addToResourcePolicy(new iam.PolicyStatement({
        sid:'allowPublishToSns',
        effect:iam.Effect.ALLOW,
        principals:[new iam.ServicePrincipal('s3.amazonaws.com')],
        actions:['sns:Publish'],
        resources:[topic.topicArn],
        conditions:{'ArnLike': {"aws:SourceArn": "arn:aws:s3:*:*:" + "acimate-test-bucket-999"},
        'StringEquals': {"aws:SourceAccount": "707690426194"}}
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

   trigger_bucket.addEventNotification(s3.EventType.OBJECT_CREATED, new s3n.SnsDestination(topic),{
    prefix:'test/',
    suffix:'.jpg'
   });   

 }
}