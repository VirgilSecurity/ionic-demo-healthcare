const { DynamoDB, EnvironmentCredentials} = require('aws-sdk');
const debug = require('../debug');

const getDefaults = () => ({
    apiVersion: '2012-08-10',
    region: 'us-east-1',
    endpoint: process.env.AWS_DYNAMODB_ENDPOINT,
    params: {
        TableName: process.env.AWS_DYNAMODB_TABLE_NAME
    },
    credentials: isLocalhost(process.env.AWS_DYNAMODB_ENDPOINT)
        ? undefined
        : new EnvironmentCredentials('AWS')
});

function isLocalhost(url) {
    const hostname = new URL(url).hostname;
    return hostname === 'localhost' || hostname === '127.0.0.1';
}

const INITIAL_STATE = {};

class StateStorage {
    constructor(options = {}) {
        const config = { ...(getDefaults()), ...options };
        this.docClient = new DynamoDB.DocumentClient(config);
        this.stateKey = options.stateKey || 'DEMO_STATE.V1';
    }

    async getState() {
        debug('retrieving app state');
        const response = await this.docClient.get({
            Key: { key: this.stateKey },
            ConsistentRead: true
        }).promise();

        return response.Item || INITIAL_STATE;
    }

    async updateState({ medical_history, office_visit_notes, prescription, insurer_reply }) {
        const newState = { medical_history, office_visit_notes, prescription, insurer_reply };
        let updateExpressions = [];
        let expressionAttributeValues = {};
        Object.keys(newState).forEach(key => {
            if (typeof newState[key] !== 'undefined') {
                updateExpressions.push(`${key} = :${key}`);
                expressionAttributeValues[`:${key}`] = newState[key];
            }
        });

        debug('updating app state');

        const params = {
            Key: { key: this.stateKey },
            UpdateExpression: `SET ${updateExpressions.join(', ')}`,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'ALL_NEW'
        };

        const response = await this.docClient.update(params).promise();
        debug('updated app state');
        return response.Attributes;
    }

    async resetState() {
        debug('deleting app state');
        await this.docClient.delete({
            Key: { key: this.stateKey }
        }).promise();
        debug('deleted app state');
        return INITIAL_STATE;
    }
}

module.exports = StateStorage;
