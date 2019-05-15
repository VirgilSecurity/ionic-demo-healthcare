const { formatNamesList, reportError } = require('./utils');
const {
    DataPolicy,
    Attributes,
    stringAtLeastOneMemberOf
} = require('../server/ionic/data-policy');

const { APP_POLICIES } = require('./app-data');

async function createIonicDataPolicies(client) {
    const { Resources: existingPolicies } = await client.findDataPolicies({
        searchParams: {
            policyId: { __any: APP_POLICIES.map(p => p.policyId) }
        }
    })

    const existingPolicyIds = existingPolicies.map(p => p.policyId);
    const missingPolicies = APP_POLICIES.filter(p => existingPolicyIds.includes(p.policyId) === false);

    if (existingPolicies.length > 0) {
        console.log(`${formatNamesList(existingPolicies.map(p => p.policyId), 'Policy', 'Policies')} already exist`);
    }

    if (missingPolicies.length > 0) {
        console.log(`Creating ${formatNamesList(missingPolicies.map(p => p.policyId), 'policy', 'policies')}`);
        const policyRequests = missingPolicies.map(p => {
            return new DataPolicy({
                policyId: p.policyId,
                description: p.description,
                ruleCombiningAlgId: p.ruleCombiningAlgId,
                enabled: true
            })
            .when(stringAtLeastOneMemberOf(Attributes.subject.groupName, p.appliesToGroup))
            .allowIf(stringAtLeastOneMemberOf(Attributes.resource.classification, p.allowDataMarkedWith), p.ruleDescription)
            .toJSON();
        });
        await Promise.all(policyRequests.map(pr => client.createPolicy(pr)));
        console.log('Policies created');
    }
}

module.exports = createIonicDataPolicies;

if (require.main === module) {
    require('dotenv').config();
    const IonicClient = require('../server/ionic/client');

    const client = new IonicClient({
        baseUrl: process.env.IONIC_API_BASE_URL,
        tenantId: process.env.IONIC_TENANT_ID,
        authToken: process.env.IONIC_API_AUTH_TOKEN
    });

    createIonicDataPolicies(client)
    .then(() => console.log('Done!'))
    .catch(reportError);
}
