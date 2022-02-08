import { APIGatewayProxyHandler } from "aws-lambda";

import client from '../../utils/dynamoDBClient'

export const handler: APIGatewayProxyHandler = async (event) => {
    const {user_id } = event.pathParameters

    const todos = await client.query({
        TableName: "todos",
        IndexName: "UserIdIndex",
        KeyConditionExpression: "user_id = :user_id",
        ExpressionAttributeValues: {
            ":user_id": user_id
        },
        ScanIndexForward: false
    }).promise()

    return {
        statusCode: 200,
        body: JSON.stringify(todos.Items)
    }
}