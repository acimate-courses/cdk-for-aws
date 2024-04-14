import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam'
import * as logs from 'aws-cdk-lib/aws-logs';

import path = require('path');


export class AcimateInfraLambda extends cdk.Stack {
 constructor(scope: Construct,id: string, props?: cdk.StackProps){
    super(scope,id,props);

    const logGroup = new logs.LogGroup(this, 'Log Group',{
        logGroupName:'my-test-loggroup',
        removalPolicy:cdk.RemovalPolicy.DESTROY
    });

    const lambdaRole = new iam.Role(this, 'Role', {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        roleName:'my-lambda-role'
      });
    
      lambdaRole.addToPolicy(new iam.PolicyStatement({
        actions:["logs:CreateLogGroup","logs:CreateLogStream","logs:PutLogEvents"],
        effect:iam.Effect.ALLOW,
        resources:["arn:aws:logs:*:*:*"],        
    }),    
    );

    const fn = new lambda.Function(this,'Acimate-Test-Lambda',{
        runtime: lambda.Runtime.PYTHON_3_12,
        handler: 'testlambda.handler',
        code: lambda.Code.fromAsset('./src/s3trigger'),
        role:lambdaRole,
        logGroup:logGroup,
        //Without below line, CDK will assign a name like - AcimateInfraLambda-AcimateTestLambdaF42327D3-Jdr5XtJXhmlM
        functionName:"mylambda"
    });
 }
}