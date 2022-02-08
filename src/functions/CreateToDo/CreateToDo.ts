import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 as uuidv4 } from 'uuid'

import client from '../../utils/dynamoDBClient'

export const handler: APIGatewayProxyHandler = async (event) => {
    const { user_id } = event.pathParameters
    const { title, deadline } = JSON.parse(event.body)

    const id = uuidv4()

    const toDo = {
        id,
        user_id,
        title,
        done: false,
        deadline: new Date(deadline).toDateString()
    }

    await client.put({
        TableName: "todos",
        Item: toDo
    }).promise()

    const response = await client.query({
        TableName: "todos",
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: {
            ":id": id
        }
    }).promise()

    return {
        statusCode: 201,
        body: JSON.stringify(response.Items[0])
    }
}