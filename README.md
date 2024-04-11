# cdk-for-aws installation
## Installation Guide
 - https://docs.aws.amazon.com/toolkit-for-vscode/latest/userguide/setup-toolkit.html
 - Node.js SDK: https://nodejs.org/en/download
 - install cdk (https://docs.aws.amazon.com/cdk/v2/guide/cli.html)

## once all installed , steps to do for the application creation
 - create one folder - say /infra
 - cd infra
 - Run command as follws-
  - cdk init app --language typescript [this will create the folder structure]
  - Go to /lib/infra-stack.ts and update the resources you want to create
  - npm run build
  - cdk ls
  - cdk synth ( this is optional, it will be done when cdk deploy is called)
  - cdk bootstrap
  - cdk deploy

## Policy Validator example
 - https://github.com/defensive-works/aws-service-control-policies-automation/tree/main/stacks
 - https://aws.amazon.com/blogs/opensource/using-strong-typing-practices-to-declare-a-large-number-of-resources-with-aws-cdk/

## Q&A
 - Which version of AWS CDK did you use?
 - How can you update the typescript version in you cdk project?
 - What is package-lock.json / cdk.json? How to add depedency of custom library?
 - What is CDK cli commands and its lifecycle?
 - How can you view the infra changes once you make some updates in your stack? [cdk diff]
 - What is L1, L2, L3 constructs in CDK and examples?
 - What is aspects context in CDK?
 - How to pass parameters in CDK?
 - Write code to deploy lambda along with role,policies in cdk?
 - How to reference resources between stacks?
 In CDK, you can export a resource's output by creating a cfnOutput with an exportName property. You can also use Fn. ImportValue to import an exported value to a stack from a different stack.
 - How bootstarping is used in cdk?
 - How can you share a package to other development team as reusable construct?
 - How will you deploy one s3 in 2 regions for 2 accounts in CDK?
 - How can you create 4 s3 buckets  using loop in CDK?
 - You want that none in your organization is allowed to deploy in us-east-2? how can you enforce it?
 - How can you make s3 bucket - not publicly accessible using cdk?
 - Give example of Identity policies and resource policies?
 - How to unit test the infra code?
 - what is lambda permission? lambda event sourceing?
 - Scenario - You want to create a Machine Leanring model hosted in one central account on the s3 access logs written by various  accounts? How can you achieve this?
 - Scenario - Platform Monitoring - You have 100 accounts writing to cloud watch logs. You want to implement one monitoring logic to find compliance of the logs from a central accounts. How to achieve this?
 - Scenario - Different dev team is creating aws resources but team might miss to tag centain important tags to resources? How can you implement monitoring and generate alerts if tags are missing for different resources?
 - Any other use case? - DB backup/restore infra IAC? Disaster recovery setup using IAC? ECS setup?
   VPC or networking setup - How to do monitoring of your networking - like getting notification of
    when VPC is created, subnet is created etc., Security rules?
 - How can you implement patching of Ec2 instances in best automated way?
 
## Typescript Questions-
 - How to install typescript?
 - Type assertions? 
    let someValue: unknown = "this is a string";
    let strLength: number = (someValue as string).length; 
    let strLength: number = (<string>someValue).length;
 - What is typescript Object?
 - What is package.json
 - What is Awaited and Promise improvements in Typescript 4.5
 - How to compile Typescript code? [npm install -g typescript] tsc command
 - internal module or namespace / external modules?
 - What are objects in typescript?
   An object is a type of instance that consists of a collection of key-value pairs. Scalar values, functions, and even arrays of other objects can be used as values.
Syntax:
var object_name = { 
   key1: “value”, //scalar value 
   key2: “value”,  
   key3: function() {
      //functions 
   }, 
   key4:[“contentA”, “contentB”] //collection  
};
 - What are Rest Parameters in Typescript? The rest parameter can take zero or more parameters. The compiler will generate an array of arguments containing the name of the rest parameter.
 - What is Namespace and how to declare it?
 - unknown, undefined, never,void
 - function in typescript and Function in AWS??
 - Tuple, Array
 - const and readonly
 - Types in typescript
    Generics - Types which take parameters
Keyof Type Operator - Using the keyof operator to create new types
Typeof Type Operator - Using the typeof operator to create new types
Indexed Access Types - Using Type['a'] syntax to access a subset of a type
Conditional Types - Types which act like if statements in the type system
Mapped Types - Creating types by mapping each property in an existing type
Template Literal Types - Mapped types which change properties via template literal strings
## PYTHON---------------
 - Write lambda code to read s3 file and write into dynamoDB
 - Write lambda to read sqs and write to s3 bucket.
 - How to find a key exist in map?
 - How to read an event in lambda?
 - How to find a string exist in a list?
 - How to read a json file or write a json file or string?
 - Read element from a map {[of list of {map}],[],[]}
 - SECURITY------------------------------------------
 - How to create virtual env?
 - How to install third party library in your lambda?
