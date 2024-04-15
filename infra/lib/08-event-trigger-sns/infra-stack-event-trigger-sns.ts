import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as events from 'aws-cdk-lib/aws-events'
import * as eventtargets from 'aws-cdk-lib/aws-events-targets';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscription from 'aws-cdk-lib/aws-sns-subscriptions';


export class AcimateInfraEventTriggerSns extends cdk.Stack {
 constructor(scope: Construct,id: string, props?: cdk.StackProps){
    super(scope,id,props);
    
    const rule = new events.Rule(this,'event-schedule-rule',{
        schedule: events.Schedule.rate(cdk.Duration.minutes(5)),
        ruleName :'event-test-rule'
    });
    
    const topic = new sns.Topic(this,'my-test-topic',{
        topicName:'my-test-topic'        
    })
    rule.addTarget(new eventtargets.SnsTopic(topic,{
        retryAttempts:2,        
    }));

    let  email: string = 'sripada.mishra@gmail.com' ;
    topic.addSubscription(new subscription.EmailSubscription(email));
 }
}