import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as events from 'aws-cdk-lib/aws-events'
import * as eventtargets from 'aws-cdk-lib/aws-events-targets';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscription from 'aws-cdk-lib/aws-sns-subscriptions';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as s3 from 'aws-cdk-lib/aws-s3';


export class AcimateInfraCodeBuild extends cdk.Stack {
 constructor(scope: Construct,id: string, props?: cdk.StackProps){
    super(scope,id,props);
    

    //Create buckets
   const deploy_bucket = new s3.Bucket(this,'InfraBucket',{
    bucketName :'acimate-test-bucket-999',
    blockPublicAccess : s3.BlockPublicAccess.BLOCK_ALL,
    encryption:s3.BucketEncryption.S3_MANAGED,
    enforceSSL:true,
    versioned: true,    
    objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
    publicReadAccess:false,    
    removalPolicy:cdk.RemovalPolicy.DESTROY
   });

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

    const codeBuildSource = codebuild.Source.codeCommit({
        identifier:'buildsource',
        repository:repo,
        branchOrRef:'main'
    });
    
    // codebuild role
    const codebuildRole = new iam.Role(this, "CodeBuildRole", {
        roleName: id + "-codebuild-role",
        assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal('codebuild.amazonaws.com'),
        new iam.ServicePrincipal('codepipeline.amazonaws.com')
        )
    });
  
    codebuildRole.addToPolicy(
        new iam.PolicyStatement({ resources: ["*"], actions: ["s3:*"] })
    );

    // build project
const buildProject = new codebuild.Project(this, id + '-codebuild', {
    projectName: id + '-codebuild',
    role: codebuildRole,
    badge: true,
    source: codeBuildSource,
    buildSpec: codebuild.BuildSpec.fromSourceFilename('buildspec.yml'),
    environment: {
      buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
    },
    environmentVariables: {
      SAMPLE_DATA: {
        value: 'data',
      },
    },
  });

const sourceOutput = new codepipeline.Artifact();
const buildOutput = new codepipeline.Artifact();

const sourceAction = new codepipeline_actions.CodeCommitSourceAction({
    actionName:'CodeCommit_Source',
    repository:repo,
    output:sourceOutput,
    trigger:codepipeline_actions.CodeCommitTrigger.POLL
})

// manual approval action
const manualApprovalAction =
  new codepipeline_actions.ManualApprovalAction({
    actionName: "BuildApproval",
  });

  // build action
const buildAction = new codepipeline_actions.CodeBuildAction({
    actionName: 'Build',
    project: buildProject,
    input: sourceOutput,
    outputs: [buildOutput]
  })
  
  // deploy action
const deployAction = new codepipeline_actions.S3DeployAction({
    actionName: 'DeployToS3',
    input: buildOutput,
    bucket: deploy_bucket,
    runOrder: 1,
  })

// pipeline
new codepipeline.Pipeline(this, id + "-pipeline", {
    pipelineName: id + "-pipeline",
    stages: [
      {
        stageName: "Source",
        actions: [sourceAction]
      },
      {
        stageName: "Approve",
        actions: [manualApprovalAction]
      },
      {
        stageName: "Build",
        actions: [buildAction]
      },
      {
        stageName: "Deploy",
        actions: [deployAction]
      },
    ]
  });




 }
}