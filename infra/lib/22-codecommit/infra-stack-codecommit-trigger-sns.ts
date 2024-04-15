import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as events from 'aws-cdk-lib/aws-events'
import * as eventtargets from 'aws-cdk-lib/aws-events-targets';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscription from 'aws-cdk-lib/aws-sns-subscriptions';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';

export class AcimateInfraCodeCommitTriggerSns extends cdk.Stack {
 constructor(scope: Construct,id: string, props?: cdk.StackProps){
    super(scope,id,props);
    
    const topic = new sns.Topic(this,'my-test-topic',{
        topicName:'my-test-topic'        
    })
    
    let  email: string = 'sripada.mishra@gmail.com' ;
    topic.addSubscription(new subscription.EmailSubscription(email));

     const repo = new codecommit.Repository(this,'myrepo',{
        repositoryName:'acimate-cdk-repo',
    });

    const commitRule = repo.onCommit('onCommit',{
        target: new eventtargets.SnsTopic(topic,{
            message:events.RuleTargetInput.fromText(
                `A commit was pushed to the repository ${codecommit.ReferenceEvent.repositoryName} on branch ${codecommit.ReferenceEvent.referenceName}`
            )
        })
    });
 }
}