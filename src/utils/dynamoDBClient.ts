import { DynamoDB } from 'aws-sdk'

const options = {
    region: "localhost",
    endpoint: "http://localhost:8000",
    accessKeyId: "x",
    secretAccessKey: "x"
}

const client = process.env.IS_OFFLINE ? new DynamoDB.DocumentClient(options) : new DynamoDB.DocumentClient()

export default client
