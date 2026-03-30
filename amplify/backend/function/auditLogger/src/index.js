// amplify/backend/function/auditLogger/src/index.js
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const AUDIT_TABLE = process.env.AUDIT_TABLE;

exports.handler = async (event) => {
  // Example event: { userId, action, resource, details }
  const { userId, action, resource, details } = event.arguments.input;
  const timestamp = new Date().toISOString();

  await dynamo.put({
    TableName: AUDIT_TABLE,
    Item: {
      id: `${userId}-${timestamp}`,
      userId,
      action,
      resource,
      details,
      timestamp,
    },
  }).promise();

  return { success: true };
};
