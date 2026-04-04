const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event, context) => {
  const date = new Date();
  const isoDate = date.toISOString();

  // This environment variable is automatically provided by Amplify 
  // when you grant the function access to the API/Table
  const tableName = process.env.API_COMMUNITYCONNECT_PROFILETABLE_NAME;
  console.log("Received event:", JSON.stringify(event, null, 2));
  console.log("Using DynamoDB table:", tableName);

  if (!tableName) {
    console.log("Error: DynamoDB table name environment variable is not set.");
    return event;
  }

  if (event.request.userAttributes.sub) {
    const params = {
      TableName: tableName,
      Item: {
        id: event.request.userAttributes.sub,          // The Unique User ID from Cognito
        __typename: 'Profile',                         // Essential for AppSync/GraphQL mapping
        owner: event.request.userAttributes.sub,       // Required for @auth owner rules
        email: event.request.userAttributes.email,
        full_name: event.request.userAttributes.name || "New User", // Matches your schema field
        createdAt: isoDate,
        updatedAt: isoDate,
      },
    };
    console.log("DynamoDB Put params:", JSON.stringify(params, null, 2));

    try {
      const result = await ddbDocClient.send(new PutCommand(params));
      console.log("Success: Profile created in DynamoDB", result);
    } catch (err) {
      console.log("DynamoDB Error:", err);
      // We don't throw the error here so that the user can still 
      // complete their sign-up even if the profile creation lags
    }
  } else {
    console.log("Error: No user 'sub' found in the event object.");
  }

  // Return the event to Cognito so the confirmation flow finishes
  return event;
};