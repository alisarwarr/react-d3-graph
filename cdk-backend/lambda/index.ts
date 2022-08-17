//AWS
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();


exports.handler = async(event: any) => {
    if (
        event?.info?.fieldName === "allGraphs"
    ) {
        try {
            const params = {
                TableName: process.env.TABLE_NAME || ''
            };

            const response = await docClient.scan(params).promise();
            return response.Items;
        }
        catch (err) {
            return (err as Error).message;
        }
    }
    else if (
        event?.info?.fieldName === "getGraphByID"
    ) {
        try {
            const params = {
                TableName: process.env.TABLE_NAME || '',
                Key: {
                    id: event.arguments.id
                }
            };

            const response = await docClient.get(params).promise();
            return response.Item;
        }
        catch (err) {
            return (err as Error).message;
        }
    }


    return null;
}