require('dotenv').config();
const path = require('path');
const { writeFileSync } = require('fs');
const IonicClient = require('../server/ionic/client');

const APP_GROUP_NAMES = ['Patients', 'Physicians', 'Insurers'];

const client = new IonicClient({
    baseUrl: process.env.IONIC_API_BASE_URL,
    tenantId: process.env.IONIC_TENANT_ID,
    authToken: process.env.IONIC_API_AUTH_TOKEN
});

async function createIonicGroups() {
    const existingGroupsResponse = await client.findGroups({
        searchParams: {
            name: { __any: APP_GROUP_NAMES }
        },
        attributes: ['id', 'displayName']
    });

    let groups = existingGroupsResponse.Resources;
    const existingGroupNames = groups.map(group => group.displayName);
    const missingGroupNames = APP_GROUP_NAMES.filter(name => existingGroupNames.includes(name) === false);

    if (existingGroupNames.length > 0) {
        console.log(`Groups ${formatNamesList(existingGroupNames)} already exist`);
    }

    if (missingGroupNames.length > 0) {
        console.log(`Creating groups ${formatNamesList(missingGroupNames)}`);
        const createGroupsResponses = await Promise.all(
            missingGroupNames.map(name => client.createGroup({ displayName: name }))
        );
        groups = groups.concat(createGroupsResponses);
    }

    return groups.reduce((res, group) => ({ ...res, [group.displayName.toLowerCase()]: group.id }), {});
}

function formatNamesList(names) {
    if (names.length > 2) {
        return `${names.slice(0, -1).join(', ')} and ${names.slice(-1)}`
    }
    return names.join(', ');
}


module.exports = createIonicGroups;

if (require.main === module) {
    createIonicGroups()
    .then((res) => {
        const json = JSON.stringify(res, null, 2);
        writeFileSync(path.join(__dirname, '..', 'server', 'data', 'groups.json'), json);
        console.log(
            'Done! The following was written to server/data/groups.json: %s',
            json
        );
    })
    .catch(err => console.error('Something went wrong: %o', err));
}
