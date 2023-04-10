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

    if (error.code === "ConditionalCheckFailedException") {
      return {
        statusCode: 400,
        body: JSON.stringify("Record not found, update not performed"),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify(error),
      };
    }
  }
};

const updateRecordValue = async (guid, value, date) => {
  const params = {
    TableName: "morale",
    Key: {
      id: guid,
      responseDate: date,
    },
    UpdateExpression: "SET #value = :value, #status = :status",
    ExpressionAttributeNames: {
      "#value": "value",
      "#status": "status",
    },
    ExpressionAttributeValues: {
      ":value": value,
      ":status": "complete",
    },
    ConditionExpression:
      "attribute_exists(id) AND attribute_exists(responseDate)",
  };

  await dynamodb.update(params).promise();
};
