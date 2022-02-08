import type { AWS } from '@serverless/typescript';


const serverlessConfiguration: AWS = {
  service: 'serverlesstodo',
  frameworkVersion: '3',
  
  plugins: ['serverless-esbuild', 'serverless-dynamodb-local', 'serverless-offline'],

  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  
  functions: {
    createToDo: {
      handler: "src/functions/CreateToDo/CreateToDo.handler",
      events: [
        {
          http: {
            path: "todos/{user_id}",
            method: "post",

            cors: true
          }
        }
      ]
    },
    getToDos: {
      handler: "src/functions/GetUserToDos/GetUserToDos.handler",
      events: [
        {
          http: {
            path: "todos/{user_id}",
            method: "get",

            cors: true
          }
        }
      ]
    }
  },

  package: { individually: true },

  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
      external: ["chrome-aws-lambda"]
    },

    dynamodb: {
      stages: ["dev", "local"],
      start: {
        port: 8000,
        migrate: true,
        inMemory: true
      }
    }
  },
  
  resources: {
    Resources: {
      dbToDo: {
        Type: "AWS::DynamoDB::Table",

        Properties: {
          TableName: "todos",

          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
          },

          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S"
            },
            {
              AttributeName: "user_id",
              AttributeType: "S"
            }
          ],
          
          KeySchema: [
            {
              AttributeName: "id",
              KeyType: "HASH"
            }
          ],

          GlobalSecondaryIndexes: [
            {
              IndexName: "UserIdIndex",
              KeySchema: [
                {
                  AttributeName: "user_id",
                  KeyType: "HASH"
                }
              ],
              Projection: {
                ProjectionType: "ALL"
              },
              ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5
              }
            }
          ]
        }
      }
    }
  }  
};

module.exports = serverlessConfiguration;
