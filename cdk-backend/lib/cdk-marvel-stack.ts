import { Stack, StackProps, CfnOutput, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
//APPSYNC
import * as appsync from '@aws-cdk/aws-appsync-alpha';
//DYNAMODB
import * as ddb from 'aws-cdk-lib/aws-dynamodb';
//LAMBDA
import * as lambda from 'aws-cdk-lib/aws-lambda';
//COGNITO
import * as cognito from 'aws-cdk-lib/aws-cognito';


export class CdkMarvelStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);






//**************************APPSYNC**************************/
    //APPSYNC's API gives you a graphqlApi with apiKey ( for deploying APPSYNC )
    const api = new appsync.GraphqlApi(this, 'graphlApi', {
      name: 'marvel-api',
      schema: appsync.Schema.fromAsset('graphql/schema.gql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY
        }
      }
    });


    //print graphqlApi Url on console after deploy APPSYNC
    new CfnOutput(this, 'GraphQlAPIUrl', {
      value: api.graphqlUrl
    });


    //print apiKey on console after deploy APPSYNC
    new CfnOutput(this, 'GraphQLAPIKey', {
      value: api.apiKey || ''
    });
//**************************APPSYNC**************************/






//**************************DYNAMODB**************************/
    //creating table
    const myTable = new ddb.Table(this, 'marvel-table', {
      partitionKey: { name: 'id', type: ddb.AttributeType.STRING }
    });
//**************************DYNAMODB**************************/






//**************************DATASOURCE**************************/
    //setting table as a datasource of endpoint
    const db_datasource_marvel = api.addDynamoDbDataSource('DBDataSource-marvel', myTable);
//**************************DATASOURCE**************************/






//**************************LAMBDA**************************/
    //creating lambdafunction
    const myLambda = new lambda.Function(this, 'marvel-dynamodbLambda', {
      runtime: lambda.Runtime.NODEJS_16_X,
      code: new lambda.AssetCode("lambda"),
      handler: 'index.handler',
      currentVersionOptions: {
        //async retry attempts
        retryAttempts: 0
      },
      //giving timeout
      timeout: Duration.minutes(2)
    });
//**************************LAMBDA**************************/






//**************************DATASOURCE**************************/
    //setting lambdafunction ( as a datasource of endpoint )
    const myLambda_datasource = api.addLambdaDataSource('marvelDynamodbLamdaDataSource', myLambda);
//**************************DATASOURCE**************************/







//**************************DB_ACCESS***********************/
    //for give access to lambdafunction ( to get data from dynamoDB's table )
    myTable.grantReadWriteData(myLambda);


    //for tell lambdafunction ( that this named table consider for storing )
    myLambda.addEnvironment('TABLE_NAME', myTable.tableName);
//**************************DB_ACCESS**********************/






//**************************MUTATIONS**************************/
    const mutations = [
      "createGraph", "deleteGraph", "editGraph"
    ];
    mutations.forEach((thatMutation: string) => {
      let db_datasource = db_datasource_marvel;
      let request_mappingTemplate;
  
  
      if(
           thatMutation === "createGraph"
      ) {
        request_mappingTemplate = appsync.MappingTemplate.dynamoDbPutItem(
          appsync.PrimaryKey.partition('id').auto(),
          appsync.Values.projecting()
        );
      }
      else if(
           thatMutation === "deleteGraph"
      ) {
        request_mappingTemplate = appsync.MappingTemplate.dynamoDbDeleteItem('id', 'id');
      }
      else if(
           thatMutation === "editGraph"
      ) {
        request_mappingTemplate = appsync.MappingTemplate.dynamoDbPutItem(
          appsync.PrimaryKey.partition('id').is('id'),
          appsync.Values.projecting()
        );
      }
    
  
      //describing resolver for datasource
      db_datasource.createResolver({
        typeName: "Mutation",
        fieldName: thatMutation,
        requestMappingTemplate: request_mappingTemplate,
        responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem()
      });
    });
//**************************MUTATIONS**************************/






//**************************QUERIES**************************/
    const queries = [
      "allGraphs", "getGraphByID"
    ];
    queries.forEach((thatQuery: string) => {
      //describing resolver for datasource ( for get data from DynamoDB )
      myLambda_datasource.createResolver({
        typeName: "Query",
        fieldName: thatQuery
      });
    });
//**************************QUERIES**************************/






//**************************COGNITO**************************/
    //creating userpool
    const userPool = new cognito.UserPool(this, 'marvel-UserPool', {
      //user can sigin with 'email' & 'username' ( can also include phone, preferredUsername )
      signInAliases: {
        email: true,
        username: true
      },


      //defining policies for 'password' ( default policies are all true )
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: false
      },


      //allow users for 'signup' to create account ( so not only administrator makes account )
      selfSignUpEnabled: true,


      //user can recover account with 'email' only ( can also include PHONE_ONLY, PHONE_AND_EMAIL, etc )
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,


      //verification while creating an account using 'email' by sending a verification code ( can also add phone )
      autoVerify: {
        email: true
      },


      //customize your 'email' & 'phone' verification messages
      userVerification: {
        emailSubject: 'Verify your email for Marvel!',
        emailBody: 'Hello, Thanks for using Marvel! Your verification code is {####}',
        emailStyle: cognito.VerificationEmailStyle.CODE
      }
    });


    //creating 'Client' for connect COGNITO with frontend
    const userPoolClient = new cognito.UserPoolClient(this, 'marvel-userPoolClient-amplify', {
      userPool
    });


    //send by userPool
    const userPoolId = new CfnOutput(this, 'marvel-userPoolId', {
      value: userPool.userPoolId
    });


    //send by userPool
    const userPoolClientId = new CfnOutput(this, 'marvel-userPoolClientId', {
      value: userPoolClient.userPoolClientId
    });
//**************************COGNITO**************************/
  }
}