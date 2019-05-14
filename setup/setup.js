require('dotenv').config();
const path = require('path');
const { writeFileSync } = require('fs');
const IonicClient = require('../server/ionic/client');
const createIonicGroups = require('./create-ionic-groups');
const createIonicDataMarkings = require('./create-ionic-data-markings');
const createIonicPolicies = require('./create-ionic-data-policies');
const createDynamoDbTable = require('./create-dynamodb-table');

async function main() {
    const client = new IonicClient({
        baseUrl: process.env.IONIC_API_BASE_URL,
        tenantId: process.env.IONIC_TENANT_ID,
        authToken: process.env.IONIC_API_AUTH_TOKEN
    });

    try {
        const groups = await createIonicGroups(client);
        saveGroupsJson(groups);
        await createIonicDataMarkings(client);
        await createIonicPolicies(client);
        await createDynamoDbTable();

        console.log('Done!');
    } catch (err) {
        console.error('Something went wrong: %o', err.response ? err.response.body : err);
    }
}

function saveGroupsJson(groups) {
    const json = JSON.stringify(groups, null, 2);
    writeFileSync(path.join(__dirname, '..', 'server', 'data', 'groups.json'), json);
    console.log(
        'The following was written to server/data/groups.json: %s',
        json
    );
}

main();