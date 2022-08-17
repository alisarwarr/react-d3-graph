"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdkMarvelStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
//APPSYNC
const appsync = require("@aws-cdk/aws-appsync-alpha");
//DYNAMODB
const ddb = require("aws-cdk-lib/aws-dynamodb");
//LAMBDA
const lambda = require("aws-cdk-lib/aws-lambda");
//COGNITO
const cognito = require("aws-cdk-lib/aws-cognito");
class CdkMarvelStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
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
        new aws_cdk_lib_1.CfnOutput(this, 'GraphQlAPIUrl', {
            value: api.graphqlUrl
        });
        //print apiKey on console after deploy APPSYNC
        new aws_cdk_lib_1.CfnOutput(this, 'GraphQLAPIKey', {
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
            timeout: aws_cdk_lib_1.Duration.minutes(2)
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
        mutations.forEach((thatMutation) => {
            let db_datasource = db_datasource_marvel;
            let request_mappingTemplate;
            if (thatMutation === "createGraph") {
                request_mappingTemplate = appsync.MappingTemplate.dynamoDbPutItem(appsync.PrimaryKey.partition('id').auto(), appsync.Values.projecting());
            }
            else if (thatMutation === "deleteGraph") {
                request_mappingTemplate = appsync.MappingTemplate.dynamoDbDeleteItem('id', 'id');
            }
            else if (thatMutation === "editGraph") {
                request_mappingTemplate = appsync.MappingTemplate.dynamoDbPutItem(appsync.PrimaryKey.partition('id').is('id'), appsync.Values.projecting());
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
        queries.forEach((thatQuery) => {
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
        const userPoolId = new aws_cdk_lib_1.CfnOutput(this, 'marvel-userPoolId', {
            value: userPool.userPoolId
        });
        //send by userPool
        const userPoolClientId = new aws_cdk_lib_1.CfnOutput(this, 'marvel-userPoolClientId', {
            value: userPoolClient.userPoolClientId
        });
        //**************************COGNITO**************************/
    }
}
exports.CdkMarvelStack = CdkMarvelStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLW1hcnZlbC1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNkay1tYXJ2ZWwtc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkNBQXFFO0FBRXJFLFNBQVM7QUFDVCxzREFBc0Q7QUFDdEQsVUFBVTtBQUNWLGdEQUFnRDtBQUNoRCxRQUFRO0FBQ1IsaURBQWlEO0FBQ2pELFNBQVM7QUFDVCxtREFBbUQ7QUFHbkQsTUFBYSxjQUFlLFNBQVEsbUJBQUs7SUFDdkMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUMxRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQU81Qiw4REFBOEQ7UUFDMUQsNEVBQTRFO1FBQzVFLE1BQU0sR0FBRyxHQUFHLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFO1lBQ3BELElBQUksRUFBRSxZQUFZO1lBQ2xCLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQztZQUN0RCxtQkFBbUIsRUFBRTtnQkFDbkIsb0JBQW9CLEVBQUU7b0JBQ3BCLGlCQUFpQixFQUFFLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPO2lCQUNyRDthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBR0gsc0RBQXNEO1FBQ3RELElBQUksdUJBQVMsQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFO1lBQ25DLEtBQUssRUFBRSxHQUFHLENBQUMsVUFBVTtTQUN0QixDQUFDLENBQUM7UUFHSCw4Q0FBOEM7UUFDOUMsSUFBSSx1QkFBUyxDQUFDLElBQUksRUFBRSxlQUFlLEVBQUU7WUFDbkMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxNQUFNLElBQUksRUFBRTtTQUN4QixDQUFDLENBQUM7UUFDUCw4REFBOEQ7UUFPOUQsK0RBQStEO1FBQzNELGdCQUFnQjtRQUNoQixNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcs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Q1QsQ0FBQyxDQUFDO1FBR0gsa0JBQWtCO1FBQ2xCLE1BQU0sVUFBVSxHQUFHLElBQUksdUJBQVMsQ0FBQyxJQUFJLEVBQUUsbUJBQW1CLEVBQUU7WUFDMUQsS0FBSyxFQUFFLFFBQVEsQ0FBQyxVQUFVO1NBQzNCLENBQUMsQ0FBQztRQUdILGtCQUFrQjtRQUNsQixNQUFNLGdCQUFnQixHQUFHLElBQUksdUJBQVMsQ0FBQyxJQUFJLEVBQUUseUJBQXlCLEVBQUU7WUFDdEUsS0FBSyxFQUFFLGNBQWMsQ0FBQyxnQkFBZ0I7U0FDdkMsQ0FBQyxDQUFDO1FBQ1AsOERBQThEO0lBQzVELENBQUM7Q0FDRjtBQXhPRCx3Q0F3T0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdGFjaywgU3RhY2tQcm9wcywgQ2ZuT3V0cHV0LCBEdXJhdGlvbiB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuLy9BUFBTWU5DXG5pbXBvcnQgKiBhcyBhcHBzeW5jIGZyb20gJ0Bhd3MtY2RrL2F3cy1hcHBzeW5jLWFscGhhJztcbi8vRFlOQU1PREJcbmltcG9ydCAqIGFzIGRkYiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZHluYW1vZGInO1xuLy9MQU1CREFcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhJztcbi8vQ09HTklUT1xuaW1wb3J0ICogYXMgY29nbml0byBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29nbml0byc7XG5cblxuZXhwb3J0IGNsYXNzIENka01hcnZlbFN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IFN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuXG5cblxuXG5cbi8vKioqKioqKioqKioqKioqKioqKioqKioqKipBUFBTWU5DKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgLy9BUFBTWU5DJ3MgQVBJIGdpdmVzIHlvdSBhIGdyYXBocWxBcGkgd2l0aCBhcGlLZXkgKCBmb3IgZGVwbG95aW5nIEFQUFNZTkMgKVxuICAgIGNvbnN0IGFwaSA9IG5ldyBhcHBzeW5jLkdyYXBocWxBcGkodGhpcywgJ2dyYXBobEFwaScsIHtcbiAgICAgIG5hbWU6ICdtYXJ2ZWwtYXBpJyxcbiAgICAgIHNjaGVtYTogYXBwc3luYy5TY2hlbWEuZnJvbUFzc2V0KCdncmFwaHFsL3NjaGVtYS5ncWwnKSxcbiAgICAgIGF1dGhvcml6YXRpb25Db25maWc6IHtcbiAgICAgICAgZGVmYXVsdEF1dGhvcml6YXRpb246IHtcbiAgICAgICAgICBhdXRob3JpemF0aW9uVHlwZTogYXBwc3luYy5BdXRob3JpemF0aW9uVHlwZS5BUElfS0VZXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgLy9wcmludCBncmFwaHFsQXBpIFVybCBvbiBjb25zb2xlIGFmdGVyIGRlcGxveSBBUFBTWU5DXG4gICAgbmV3IENmbk91dHB1dCh0aGlzLCAnR3JhcGhRbEFQSVVybCcsIHtcbiAgICAgIHZhbHVlOiBhcGkuZ3JhcGhxbFVybFxuICAgIH0pO1xuXG5cbiAgICAvL3ByaW50IGFwaUtleSBvbiBjb25zb2xlIGFmdGVyIGRlcGxveSBBUFBTWU5DXG4gICAgbmV3IENmbk91dHB1dCh0aGlzLCAnR3JhcGhRTEFQSUtleScsIHtcbiAgICAgIHZhbHVlOiBhcGkuYXBpS2V5IHx8ICcnXG4gICAgfSk7XG4vLyoqKioqKioqKioqKioqKioqKioqKioqKioqQVBQU1lOQyoqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cblxuXG5cblxuLy8qKioqKioqKioqKioqKioqKioqKioqKioqKkRZTkFNT0RCKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgLy9jcmVhdGluZyB0YWJsZVxuICAgIGNvbnN0IG15VGFibGUgPSBuZXcgZGRiLlRhYmxlKHRoaXMsICdtYXJ2ZWwtdGFibGUnLCB7XG4gICAgICBwYXJ0aXRpb25LZXk6IHsgbmFtZTogJ2lkJywgdHlwZTogZGRiLkF0dHJpYnV0ZVR5cGUuU1RSSU5HIH1cbiAgICB9KTtcbi8vKioqKioqKioqKioqKioqKioqKioqKioqKipEWU5BTU9EQioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cblxuXG5cblxuLy8qKioqKioqKioqKioqKioqKioqKioqKioqKkRBVEFTT1VSQ0UqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAvL3NldHRpbmcgdGFibGUgYXMgYSBkYXRhc291cmNlIG9mIGVuZHBvaW50XG4gICAgY29uc3QgZGJfZGF0YXNvdXJjZV9tYXJ2ZWwgPSBhcGkuYWRkRHluYW1vRGJEYXRhU291cmNlKCdEQkRhdGFTb3VyY2UtbWFydmVsJywgbXlUYWJsZSk7XG4vLyoqKioqKioqKioqKioqKioqKioqKioqKioqREFUQVNPVVJDRSoqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cblxuXG5cblxuLy8qKioqKioqKioqKioqKioqKioqKioqKioqKkxBTUJEQSoqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICAgIC8vY3JlYXRpbmcgbGFtYmRhZnVuY3Rpb25cbiAgICBjb25zdCBteUxhbWJkYSA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ21hcnZlbC1keW5hbW9kYkxhbWJkYScsIHtcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNl9YLFxuICAgICAgY29kZTogbmV3IGxhbWJkYS5Bc3NldENvZGUoXCJsYW1iZGFcIiksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBjdXJyZW50VmVyc2lvbk9wdGlvbnM6IHtcbiAgICAgICAgLy9hc3luYyByZXRyeSBhdHRlbXB0c1xuICAgICAgICByZXRyeUF0dGVtcHRzOiAwXG4gICAgICB9LFxuICAgICAgLy9naXZpbmcgdGltZW91dFxuICAgICAgdGltZW91dDogRHVyYXRpb24ubWludXRlcygyKVxuICAgIH0pO1xuLy8qKioqKioqKioqKioqKioqKioqKioqKioqKkxBTUJEQSoqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cblxuXG5cblxuLy8qKioqKioqKioqKioqKioqKioqKioqKioqKkRBVEFTT1VSQ0UqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAvL3NldHRpbmcgbGFtYmRhZnVuY3Rpb24gKCBhcyBhIGRhdGFzb3VyY2Ugb2YgZW5kcG9pbnQgKVxuICAgIGNvbnN0IG15TGFtYmRhX2RhdGFzb3VyY2UgPSBhcGkuYWRkTGFtYmRhRGF0YVNvdXJjZSgnbWFydmVsRHluYW1vZGJMYW1kYURhdGFTb3VyY2UnLCBteUxhbWJkYSk7XG4vLyoqKioqKioqKioqKioqKioqKioqKioqKioqREFUQVNPVVJDRSoqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cblxuXG5cblxuXG4vLyoqKioqKioqKioqKioqKioqKioqKioqKioqREJfQUNDRVNTKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgLy9mb3IgZ2l2ZSBhY2Nlc3MgdG8gbGFtYmRhZnVuY3Rpb24gKCB0byBnZXQgZGF0YSBmcm9tIGR5bmFtb0RCJ3MgdGFibGUgKVxuICAgIG15VGFibGUuZ3JhbnRSZWFkV3JpdGVEYXRhKG15TGFtYmRhKTtcblxuXG4gICAgLy9mb3IgdGVsbCBsYW1iZGFmdW5jdGlvbiAoIHRoYXQgdGhpcyBuYW1lZCB0YWJsZSBjb25zaWRlciBmb3Igc3RvcmluZyApXG4gICAgbXlMYW1iZGEuYWRkRW52aXJvbm1lbnQoJ1RBQkxFX05BTUUnLCBteVRhYmxlLnRhYmxlTmFtZSk7XG4vLyoqKioqKioqKioqKioqKioqKioqKioqKioqREJfQUNDRVNTKioqKioqKioqKioqKioqKioqKioqKi9cblxuXG5cblxuXG5cbi8vKioqKioqKioqKioqKioqKioqKioqKioqKipNVVRBVElPTlMqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICBjb25zdCBtdXRhdGlvbnMgPSBbXG4gICAgICBcImNyZWF0ZUdyYXBoXCIsIFwiZGVsZXRlR3JhcGhcIiwgXCJlZGl0R3JhcGhcIlxuICAgIF07XG4gICAgbXV0YXRpb25zLmZvckVhY2goKHRoYXRNdXRhdGlvbjogc3RyaW5nKSA9PiB7XG4gICAgICBsZXQgZGJfZGF0YXNvdXJjZSA9IGRiX2RhdGFzb3VyY2VfbWFydmVsO1xuICAgICAgbGV0IHJlcXVlc3RfbWFwcGluZ1RlbXBsYXRlO1xuICBcbiAgXG4gICAgICBpZihcbiAgICAgICAgICAgdGhhdE11dGF0aW9uID09PSBcImNyZWF0ZUdyYXBoXCJcbiAgICAgICkge1xuICAgICAgICByZXF1ZXN0X21hcHBpbmdUZW1wbGF0ZSA9IGFwcHN5bmMuTWFwcGluZ1RlbXBsYXRlLmR5bmFtb0RiUHV0SXRlbShcbiAgICAgICAgICBhcHBzeW5jLlByaW1hcnlLZXkucGFydGl0aW9uKCdpZCcpLmF1dG8oKSxcbiAgICAgICAgICBhcHBzeW5jLlZhbHVlcy5wcm9qZWN0aW5nKClcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYoXG4gICAgICAgICAgIHRoYXRNdXRhdGlvbiA9PT0gXCJkZWxldGVHcmFwaFwiXG4gICAgICApIHtcbiAgICAgICAgcmVxdWVzdF9tYXBwaW5nVGVtcGxhdGUgPSBhcHBzeW5jLk1hcHBpbmdUZW1wbGF0ZS5keW5hbW9EYkRlbGV0ZUl0ZW0oJ2lkJywgJ2lkJyk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmKFxuICAgICAgICAgICB0aGF0TXV0YXRpb24gPT09IFwiZWRpdEdyYXBoXCJcbiAgICAgICkge1xuICAgICAgICByZXF1ZXN0X21hcHBpbmdUZW1wbGF0ZSA9IGFwcHN5bmMuTWFwcGluZ1RlbXBsYXRlLmR5bmFtb0RiUHV0SXRlbShcbiAgICAgICAgICBhcHBzeW5jLlByaW1hcnlLZXkucGFydGl0aW9uKCdpZCcpLmlzKCdpZCcpLFxuICAgICAgICAgIGFwcHN5bmMuVmFsdWVzLnByb2plY3RpbmcoKVxuICAgICAgICApO1xuICAgICAgfVxuICAgIFxuICBcbiAgICAgIC8vZGVzY3JpYmluZyByZXNvbHZlciBmb3IgZGF0YXNvdXJjZVxuICAgICAgZGJfZGF0YXNvdXJjZS5jcmVhdGVSZXNvbHZlcih7XG4gICAgICAgIHR5cGVOYW1lOiBcIk11dGF0aW9uXCIsXG4gICAgICAgIGZpZWxkTmFtZTogdGhhdE11dGF0aW9uLFxuICAgICAgICByZXF1ZXN0TWFwcGluZ1RlbXBsYXRlOiByZXF1ZXN0X21hcHBpbmdUZW1wbGF0ZSxcbiAgICAgICAgcmVzcG9uc2VNYXBwaW5nVGVtcGxhdGU6IGFwcHN5bmMuTWFwcGluZ1RlbXBsYXRlLmR5bmFtb0RiUmVzdWx0SXRlbSgpXG4gICAgICB9KTtcbiAgICB9KTtcbi8vKioqKioqKioqKioqKioqKioqKioqKioqKipNVVRBVElPTlMqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXG5cblxuXG5cbi8vKioqKioqKioqKioqKioqKioqKioqKioqKipRVUVSSUVTKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgY29uc3QgcXVlcmllcyA9IFtcbiAgICAgIFwiYWxsR3JhcGhzXCIsIFwiZ2V0R3JhcGhCeUlEXCJcbiAgICBdO1xuICAgIHF1ZXJpZXMuZm9yRWFjaCgodGhhdFF1ZXJ5OiBzdHJpbmcpID0+IHtcbiAgICAgIC8vZGVzY3JpYmluZyByZXNvbHZlciBmb3IgZGF0YXNvdXJjZSAoIGZvciBnZXQgZGF0YSBmcm9tIER5bmFtb0RCIClcbiAgICAgIG15TGFtYmRhX2RhdGFzb3VyY2UuY3JlYXRlUmVzb2x2ZXIoe1xuICAgICAgICB0eXBlTmFtZTogXCJRdWVyeVwiLFxuICAgICAgICBmaWVsZE5hbWU6IHRoYXRRdWVyeVxuICAgICAgfSk7XG4gICAgfSk7XG4vLyoqKioqKioqKioqKioqKioqKioqKioqKioqUVVFUklFUyoqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cblxuXG5cblxuLy8qKioqKioqKioqKioqKioqKioqKioqKioqKkNPR05JVE8qKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAvL2NyZWF0aW5nIHVzZXJwb29sXG4gICAgY29uc3QgdXNlclBvb2wgPSBuZXcgY29nbml0by5Vc2VyUG9vbCh0aGlzLCAnbWFydmVsLVVzZXJQb29sJywge1xuICAgICAgLy91c2VyIGNhbiBzaWdpbiB3aXRoICdlbWFpbCcgJiAndXNlcm5hbWUnICggY2FuIGFsc28gaW5jbHVkZSBwaG9uZSwgcHJlZmVycmVkVXNlcm5hbWUgKVxuICAgICAgc2lnbkluQWxpYXNlczoge1xuICAgICAgICBlbWFpbDogdHJ1ZSxcbiAgICAgICAgdXNlcm5hbWU6IHRydWVcbiAgICAgIH0sXG5cblxuICAgICAgLy9kZWZpbmluZyBwb2xpY2llcyBmb3IgJ3Bhc3N3b3JkJyAoIGRlZmF1bHQgcG9saWNpZXMgYXJlIGFsbCB0cnVlIClcbiAgICAgIHBhc3N3b3JkUG9saWN5OiB7XG4gICAgICAgIG1pbkxlbmd0aDogOCxcbiAgICAgICAgcmVxdWlyZUxvd2VyY2FzZTogdHJ1ZSxcbiAgICAgICAgcmVxdWlyZVVwcGVyY2FzZTogdHJ1ZSxcbiAgICAgICAgcmVxdWlyZURpZ2l0czogdHJ1ZSxcbiAgICAgICAgcmVxdWlyZVN5bWJvbHM6IGZhbHNlXG4gICAgICB9LFxuXG5cbiAgICAgIC8vYWxsb3cgdXNlcnMgZm9yICdzaWdudXAnIHRvIGNyZWF0ZSBhY2NvdW50ICggc28gbm90IG9ubHkgYWRtaW5pc3RyYXRvciBtYWtlcyBhY2NvdW50IClcbiAgICAgIHNlbGZTaWduVXBFbmFibGVkOiB0cnVlLFxuXG5cbiAgICAgIC8vdXNlciBjYW4gcmVjb3ZlciBhY2NvdW50IHdpdGggJ2VtYWlsJyBvbmx5ICggY2FuIGFsc28gaW5jbHVkZSBQSE9ORV9PTkxZLCBQSE9ORV9BTkRfRU1BSUwsIGV0YyApXG4gICAgICBhY2NvdW50UmVjb3Zlcnk6IGNvZ25pdG8uQWNjb3VudFJlY292ZXJ5LkVNQUlMX09OTFksXG5cblxuICAgICAgLy92ZXJpZmljYXRpb24gd2hpbGUgY3JlYXRpbmcgYW4gYWNjb3VudCB1c2luZyAnZW1haWwnIGJ5IHNlbmRpbmcgYSB2ZXJpZmljYXRpb24gY29kZSAoIGNhbiBhbHNvIGFkZCBwaG9uZSApXG4gICAgICBhdXRvVmVyaWZ5OiB7XG4gICAgICAgIGVtYWlsOiB0cnVlXG4gICAgICB9LFxuXG5cbiAgICAgIC8vY3VzdG9taXplIHlvdXIgJ2VtYWlsJyAmICdwaG9uZScgdmVyaWZpY2F0aW9uIG1lc3NhZ2VzXG4gICAgICB1c2VyVmVyaWZpY2F0aW9uOiB7XG4gICAgICAgIGVtYWlsU3ViamVjdDogJ1ZlcmlmeSB5b3VyIGVtYWlsIGZvciBNYXJ2ZWwhJyxcbiAgICAgICAgZW1haWxCb2R5OiAnSGVsbG8sIFRoYW5rcyBmb3IgdXNpbmcgTWFydmVsISBZb3VyIHZlcmlmaWNhdGlvbiBjb2RlIGlzIHsjIyMjfScsXG4gICAgICAgIGVtYWlsU3R5bGU6IGNvZ25pdG8uVmVyaWZpY2F0aW9uRW1haWxTdHlsZS5DT0RFXG4gICAgICB9XG4gICAgfSk7XG5cblxuICAgIC8vY3JlYXRpbmcgJ0NsaWVudCcgZm9yIGNvbm5lY3QgQ09HTklUTyB3aXRoIGZyb250ZW5kXG4gICAgY29uc3QgdXNlclBvb2xDbGllbnQgPSBuZXcgY29nbml0by5Vc2VyUG9vbENsaWVudCh0aGlzLCAnbWFydmVsLXVzZXJQb29sQ2xpZW50LWFtcGxpZnknLCB7XG4gICAgICB1c2VyUG9vbFxuICAgIH0pO1xuXG5cbiAgICAvL3NlbmQgYnkgdXNlclBvb2xcbiAgICBjb25zdCB1c2VyUG9vbElkID0gbmV3IENmbk91dHB1dCh0aGlzLCAnbWFydmVsLXVzZXJQb29sSWQnLCB7XG4gICAgICB2YWx1ZTogdXNlclBvb2wudXNlclBvb2xJZFxuICAgIH0pO1xuXG5cbiAgICAvL3NlbmQgYnkgdXNlclBvb2xcbiAgICBjb25zdCB1c2VyUG9vbENsaWVudElkID0gbmV3IENmbk91dHB1dCh0aGlzLCAnbWFydmVsLXVzZXJQb29sQ2xpZW50SWQnLCB7XG4gICAgICB2YWx1ZTogdXNlclBvb2xDbGllbnQudXNlclBvb2xDbGllbnRJZFxuICAgIH0pO1xuLy8qKioqKioqKioqKioqKioqKioqKioqKioqKkNPR05JVE8qKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgfVxufSJdfQ==