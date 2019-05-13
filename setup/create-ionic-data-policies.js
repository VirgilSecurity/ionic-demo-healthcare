require('dotenv').config();
const IonicClient = require('../server/ionic/client');
const {
    DataPolicy,
    Attributes,
    stringAtLeastOneMemberOf
} = require('../server/ionic/data-policy');

const POLICY_IDS = ['Healthcare Demo Insurance Info', 'Healthcare Demo Patient Info'];

const client = new IonicClient({
    baseUrl: process.env.IONIC_API_BASE_URL,
    tenantId: process.env.IONIC_TENANT_ID,
    authToken: process.env.IONIC_API_AUTH_TOKEN
});

async function createIonicDataPolicies() {
    const existingPoliciesResponse = await client.findDataPolicies({
        searchParams: {
            policyId: { __any: POLICY_IDS }
        }
    })

    console.log(JSON.stringify(existingPoliciesResponse, null, 2));
    const policy = new DataPolicy({
        id: 'Healthcare Demo Insurance Info',
        description: 'All data',
        enabled: true
    })
    .when(stringAtLeastOneMemberOf(Attributes.resource.classification, ['patien_physician']))
    .allowIf(stringAtLeastOneMemberOf(Attributes.subject.group, ['group_id']))
    .toJSON();
    console.log(policy);
}

module.exports = createIonicDataPolicies;

if (require.main === module) {
    createIonicDataPolicies()
    .then(() => console.log('Done!'))
    .catch(err => console.error('Error creating data policies: %o', err));
}
