const { formatNamesList, reportError } = require('./utils');
const {
    DataPolicy,
    Attributes,
    stringAtLeastOneMemberOf
} = require('../server/ionic/data-policy');

const POLICIES = [
    {
        policyId: 'Healthcare Demo Patient Info',
        description: 'Data is marked with classification patient_physician',
        ruleCombiningAlgId: 'deny-overrides',
        classificationValues: ['patient_physician'],
        allowedGroups: ['5cab158ce5a7320cf0fd0416', '5cab15eb3053363b20fd03c5'],
        ruleDescription: 'Allow access if user is in the groups Patients or Physicians'
    },
    {
        policyId: 'Healthcare Demo Insurance Info',
        description: 'Data is marked with classification patient_physician_insurer',
        ruleCombiningAlgId: 'deny-overrides',
        classificationValues: ['patient_physician_insurer'],
        allowedGroups: ['5cab158ce5a7320cf0fd0416', '5cab15eb3053363b20fd03c5', '5cab160c9c97e32f42fd0412'],
        ruleDescription: 'Allow access if user is in the groups Patients, Physicians or Insurers'
    }
];

async function createIonicDataPolicies(client) {
    const { Resources: existingPolicies } = await client.findDataPolicies({
        searchParams: {
            policyId: { __any: POLICIES.map(p => p.policyId) }
        }
    })

    const existingPolicyIds = existingPolicies.map(p => p.policyId);
    const missingPolicies = POLICIES.filter(p => existingPolicyIds.includes(p.policyId) === false);

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
            .when(stringAtLeastOneMemberOf(Attributes.resource.classification, p.classificationValues))
            .allowIf(stringAtLeastOneMemberOf(Attributes.subject.group, p.allowedGroups), p.ruleDescription)
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
