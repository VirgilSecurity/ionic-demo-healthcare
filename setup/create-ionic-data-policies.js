const { formatNamesList, reportError } = require('./utils');
const {
    policies: { createPolicy, Attributes, fns}
} = require('ionic-admin-sdk');

const { APP_POLICIES } = require('./app-data');

async function createIonicDataPolicies(client) {
    const { Resources: existingPolicies } = await client.dataPolicies.listPolicies({
        filter: {
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
            return createPolicy({
                policyId: p.policyId,
                ruleCombiningAlgId: p.ruleCombiningAlgId,
                enabled: true
            })
            .appliesTo(fns.stringAtLeastOneMemberOf(Attributes.subject.groupName, p.appliesToGroup))
            .allowIf(fns.stringAtLeastOneMemberOf(Attributes.resource.classification, p.allowDataMarkedWith))
            .denyOtherwise()
            .toJson();
        });
        await Promise.all(policyRequests.map(pr => client.dataPolicies.createPolicy(pr)));
        console.log('Policies created');
    }
}

module.exports = createIonicDataPolicies;

if (require.main === module) {
    require('dotenv').config();
    const { IonicApiClient } = require('ionic-admin-sdk');

    const client = new IonicApiClient({
        baseUrl: process.env.IONIC_API_BASE_URL,
        tenantId: process.env.IONIC_TENANT_ID,
        auth: {
            type: 'bearer',
            secretToken: process.env.IONIC_API_AUTH_TOKEN
        }
    });

    createIonicDataPolicies(client)
    .then(() => console.log('Done!'))
    .catch(reportError);
}
