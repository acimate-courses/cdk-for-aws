import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as events from 'aws-cdk-lib/aws-events'
import * as eventtargets from 'aws-cdk-lib/aws-events-targets';
import * as logs from 'aws-cdk-lib/aws-logs'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as lambda from 'aws-cdk-lib/aws-lambda'


export class AcimateInfraEventTriggerLambda extends cdk.Stack {
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
    
    const fn = new lambda.Function(this,'Acimate-Test-Lambda',{
        runtime: lambda.Runtime.PYTHON_3_12,
        handler: 'testlambda.handler',
        code: lambda.Code.fromAsset('./src/eventtrigger'),
        role:lambdaRole,
        logGroup:logGroup,        
        functionName:"acimate-test-lambda"
    });

    const rule = new events.Rule(this,'event-schedule-rule',{
        schedule: events.Schedule.rate(cdk.Duration.minutes(5))
    });
    
    rule.addTarget(new eventtargets.LambdaFunction(fn,{        
        retryAttempts: 2
    }));
 }
}