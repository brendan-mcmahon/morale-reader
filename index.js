const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const guid = event.queryStringParameters.guid;
  const value = parseInt(event.queryStringParameters.value);

  try {
    await updateRecordValue(guid, value);

    return {
      statusCode: 200,
      body: JSON.stringify("Record updated successfully"),
    };
  } catch (error) {
    console.error("Error updating record", error);

    return {
      statusCode: 500,
      body: JSON.stringify("Error updating record"),
    };
  }
};

const updateRecordValue = async (guid, value) => {
  const params = {
    TableName: "morale",
    Key: {
      id: guid,
    },
    UpdateExpression: "SET #value = :value",
    ExpressionAttributeNames: {
      "#value": "value",
    },
    ExpressionAttributeValues: {
      ":value": value,
    },
  };

  await dynamodb.update(params).promise();
};
