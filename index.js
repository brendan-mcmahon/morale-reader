const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const guid = event.queryStringParameters.guid;
  const value = parseInt(event.queryStringParameters.value);
  const date = new Date().toISOString().split("T")[0];

  console.log(`Updating record ${guid} with value ${value}`);

  try {
    await updateRecordValue(guid, value, date);

    return {
      statusCode: 200,
      body: JSON.stringify("Record updated successfully"),
    };
  } catch (error) {
    console.error("Error updating record", error);

    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};

const updateRecordValue = async (guid, value, date) => {
  // This will break if we're trying to update not today
  const params = {
    TableName: "morale",
    Key: {
      id: guid,
      date: date,
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
