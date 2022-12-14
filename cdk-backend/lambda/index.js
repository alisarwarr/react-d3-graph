"use strict";
//AWS
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
exports.handler = async (event) => {
    var _a, _b;
    if (((_a = event === null || event === void 0 ? void 0 : event.info) === null || _a === void 0 ? void 0 : _a.fieldName) === "allGraphs") {
        try {
            const params = {
                TableName: process.env.TABLE_NAME || ''
            };
            const response = await docClient.scan(params).promise();
            return response.Items;
        }
        catch (err) {
            return err.message;
        }
    }
    else if (((_b = event === null || event === void 0 ? void 0 : event.info) === null || _b === void 0 ? void 0 : _b.fieldName) === "getGraphByID") {
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
            return err.message;
        }
    }
    return null;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsS0FBSztBQUNMLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUMvQixNQUFNLFNBQVMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsY0FBYyxFQUFFLENBQUM7QUFHcEQsT0FBTyxDQUFDLE9BQU8sR0FBRyxLQUFLLEVBQUMsS0FBVSxFQUFFLEVBQUU7O0lBQ2xDLElBQ0ksT0FBQSxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsSUFBSSwwQ0FBRSxTQUFTLE1BQUssV0FBVyxFQUN4QztRQUNFLElBQUk7WUFDQSxNQUFNLE1BQU0sR0FBRztnQkFDWCxTQUFTLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLElBQUksRUFBRTthQUMxQyxDQUFDO1lBRUYsTUFBTSxRQUFRLEdBQUcsTUFBTSxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3hELE9BQU8sUUFBUSxDQUFDLEtBQUssQ0FBQztTQUN6QjtRQUNELE9BQU8sR0FBRyxFQUFFO1lBQ1IsT0FBUSxHQUFhLENBQUMsT0FBTyxDQUFDO1NBQ2pDO0tBQ0o7U0FDSSxJQUNELE9BQUEsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLElBQUksMENBQUUsU0FBUyxNQUFLLGNBQWMsRUFDM0M7UUFDRSxJQUFJO1lBQ0EsTUFBTSxNQUFNLEdBQUc7Z0JBQ1gsU0FBUyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxJQUFJLEVBQUU7Z0JBQ3ZDLEdBQUcsRUFBRTtvQkFDRCxFQUFFLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxFQUFFO2lCQUN6QjthQUNKLENBQUM7WUFFRixNQUFNLFFBQVEsR0FBRyxNQUFNLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDdkQsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDO1NBQ3hCO1FBQ0QsT0FBTyxHQUFHLEVBQUU7WUFDUixPQUFRLEdBQWEsQ0FBQyxPQUFPLENBQUM7U0FDakM7S0FDSjtJQUdELE9BQU8sSUFBSSxDQUFDO0FBQ2hCLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vQVdTXG5jb25zdCBBV1MgPSByZXF1aXJlKCdhd3Mtc2RrJyk7XG5jb25zdCBkb2NDbGllbnQgPSBuZXcgQVdTLkR5bmFtb0RCLkRvY3VtZW50Q2xpZW50KCk7XG5cblxuZXhwb3J0cy5oYW5kbGVyID0gYXN5bmMoZXZlbnQ6IGFueSkgPT4ge1xuICAgIGlmIChcbiAgICAgICAgZXZlbnQ/LmluZm8/LmZpZWxkTmFtZSA9PT0gXCJhbGxHcmFwaHNcIlxuICAgICkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgICAgICAgICAgIFRhYmxlTmFtZTogcHJvY2Vzcy5lbnYuVEFCTEVfTkFNRSB8fCAnJ1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBkb2NDbGllbnQuc2NhbihwYXJhbXMpLnByb21pc2UoKTtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5JdGVtcztcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gKGVyciBhcyBFcnJvcikubWVzc2FnZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChcbiAgICAgICAgZXZlbnQ/LmluZm8/LmZpZWxkTmFtZSA9PT0gXCJnZXRHcmFwaEJ5SURcIlxuICAgICkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgICAgICAgICAgIFRhYmxlTmFtZTogcHJvY2Vzcy5lbnYuVEFCTEVfTkFNRSB8fCAnJyxcbiAgICAgICAgICAgICAgICBLZXk6IHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IGV2ZW50LmFyZ3VtZW50cy5pZFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZG9jQ2xpZW50LmdldChwYXJhbXMpLnByb21pc2UoKTtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5JdGVtO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiAoZXJyIGFzIEVycm9yKS5tZXNzYWdlO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICByZXR1cm4gbnVsbDtcbn0iXX0=