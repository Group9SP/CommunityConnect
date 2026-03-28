/* Amplify Params - DO NOT EDIT
	API_COMMUNITYCONNECT_GRAPHQLAPIENDPOINTOUTPUT
	API_COMMUNITYCONNECT_GRAPHQLAPIIDOUTPUT
	API_COMMUNITYCONNECT_GRAPHQLAPIKEYOUTPUT
	AUTH_COMMUNITYCONNECTFB602F9C_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

const REVIEW_TABLE = process.env.API_COMMUNITYCONNECT_REVIEWTABLE_NAME || process.env.API_COMMUNITYCONNECT_REVIEWTABLE_NAME;
const BY_USER_INDEX = 'byUser'; // Make sure this matches your schema/index name

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);

    const { userID, businessID } = event.arguments.input;

    // Query for existing review by this user for this business
    const params = {
        TableName: REVIEW_TABLE,
        IndexName: BY_USER_INDEX,
        KeyConditionExpression: 'userID = :u',
        FilterExpression: 'businessID = :b',
        ExpressionAttributeValues: {
            ':u': userID,
            ':b': businessID,
        },
    };

    try {
        const result = await docClient.query(params).promise();
        if (result.Items && result.Items.length > 0) {
            // Review already exists
            return {
                statusCode: 400,
                body: JSON.stringify('You have already reviewed this business.'),
            };
        }
        // No review exists, allow creation
        return {
            statusCode: 200,
            body: JSON.stringify('OK'),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify('Internal server error'),
        };
    }
};
